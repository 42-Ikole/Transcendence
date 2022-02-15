FROM node:lts-alpine

# Make the 'app' folder the current working directory
RUN npm i -g @vue/cli
COPY ./entrypoint.sh /
WORKDIR /app
ENTRYPOINT [ "/bin/sh", "/entrypoint.sh" ]
