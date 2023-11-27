import Drive from '@ioc:Adonis/Core/Drive'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import crypto from 'node:crypto'

export default class EmpresasController {
  public async index({ request }: HttpContextContract) {
    try {
      const { city, uf, items } = request.qs()

      const mappedItems = String(items)
        .split(',')
        .map((item) => Number(item.trim()))

      const empresas = await Database.query()
        .from('empresas')
        .join('empresas_items', 'empresas.id', '=', 'empresas_items.empresa_id')
        .whereIn('empresas_items.id', mappedItems)
        .where('city', city)
        .where('uf', uf)
        .distinct()
        .select('empresas.*')

      const url = async (empresaImage: string) => await Drive.getUrl('./images/' + empresaImage)

      const empresasMapped = await Promise.all(
        empresas.map(async (empresa) => {
          const empresaImageUrl = await url(empresa.image)

          return {
            ...empresa,
            image_url: `http://192.168.2.105:3333${empresaImageUrl}`,
          }
        })
      )

      return empresasMapped
    } catch (e) {
      e
    }
  }

  public async show({ request, response }: HttpContextContract) {
    const id = request.param('id')

    const empresa = await Database.query().from('empresas').where('id', id).first()

    const empresaItems = await Database.query()
      .from('empresas_items')
      .where('empresa_id', id)
      .select('id')

    if (!empresa) {
      return response.status(404).json({ message: 'Empresa não encontrada.' })
    }

    const url = await Drive.getUrl('./images/' + empresa.image)

    const empresaCadastrada = {
      ...empresa,
      empresaItems,
      image_url: `http://192.168.2.105:3333${url}`,
    }

    return { empresa: empresaCadastrada }
  }

  public async create({ request }: HttpContextContract) {
    const { name, email, whatsapp, city, uf, latitude, longitude, items } = request.body()

    const transaction = await Database.transaction()

    const image = request.file('image')

    const hash = crypto.randomBytes(20).toString('hex')

    const filename = `${hash}_${image?.clientName}`

    const empresa = {
      name,
      email,
      whatsapp,
      city,
      uf,
      latitude,
      longitude,
      image: filename,
    }

    const insertedIds = await transaction.insertQuery().table('empresas').insert(empresa)

    if (image) {
      await image.moveToDisk('./images', { name: filename })
    }

    const empresaId = insertedIds[0]

    const empresaItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((id: number) => ({ id, empresa_id: empresaId }))

    await transaction.insertQuery().table('empresas_items').insert(empresaItems)

    await transaction.commit()

    return {
      id: empresaId,
      ...empresa,
    }
  }
}
