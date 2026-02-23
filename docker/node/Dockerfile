FROM node:20-alpine

WORKDIR /home/app

# Copiar package.json primero para aprovechar cache de Docker
COPY server/package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY server/ .

# Puerto de la aplicación
EXPOSE 80

# Comando de inicio
CMD ["npm", "start"]