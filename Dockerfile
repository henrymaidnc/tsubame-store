FROM node:18

WORKDIR /app

# Install dependencies
COPY fe/package*.json ./fe/
WORKDIR /app/fe
RUN npm install

# Copy app sources
COPY fe/ .

# Start Vite in host-accessible mode for development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
