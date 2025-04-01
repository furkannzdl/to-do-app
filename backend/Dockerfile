FROM node:18

WORKDIR /app

COPY backend/package*.json ./
RUN npm install --legacy-peer-deps

COPY backend .

# Prisma ile migration ve ardından server'ı başlat
CMD npx prisma generate \
  && npx prisma migrate deploy \
  && npx ts-node src/index.ts
