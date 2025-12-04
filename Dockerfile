FROM node:20-alpine
WORKDIR /app
COPY backend/package.json ./
COPY backend/index.js ./
COPY frontend ./frontend
RUN npm install --production
EXPOSE 3000
CMD [ "node", "index.js" ]
