FROM node:22-alpine

WORKDIR /app

# Add package files for better Docker layer caching
COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"] 