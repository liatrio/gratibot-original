FROM node:10.15-alpine
WORKDIR /app
ENV PORT 3000

RUN apk add imagemagick librsvg

# nodemon for dev
RUN npm install -g nodemon

# handle dependencies
COPY package*.json ./
RUN npm install --prod

# copy source
COPY . .

ENTRYPOINT ["npm", "start"]
