FROM node:18

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --legacy-peer-deps

COPY backend .

CMD ["sh", "-c", "npx prisma generate && npx ts-node src/index.ts"]
