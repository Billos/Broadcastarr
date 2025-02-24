# Use an official Node.js runtime as a parent image
FROM node:22.14.0-alpine AS builder
WORKDIR /app

COPY . .
RUN yarn
RUN yarn build

FROM node:22.14.0-alpine AS runtime
WORKDIR /app
ARG UID=1000
RUN chown -R $UID /app

# Install Chromium
RUN apk add chromium

# Set environment variables
ENV BROWSER=chrome
ENV BROWSER_EXECUTABLE_PATH=/usr/bin/chromium-browser

USER $UID

COPY ./package.json ./package.json
RUN npm install --omit=dev
COPY --from=builder /app/build ./build

EXPOSE 3000

ENTRYPOINT [ "npm", "run" ]