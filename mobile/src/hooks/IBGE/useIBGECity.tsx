import axios from "axios";
import { useEffect, useState } from "react";

interface useIBGECityHookProps {
  /**
   * Uma callback que receberá o valor 'value' do primeiro objeto da array citiesLabeled como argumento.
   */
  callback: (...args: any[]) => void;
  uf: string;
}

export function useIBGECity(props: useIBGECityHookProps) {
  const { callback, uf } = props;

  const [cities, setCities] = useState<Label[]>([]);

  useEffect(() => {
    if (uf === "") return;

    axios
      .get<IBGECidade[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
      )
      .then((res) => {
        const citiesResponse = res.data.map((city) => city.nome);

        const citiesMapped = citiesResponse.map((city) => ({
          label: city,
          value: city,
        }));

        setCities(citiesMapped);

        callback(citiesMapped[0]?.value);
      });
  }, [uf]);

  return { cities };
}

interface IBGECidade {
  nome: string;
}

interface Label {
  label: string;
  value: string;
}

export { IBGECidade };
