FROM node:10.15-alpine

ENV PORT 3000
COPY . /app
WORKDIR /app
RUN npm install

ENTRYPOINT ["npm", "start"]
