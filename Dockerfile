FROM node:20-alpine AS frontend-builder

WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/. .

ENV REACT_APP_API_URL=
ENV WATCHMAN=false
RUN npm test -- --watchAll=false --watchman=false
RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY backend/package*.json ./
RUN npm install

COPY backend/. .

RUN npx prisma generate
RUN npm test

COPY --from=frontend-builder /frontend/build ./public

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
