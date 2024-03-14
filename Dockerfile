FROM node:18-alpine
COPY setup.sh /home/node/app/
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
RUN npm install
COPY . .

RUN chmod +x setup.sh && ./setup.sh
EXPOSE 3080
RUN npm run build

CMD ["npm", "run", "start"]