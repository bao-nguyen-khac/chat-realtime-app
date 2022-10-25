# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /app
COPY package.json ./
RUN yarn install --production
COPY . .
CMD ["node", "src/index.js"]
