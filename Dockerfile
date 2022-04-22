FROM node:12-alpine

WORKDIR /app
COPY package.json /app
COPY package-lock.json /app

COPY . /app

EXPOSE 3003
CMD [ "npm", "start" ]