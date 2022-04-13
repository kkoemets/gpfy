# syntax=docker/dockerfile:1
FROM node:16
WORKDIR /
COPY . .
RUN npm install
RUN npm run build
CMD [ "node", "build/src/app.js" ]
EXPOSE 3001
