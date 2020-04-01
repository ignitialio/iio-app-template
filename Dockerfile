FROM node:12-alpine

RUN mkdir -p /opt && mkdir -p /opt/iioat

ADD . /opt/iioat

WORKDIR /opt/iioat

RUN npm install && npm run client:build

CMD ["npm", "run", "server:start"]
