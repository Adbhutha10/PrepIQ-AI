# Use Node.js 20 LTS lightweight image
FROM node:20-alpine

# Set working directory inside container
WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev --legacy-peer-deps || npm install --omit=dev --legacy-peer-deps

# Copy backend source files
COPY . .

# Expose backend port
EXPOSE 5000

# Set default node env to production
ENV NODE_ENV=production

# Start server
CMD ["node", "src/server.js"]
