# FROM node:lts-alpine
# ENV NODE_ENV=production
# WORKDIR /usr/src/app
# COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
# RUN npm install --production --silent && mv node_modules ../
# COPY . .
# EXPOSE 3003
# RUN chown -R node /usr/src/app
# USER node
# CMD ["npm", "start"]

FROM node:lts-alpine as development
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM node:lts-alpine as production
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install --production --silent && mv node_modules ../
COPY --from=development /usr/src/app/build ./build
# sempre que fizer o deploy ele vai dar overwrite na DB, então a DB precisa estar em outro lugar, por isso em produção utilizar PostgreSQL
# copiar o banco de dados: (não necessário com PostgreSQL)
# COPY --from=development /usr/src/app/src/Database/labeddit.db ./build/Database 
# copiar o arquivo .env: (não necessário com Docker-compose)
# COPY --from=development /usr/src/app/.env .env
EXPOSE 3003
RUN chown -R node /usr/src/app
USER node
CMD ["node", "build/index.js"]
