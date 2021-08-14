FROM node:14
WORKDIR /usr/src/app
COPY package*.json server.js responses.json .env ./
COPY misc/ misc/
RUN npm i -g npm
RUN npm install
#EXPOSE 3000
CMD ["node", "server.js"]
