FROM java:latest

# Install sbt
ENV SCALA_VERSION 2.12.6
ENV SBT_VERSION 1.2.8
ENV SBT_OPTS -Xmx2G -XX:+UseConcMarkSweepGC -XX:+CMSClassUnloadingEnabled -Xss2M -Duser.timezone=GMT
RUN wget https://dl.bintray.com/sbt/debian/sbt-$SBT_VERSION.deb
RUN dpkg -i sbt-$SBT_VERSION.deb

# Install Scala
RUN wget https://downloads.typesafe.com/scala/$SCALA_VERSION/scala-$SCALA_VERSION.deb
RUN dpkg -i scala-$SCALA_VERSION.deb

# Copy the code to the container
ADD src /src

# Create the jar
RUN cd src/IDEKO-DAL-InfluxDB-grpc && sbt clean assembly

# Copy the jar to the proper path
RUN mkdir src/IDEKO-DAL-InfluxDB/lib/
RUN cp src/IDEKO-DAL-InfluxDB-grpc/target/scala-2.12/ideko-dal-influxdb-grpc-assembly-0.1.jar src/IDEKO-DAL-InfluxDB/lib/

# Create the scala-influxdb-client jar file
RUN cd src/scala-influxdb-client && sbt -Dsbt.global.base=.sbt -Dsbt.boot.directory=.sbt -Dsbt.ivy.home=.ivy2 compile && sbt -Dsbt.global.base=.sbt -Dsbt.boot.directory=.sbt -Dsbt.ivy.home=.ivy2 package
RUN cp src/scala-influxdb-client/target/scala-2.12/scala-influxdb-client_2.12-0.6.2-MA.jar src/IDEKO-DAL-InfluxDB/lib/
RUN cd src/IDEKO-DAL-InfluxDB && sbt -Dsbt.global.base=.sbt -Dsbt.boot.directory=.sbt -Dsbt.ivy.home=.ivy2 universal:packageZipTarball

# Default to UTF-8 file encoding
ENV LANG C.UTF-8

# Change working directory
ENV WORKINGDIR /

# Create run path
RUN mkdir app

# Copy to the app path the jar file
RUN cp src/IDEKO-DAL-InfluxDB/target/universal/ideko-dal-influxdb-0.1.tgz /app/ideko-dal-influxdb-0.1.tgz

# Copy to the app path the configuration files
COPY config/idekoDalPrivacyConfig.yml /app/ideko-dal-influxdb-0.1/conf/idekoDalPrivacyConfig.yml
COPY config/idekoDalGrpcServerConfig.yml /app/ideko-dal-influxdb-0.1/conf/idekoDalGrpcServerConfig.yml

# Expose the port
EXPOSE 30200

# Install libraries
RUN apt-get install curl
RUN apt-get install libc6

# Untar the code
RUN tar -xvzf /app/ideko-dal-influxdb-0.1.tgz -C /app/

# Set entrypoint
ENTRYPOINT ["app/ideko-dal-influxdb-0.1/bin/ideko-dal-influxdb", "app/ideko-dal-influxdb-0.1/conf/idekoDalGrpcServerConfig.yml", "app/ideko-dal-influxdb-0.1/conf/idekoDalPrivacyConfig.yml"]
