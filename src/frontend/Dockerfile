FROM node:lts-alpine
WORKDIR /app
RUN chown -R node:node /root
COPY ./entrypoint.sh /
ENTRYPOINT [ "/bin/sh", "/entrypoint.sh" ]
