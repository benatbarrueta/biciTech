# Dockerfile en la raíz
FROM node:16
WORKDIR /app
COPY package*.json ./
COPY gateway.js ./
EXPOSE 4000
CMD ["node", "gateway.js"]
