# Use an official Node.js runtime as a parent image
FROM node:22.6.0

RUN apt-get update
RUN apt-get install -y \
        wget \ 
        iputils-ping \
        dnsutils \ 
        iproute2 \ 
        cron \
        nano \
        gnupg 
RUN apt-get install -y \
        fonts-ipafont-gothic \
        fonts-freefont-ttf \
        firefox-esr \
        --no-install-recommends
RUN apt-get install -yq \
        libdrm2 \
        libice6 \
        libsm6 \
        libgbm1

RUN apt-get install -yq \
        gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
        libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
        libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
        libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
        ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
        xvfb x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable x11-apps \
        && apt-get clean \
        && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .

# Cron job for running /app/scripts/gateway.sh to run the script every 2 minutes
RUN echo "*/2 * * * * /app/scripts/gateway.sh >> /var/log/cron_gateway.log" > /etc/cron.d/gateway-cron \
        && chmod 0644 /etc/cron.d/gateway-cron \
        && crontab /etc/cron.d/gateway-cron \
        && touch /var/log/cron_gateway.log

RUN chmod gu+rw /var/run
RUN chmod gu+s /usr/sbin/cron

ARG UID=1000

RUN usermod -u $UID node

RUN mkdir -p /.cache/yarn
RUN chown -R $UID /app
RUN chown -R $UID /.cache
USER $UID

# Install dependencies

RUN yarn 
RUN yarn add puppeteer
# RUN yarn puppeteer browsers install chrome
RUN yarn puppeteer browsers install firefox

RUN yarn build

ENTRYPOINT [ "./scripts/entrypoint.sh" ]