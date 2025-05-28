# Explicitly use native architecture for better performance
FROM --platform=$BUILDPLATFORM node:22-alpine

WORKDIR /app

# Add package files for better Docker layer caching
COPY package.json package-lock.json ./

# Optimize npm for performance (especially on arm64)
RUN npm config set unsafe-perm true && \
    npm config set fetch-retries 3 && \
    npm config set fetch-retry-factor 2 && \
    npm install --prefer-offline --no-audit

COPY . .

EXPOSE 3000

CMD ["npm", "start"] 