FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# To build
# RUN npm run build
EXPOSE 8080
USER node
# If built, serve, otherwise just run 
# CMD [ "npm", "run", "serve"]
CMD [ "npm", "start"]
