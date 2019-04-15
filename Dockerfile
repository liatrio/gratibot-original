FROM node:10.15-alpine
WORKDIR /app
ENV PORT 3000

RUN apk add imagemagick librsvg

RUN apk add --update  --repository http://dl-3.alpinelinux.org/alpine/edge/testing libmount ttf-dejavu ttf-droid ttf-freefont ttf-liberation ttf-ubuntu-font-family fontconfig

# nodemon for dev
RUN npm config set unsafe-perm true \
    && npm install -g nodemon \
    && npm config set unsafe-perm false

# handle dependencies
COPY package*.json ./
RUN npm install --prod

# copy source
COPY . .

ENTRYPOINT ["npm", "start"]
