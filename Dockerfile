FROM node:10

RUN chown -R node:node /srv
USER node
WORKDIR /srv

# Copy package.json and install dependencies
COPY --chown=node:node ./package.json package.json
RUN npm install

# Copy the source code second to use caching for rapid iteration during development
COPY --chown=node:node ./ .
CMD ["/bin/bash", "-c", "bash frontend.entrypoint.sh"]
