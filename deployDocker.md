# README

## Deploy em container Docker

Este documento fornece instruções sobre como fazer o deploy em container Docker utilizando Docker compose e PostgreSQL em ambiente Linux (não está no escopo desse readme a utilização do Docker em Windows)

&nbsp;
## Pré-requisitos

Certifique-se de ter as seguintes dependências instaladas:

- Docker
- Docker compose
- Linux

&nbsp;
## Configuração

1. Crie e acesse uma pasta para o projeto:

    ```shell
    mkdir labeddit-backend
    cd labeddit-backend
&nbsp;

2. Crie o arquivo docker-compose.yml tendo como base o seguinte código: 

    ```
    version: '3.7'
    services:
    labdit-be:
        image: carratech/labdit-be:latest
        restart: always
        ports:
        - 3003:3003
        environment:
        - PORT=3003
        - BCRYPT_COST=10
        - JWT_KEY=minha-senha-segura-bananinha
        - JWT_EXPIRES_IN=7d
        - DATABASE_URL=postgres://dbusername:dbpassword@postgres/dbname
        depends_on:
        - postgres

    postgres:
        image: postgres:15-alpine
        restart: always
        ports:
        - 5432:5432 
        environment:
        - POSTGRES_USER=dbusername
        - POSTGRES_PASSWORD=dbpassword
        - POSTGRES_DB=dbname
        - POSTGRES_HOST_AUTH_METHOD=password
    ```
&nbsp;


3. Inicie o serviço:

    ```shell
    docker compose pull 
    docker compose up -d
&nbsp;

Acesse a aplicação em http://localhost:3003