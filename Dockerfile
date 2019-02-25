FROM node:10.15-alpine

WORKDIR /app
ENV PORT 3000

# handle dependencies
COPY package.json .
RUN npm install

# copy source
COPY . .

ENTRYPOINT ["npm", "start"]
