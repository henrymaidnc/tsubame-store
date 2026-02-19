FROM node:18

WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy app sources
COPY frontend/ .

# Start Vite in host-accessible mode for development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
