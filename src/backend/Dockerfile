FROM node:latest
# Create directory
WORKDIR /app

# Installation
RUN apt-get update -y && \
    apt-get upgrade -y && \
    npm i -g @nestjs/cli && \
	npm install --save @nestjs/typeorm typeorm pg

COPY ./entrypoint.sh .

ENTRYPOINT [ "bash", "./entrypoint.sh" ]
