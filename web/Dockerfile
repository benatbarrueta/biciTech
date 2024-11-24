# frontend/Dockerfile
FROM node:16 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]