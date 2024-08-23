FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN npm install && npm install --prefix frontend

COPY . .

RUN npm run build --prefix frontend

FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY --from=build /app/backend ./backend
COPY --from=build /app/frontend/dist ./frontend/dist

RUN npm install --only=production

EXPOSE 4000

ENV NODE_ENV=production

CMD ["npm", "start"]
