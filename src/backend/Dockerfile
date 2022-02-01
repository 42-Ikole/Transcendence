FROM node:latest
# Create directory
WORKDIR /app

# Installation
RUN apt-get update && \
    apt-get upgrade && \
    npm i -g @nestjs/cli
COPY ./entrypoint.sh .

ENTRYPOINT [ "bash", "./entrypoint.sh" ]
