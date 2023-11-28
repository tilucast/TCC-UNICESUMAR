Principais libs do projeto:

https://docs.adonisjs.com/guides/introduction - AdonisJS. Framework Backend completo.

https://reactnative.dev - React Native. Framework que possibilita a construção de aplicações Javascript serem construídas nativamente tanto em IOS como Android.

https://docs.expo.dev/ - Expo. Uma ferramenta que simplifica o processo de desenvolvimento React Native.

https://nodejs.org/en/ - NodeJS. Permite rodar javascript no backend.

## Observação

Caso queira testar apenas o backend, basta rodar o servidor e importar o arquivo insomnia em um API Client de sua preferência, ou usá-lo como base para criar as requisições.

## Rodando o backend:

Em seu terminal, na pasta ‘server’, digite o comando: ‘yarn install’, que instalará todas as dependências do projeto. Para gerar o banco de dados, use o comando: ‘node ace migration:run’, que gerará o arquivo do banco de dados dentro da pasta ‘tmp’. Para rodar o servidor, ‘noce ace serve --watch’, que dará o bootstrap no server na porta 3333.
O último passo será trocar o ip que está no código pelo ip de sua própria máquina. Em computadores Windows, em um terminal, você pode conseguir essa informação digitando o comando ‘ipconfig’. Basta pegar esse ip e trocar pelo ips já existentes no código, dentro dos arquivos EmpresasController.ts e api.ts.

## Rodando o aplicativo:

Será necessário fazer a instalação do ambiente de desenvolvimento React Native para rodar o projeto localmente. É um processo longo e complexo, mas que está bem detalhado na documentação oficial do React Native: https://reactnative.dev/docs/environment-setup.
Em seu terminal, dentro da pasta ‘mobile’, rode o comando: ‘npm install’, que instalará todas as dependências do projeto.
Em sequência, basta digitar ‘npm run start’, que fará a instalação do aplicativo Expo Go dentro do aparelho conectado. Em sequência, no terminal, você deve apertar a tecla ‘a’ para abrir a aplicação em seu aparelho android.
