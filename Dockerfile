FROM node:10.15-alpine as dev
WORKDIR /app

# handle dependencies
COPY package*.json ./
RUN npm install

COPY . .
RUN npm test

FROM node:10.15-alpine as prod
WORKDIR /app
ENV PORT 3000

RUN apk add imagemagick librsvg
RUN apk add --update  --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

# handle dependencies
COPY package*.json ./
RUN npm install --prod

# copy source
COPY . .

ENTRYPOINT ["npm", "start"]
