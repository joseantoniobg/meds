FROM node:20.18.1-alpine3.21
RUN export TZ="America/Sao_Paulo"
WORKDIR /app

COPY package*.json ./
RUN yarn install
COPY . .
RUN yarn build

EXPOSE 3001

ENTRYPOINT ["/bin/sh", "-c", "yarn start:dev"]