FROM node:18 AS build

# VITE_API_URL must be set at build time (Vite bakes it in)
ARG VITE_API_URL=https://tsubame-arts.econictek.com/api
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 8082

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "8082", "--strictPort"]
