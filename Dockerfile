FROM node:alpine
WORKDIR /app
ADD package*.json .
RUN npm install
ADD . .