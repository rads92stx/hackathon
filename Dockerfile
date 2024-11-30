# Alpine
FROM node:23-alpine

ENV NODE_ENV=development

USER root
RUN apk add vim

# Timezone
RUN apk update
RUN apk upgrade
RUN apk add ca-certificates && update-ca-certificates
# Change TimeZone
RUN apk add --update tzdata
ENV TZ=Europe/Warsaw
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN rm -f /var/cache/apk/*
RUN rm -rf /tmp/*

RUN echo "alias vi='vim'" >> /etc/profile && \
  echo "alias l='ls -alF'" >> /etc/profile && \
  echo "alias ls='ls --color=auto'" >> /etc/profile && \
  echo "alias ll='ls -las --color=auto'" >> /etc/profile && \
  echo ":set number" >> /home/node/.vimrc

USER node
WORKDIR /app
VOLUME /app

EXPOSE 3200

COPY docker-entrypoint.sh /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
