FROM node:14-alpine3.10

# Create app directory
RUN mkdir /usr/src && chown -R node:node /usr/src
RUN mkdir /usr/src/app && chown -R node:node /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=node:node package*.json ./

USER node

RUN npm install && npm cache clean --force --loglevel=error
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .
#VOLUME . /usr/src/app

#EXPOSE 3001
CMD [ "npm", "start" ]
