ARG BUILD_FROM=ghcr.io/hassio-addons/base:15.0.0
FROM ${BUILD_FROM}

ENV LANG C.UTF-8

# Install nodejs
RUN apk add --no-cache nodejs npm

# Copy data for add-on
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

COPY tsconfig.json ./
COPY src ./src
RUN npx tsc

COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]
