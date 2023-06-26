# Labeddit - backend

Backend do projeto de fórum online que permite a criação de postagens e discussões através de comentários, inspirado no Reddit, com funcionalidade de Upvote e Downvote nos posts e comentários.

&nbsp;
## Sobre o projeto

Este projeto é corresponde ao back-end da aplicação Labeddit, desenvolvido em Node.js e Typescript. Foi idealizado como projeto de conclusão do bootcamp web fullstack Labenu e, juntamente com o front-end ([disponível aqui](https://github.com/lcarrati/labeddit-frontend)), representa uma aplicação completa desenvolvida do zero até o deploy. 
Inicialmente foi utilizado o banco de dados SQLite, porém ao realizar o deploy em docker containers a aplicação foi separada do bando de dados, que foi migrado para PostgreSQL.
Durante o desenvolvimento foi preparado um VPS Linux (Ubuntu) com Nginx como proxy reverso para o deploy do backend.


&nbsp;
## Live Preview

Confira o projeto completo em funcionamento [neste link](https://labeddit-frontend-lcarrati.vercel.app/).

&nbsp;
## Documentação da API

A documentação completa da API pode ser encontrada [neste link](https://documenter.getpostman.com/view/24823216/2s93z87Ntp).

&nbsp;
## Ferramentas Utilizadas

Neste projeto, utilizei as seguintes ferramentas e tecnologias:

- Node.js
- Typescript
- PostgreSQL
- Docker
- Express.js
- Knex
- VSCode
- Valentina Studio


&nbsp;
## Endpoints

A API possui os seguintes endpoints:

### Usuários

| Método | Rota                                           | Descrição                                 |
| ------ | ---------------------------------------------- | ----------------------------------------- |
| POST   | /labeddit-backend/users/signup                 | Registrar um novo usuário                 |
| POST   | /labeddit-backend/users/login                  | Realizar login                            |
| PUT    | /labeddit-backend/users/edituser               | Editar informações do usuário             |
| DELETE | /labeddit-backend/users/deleteuser             | Excluir usuário                           |
| GET    | /labeddit-backend/users/finduser               | Encontrar usuário pelo ID, nickname ou email                 |
| GET    | /labeddit-backend/users/userslist              | Listar todos os usuários                   |
| GET    | /labeddit-backend/users/logout                 | Realizar logout                           |

### Posts

| Método | Rota                                           | Descrição                                 |
| ------ | ---------------------------------------------- | ----------------------------------------- |
| POST   | /labeddit-backend/posts/createpost              | Criar um novo post                        |
| DELETE | /labeddit-backend/posts/deletepost              | Excluir um post                           |
| PUT    | /labeddit-backend/posts/editpost                | Editar um post                            |
| GET    | /labeddit-backend/posts/findpost/:post_id       | Encontrar um post pelo ID                  |
| GET    | /labeddit-backend/posts/postslist               | Listar todos os posts                      |

### Likes e Dislikes

| Método | Rota                                           | Descrição                                 |
| ------ | ---------------------------------------------- | ----------------------------------------- |
| POST   | /labeddit-backend/likedislike/likedislike       | Curtir ou descurtir um post               |
| POST   | /labeddit-backend/likedislike/commentlikedislike| Curtir ou descurtir um comentário          |
| POST   | /labeddit-backend/likedislike/checklikestatus   | Verificar status de curtida em um post     |
| POST   | /labeddit-backend/likedislike/checkcommentlikestatus | Verificar status de curtida em um comentário |

### Comentários

| Método | Rota                                           | Descrição                                 |
| ------ | ---------------------------------------------- | ----------------------------------------- |
| POST   | /labeddit-backend/comment/addcomment            | Adicionar um comentário em um post        |
| PUT    | /labeddit-backend/comment/editcomment           | Editar um comentário                      |
| DELETE | /labeddit-backend/comment/deletecomment         | Excluir um comentário                     |
| GET    | /labeddit-backend/comment/findcomment           | Encontrar um comentário pelo ID            |
| GET    | /labeddit-backend/comment/getallcomments/:post_id | Listar todos os comentários de um post   |


&nbsp;
## Instalação

O projeto está preparado para o deploy em container docker, bastando baixar a imagem no DockerHub e configurar as variáveis de ambiente conforme orientações disponíveis no arquivo [deployDocker.md](deployDocker.md).
É possível ainda realizar o deploy localmente e utilizar o SQLite ao invés do PostgreSQL, para isso siga as orientações no arquivo [deployLocal.md](deployLocal.md).

&nbsp;
## Conclusão

Durante esse projeto melhorei minhas habilidades em Node.js, Typescript e orientação a objetos. Também adquiri conhecimentos em Docker, Nginx, PostgreSQL e Linux. Foi um grande desafio e satisfação concluir esse que é meu primeiro projeto Fullstack completo do zero ao deploy.

Sinta-se à vontade para explorar o projeto e, se tiver alguma dúvida ou sugestão, considere-se convidado à em entrar em contato comigo!
&nbsp;