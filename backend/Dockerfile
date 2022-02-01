FROM node:latest
# Create directory
WORKDIR /app

# Copy files
COPY . .
RUN npm install

CMD [ "npm", "run", "start:dev" ]
