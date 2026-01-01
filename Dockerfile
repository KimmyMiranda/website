FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3232

ENV NODE_ENV=production
ENV PORT=3232

CMD ["node", "server.js"]
