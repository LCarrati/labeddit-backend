# README

## Deploy Local do Projeto

Este documento fornece instruções sobre como fazer o deploy local utilizando SQLite.

&nbsp;
## Pré-requisitos

Certifique-se de ter as seguintes dependências instaladas em sua máquina:

- Node.js 
- NPM

&nbsp;
## Configuração

1. Clone o repositório:

   ```shell
   git clone https://github.com/LCarrati/labeddit-backend.git
&nbsp;

2. Acesse o diretório do projeto:

    ```shell
    cd labeddit-backend
&nbsp;

3. Instale as dependências:

    ```shell
    npm install
&nbsp;

4. Mudanças necessárias:
    - No arquivo ./src/Database/BaseDatabase.ts
Comente o código referente ao PostgreSQL e descomente o código referente ao SQLite
    - No diretório raiz crie o arquivo .env com o seguinte código:
    ``` 
    PORT=3003

    BCRYPT_COST=10

    DB_FILE_PATH=./src/Database/labeddit.db

    JWT_KEY=minha-senha-segura-bananinha
    JWT_EXPIRES_IN=7d
    ```
&nbsp;

5. Inicie o servidor:

    ```shell
    npm run dev 
&nbsp;

Acesse a aplicação em http://localhost:3003