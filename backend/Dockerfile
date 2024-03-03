
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx babel src --out-dir dist


EXPOSE 4000
CMD [ "npx", "pm2-runtime", "dist/index.js" ]