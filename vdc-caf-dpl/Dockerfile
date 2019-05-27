FROM golang:1.11.5 as vdcThroughput
RUN go get github.com/DITAS-Project/VDC-Throughput-Agent && \
cd src/github.com/DITAS-Project/VDC-Throughput-Agent && \
CGO_ENABLED=0 go build -a --installsuffix cgo --ldflags="-w -s -X main.Build=$(git rev-parse --short HEAD)" -o  vdc-traffic

# Start from a Node-red Alpine image
FROM nodered/node-red-docker:slim

# Install MySQL and InfluxDB
USER node-red
RUN npm install node-red-node-mysql
RUN npm install node-red-contrib-influxdb

# Copy the HTTPin and Savvy nodes
ADD node-red-files/httpin-node/* ./node_modules/@node-red/nodes/core/io/
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
#RUN apk add --no-cache bash bash-doc bash-completion
#RUN apk add --no-cache R

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

# Start of Intalll python - based on https://github.com/docker-library/python/blob/34c9df35e9a69e9f0edde88e861b543edb8bc07a/3.7/alpine3.9/Dockerfile
# ============================================

# ensure local python is preferred over distribution python
ENV PATH /usr/local/bin:$PATH

# http://bugs.python.org/issue19846
# > At the moment, setting "LANG=C" on a Linux system *fundamentally breaks Python 3*, and that's not OK.
ENV LANG C.UTF-8

# install ca-certificates so that HTTPS works consistently
# other runtime dependencies for Python are installed later
RUN apk add --no-cache ca-certificates

ENV GPG_KEY 0D96DF4D4110E5C43FBFB17F2D347EA6AA65421D
ENV PYTHON_VERSION 3.7.3

RUN set -ex \
	&& apk add --no-cache --virtual .fetch-deps \
		gnupg \
		tar \
		xz \
	\
	&& wget -O python.tar.xz "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz" \
	&& wget -O python.tar.xz.asc "https://www.python.org/ftp/python/${PYTHON_VERSION%%[a-z]*}/Python-$PYTHON_VERSION.tar.xz.asc" \
	&& export GNUPGHOME="$(mktemp -d)" \
	&& gpg --batch --keyserver ha.pool.sks-keyservers.net --recv-keys "$GPG_KEY" \
	&& gpg --batch --verify python.tar.xz.asc python.tar.xz \
	&& { command -v gpgconf > /dev/null && gpgconf --kill all || :; } \
	&& rm -rf "$GNUPGHOME" python.tar.xz.asc \
	&& mkdir -p /usr/src/python \
	&& tar -xJC /usr/src/python --strip-components=1 -f python.tar.xz \
	&& rm python.tar.xz \
	\
	&& apk add --no-cache --virtual .build-deps  \
		bzip2-dev \
		coreutils \
		dpkg-dev dpkg \
		expat-dev \
		findutils \
		gcc \
		gdbm-dev \
		libc-dev \
		libffi-dev \
		libnsl-dev \
		libtirpc-dev \
		linux-headers \
		make \
		ncurses-dev \
		openssl-dev \
		pax-utils \
		readline-dev \
		sqlite-dev \
		tcl-dev \
		tk \
		tk-dev \
		util-linux-dev \
		xz-dev \
		zlib-dev \
# add build deps before removing fetch deps in case there's overlap
	&& apk del .fetch-deps \
	\
	&& cd /usr/src/python \
	&& gnuArch="$(dpkg-architecture --query DEB_BUILD_GNU_TYPE)" \
	&& ./configure \
		--build="$gnuArch" \
		--enable-loadable-sqlite-extensions \
		--enable-shared \
		--with-system-expat \
		--with-system-ffi \
		--without-ensurepip \
	&& make -j "$(nproc)" \
# set thread stack size to 1MB so we don't segfault before we hit sys.getrecursionlimit()
# https://github.com/alpinelinux/aports/commit/2026e1259422d4e0cf92391ca2d3844356c649d0
		EXTRA_CFLAGS="-DTHREAD_STACK_SIZE=0x100000" \
	&& make install \
	\
	&& find /usr/local -type f -executable -not \( -name '*tkinter*' \) -exec scanelf --needed --nobanner --format '%n#p' '{}' ';' \
		| tr ',' '\n' \
		| sort -u \
		| awk 'system("[ -e /usr/local/lib/" $1 " ]") == 0 { next } { print "so:" $1 }' \
		| xargs -rt apk add --no-cache --virtual .python-rundeps \
	&& apk del .build-deps \
	\
	&& find /usr/local -depth \
		\( \
			\( -type d -a \( -name test -o -name tests \) \) \
			-o \
			\( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \
		\) -exec rm -rf '{}' + \
	&& rm -rf /usr/src/python \
	\
	&& python3 --version

# make some useful symlinks that are expected to exist
RUN cd /usr/local/bin \
	&& ln -s idle3 idle \
	&& ln -s pydoc3 pydoc \
	&& ln -s python3 python \
	&& ln -s python3-config python-config

# if this is called "PIP_VERSION", pip explodes with "ValueError: invalid truth value '<VERSION>'"
ENV PYTHON_PIP_VERSION 19.1.1

RUN set -ex; \
	\
	wget -O get-pip.py 'https://bootstrap.pypa.io/get-pip.py'; \
	\
	python get-pip.py \
		--disable-pip-version-check \
		--no-cache-dir \
		"pip==$PYTHON_PIP_VERSION" \
	; \
	pip --version; \
	\
	find /usr/local -depth \
		\( \
			\( -type d -a \( -name test -o -name tests \) \) \
			-o \
			\( -type f -a \( -name '*.pyc' -o -name '*.pyo' \) \) \
		\) -exec rm -rf '{}' +; \
	rm -f get-pip.py
# ===================================
# --- END of python INSTALL

# For the anom-det algorithm
# TODO Improve this using FROM ubuntu and so we don't end up with git and deps installed in the final image
USER root
RUN mkdir -p /opt/ditas/python-teda-framework
ARG bbuser
ARG bbpass
RUN apk add git
RUN git clone --single-branch --branch ditas https://$bbuser:$bbpass@bitbucket.org/idekotics/python-teda-framework.git /opt/ditas/python-teda-framework
RUN apk add libc-dev alpine-sdk
RUN pip install -r /opt/ditas/python-teda-framework/requirements.txt
RUN mkdir -p /opt/ditas/data/input
RUN mkdir -p /opt/ditas/data/output
RUN chown -R node-red /opt/ditas

EXPOSE 1888

# TODO can user nodered execute also the troughput agent?
# TODO change the entrypoint to use root for the agent
ADD entrypoint.sh /entrypoint.sh

# This execute both node-red and the throughput agent as node-red user. Hope the agent don't mind.
#USER node-red We keep root to run the agent. The entrypoint forces node´red to be loaded with its user
ENTRYPOINT [ "/entrypoint.sh" ]
