FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3131

ENV NODE_ENV=production
ENV PORT=3131

CMD ["node", "server.js"]
