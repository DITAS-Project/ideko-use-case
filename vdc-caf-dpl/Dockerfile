FROM golang:1.11.5 as vdcThroughput
RUN go get github.com/DITAS-Project/VDC-Throughput-Agent && \
cd src/github.com/DITAS-Project/VDC-Throughput-Agent && \
CGO_ENABLED=0 go build -a --installsuffix cgo --ldflags="-w -s -X main.Build=$(git rev-parse --short HEAD)" -o  vdc-traffic

# Start from a Node-red Alpine image
FROM nodered/node-red-docker:slim

# Install MySQL and InfluxDB
RUN npm install node-red-node-mysql
RUN npm install node-red-contrib-influxdb

# Copy the HTTPin and Savvy nodes
ADD node-red-files/httpin-node/* ./node_modules/node-red/nodes/core/io/
ADD node-red-files/savvy-node/* /savvy_node_data/
ADD node-red-files/grpc/ /grpc/

# Copy the settings file
COPY node-red-files/settings/settings.js /data

# Copy the flows file
COPY node-red-files/flows/flows.json /data

# Needs to be root to make the npm links
USER root

# Install savvy node
WORKDIR /savvy_node_data/
RUN npm install
RUN npm link
WORKDIR /data
RUN npm link savvy-contrib

# Install grpc nodes
WORKDIR /grpc/
#RUN npm install
RUN npm link
WORKDIR /data
RUN npm link node-red-contrib-grpc


# Node-red owns the /data path
RUN chown -R node-red /data

# Install R
RUN apk add --no-cache bash bash-doc bash-completion
RUN apk add --no-cache R

# Change to default Node-RED working directory
WORKDIR /usr/src/node-red

# Copy the Throughput Agent inside
COPY --from=vdcThroughput go/src/github.com/DITAS-Project/VDC-Throughput-Agent/vdc-traffic /opt/monitoring/vdc-traffic

ENV BUILD_DEPS="gettext alpine-sdk git autoconf automake libtool"  \
    RUNTIME_DEPS="libintl libpcap-dev ncurses-dev "

# Necessary to be able to run "su -c COMMAND" and not get "su: must be suid to work properly"
# We use su -c to run the agent as root
RUN apk add --update busybox-suid

# Add necessary command line tools
RUN  apk add --update $RUNTIME_DEPS && \
    apk add --virtual build_deps $BUILD_DEPS   \
    && cd /tmp && git clone https://github.com/dleonard0/pktstat.git \
        && cd pktstat \
        && libtoolize --force &&  aclocal && autoheader && automake --force-missing --add-missing && autoconf && ./configure \
        && make install && cd ../ rm -rf pktstat \
        && cp /usr/bin/envsubst /usr/local/bin/envsubst  \
    && apk del build_deps \
    && rm -rf /var/cache/apk/*

EXPOSE 1888

# TODO can user nodered execute also the troughput agent?
# TODO change the entrypoint to use root for the agent
ADD entrypoint.sh /entrypoint.sh

# This execute both node-red and the throughput agent as node-red user. Hope the agent don't mind.
#USER node-red We keep root to run the agent. The entrypoint forces node´red to be loaded with its user
ENTRYPOINT [ "/entrypoint.sh" ]