FROM node:lts-alpine
# Create directory
WORKDIR /app

# Installation
# RUN apt-get update -y && \
#     apt-get upgrade -y && \
RUN npm i -g @nestjs/cli
COPY ./entrypoint.sh /

ENTRYPOINT [ "/bin/sh", "/entrypoint.sh" ]
