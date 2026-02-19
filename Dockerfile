FROM node:18

WORKDIR /app

# Install dependencies
COPY fe-tsubame/package*.json ./fe-tsubame/
WORKDIR /app/fe-tsubame
RUN npm install --silent

# Copy app sources
COPY fe-tsubame/ .

# Start Vite in host-accessible mode for development
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
