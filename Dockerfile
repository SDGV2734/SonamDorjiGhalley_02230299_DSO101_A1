FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/. .

RUN npx prisma generate
RUN npm test

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
