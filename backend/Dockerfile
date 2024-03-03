FROM node:16-alpine AS base
WORKDIR /app
COPY package*.json ./


FROM base AS dependencies
RUN npm install


FROM dependencies AS build
COPY . .
RUN npx babel src --out-dir dist


FROM base AS release

WORKDIR /app


COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN adduser -D appuser && chown -R appuser /app
USER appuser

EXPOSE 4000
CMD [ "npx", "pm2-runtime", "dist/index.js" ]