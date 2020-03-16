FROM node:4

RUN apt-get update && \
  apt-get install -y ruby-full

# Newer versions of sass require ruby 2.2, which we're not using, so...
RUN gem install sass -v 3.4.22

ENV PATH /tenants/node_modules/.bin:$PATH
