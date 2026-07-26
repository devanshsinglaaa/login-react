FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN cp .env.example .env

EXPOSE 5000

CMD ["node", "server.js"]