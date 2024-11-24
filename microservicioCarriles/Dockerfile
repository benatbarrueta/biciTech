# microservicio-node-1/Dockerfile (y similar para el microservicio-node-2)
FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 9000 
CMD ["node", "main.js"]