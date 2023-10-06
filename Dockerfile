FROM node:16.18.1

ARG NODE_ENV=prod
ENV NODE_ENV ${NODE_ENV}
RUN echo ${NODE_ENV}

WORKDIR /opt/app
COPY . .
RUN rm -rf .next
RUN yarn install
RUN yarn lint && yarn build

CMD ["node_modules/.bin/next", "start"]