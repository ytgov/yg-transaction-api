FROM node:10

RUN npm install -g nodemon
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3001
CMD [ "npm", "run", "dev" ]
