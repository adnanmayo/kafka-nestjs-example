FROM node:18-alpine
# FROM node:16.3.0-alpine

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retry-mintimeout 20000

RUN npm config set fetch-retry-maxtimeout 120000

RUN npm i --legacy-peer-deps

COPY . .

RUN npm run build

CMD [ "npm", "run", "start:dev" ]
