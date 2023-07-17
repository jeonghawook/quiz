FROM node:18.16.0

ENV TZ="Asia/Seoul"

RUN mkdir -p /app

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]