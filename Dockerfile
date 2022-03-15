FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Add env variables
ENV TZ=America/Sao_Paulo

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install -g typescript
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8000

RUN npm run compile

CMD npm start

LABEL test=true
RUN npm test --coverage
