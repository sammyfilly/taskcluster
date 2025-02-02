FROM node:18.20.6

WORKDIR /app/ui
COPY yarn.lock package.json ./

RUN yarn

ENTRYPOINT [ "yarn" ]
CMD [ "start:docker" ]
