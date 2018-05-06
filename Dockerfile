FROM node:4

RUN apt-get update && \
  apt-get install -y ruby-full && \
  gem install sass

ENV PATH /tenants/node_modules/.bin:$PATH
