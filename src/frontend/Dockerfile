FROM node:lts-alpine

# Make the 'app' folder the current working directory
WORKDIR /app
RUN npm i -g @vue/cli
COPY ./entrypoint.sh /

ENTRYPOINT [ "/bin/sh", "/entrypoint.sh" ]
