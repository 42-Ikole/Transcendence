FROM node:lts-alpine
# Create directory
WORKDIR /app

# Installation: Add apt-get update && apt-get upgrade if using BUSTER
RUN npm i -g @nestjs/cli
COPY ./entrypoint.sh /

ENTRYPOINT [ "/bin/sh", "/entrypoint.sh" ]
