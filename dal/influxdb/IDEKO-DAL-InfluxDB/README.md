## License
Copyright 2018 IBM

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.

This is being developed for the DITAS Project: https://www.ditas-project.eu/

## DITAS-DAL

DAL for InfluxDB implemented for DITAS usecase

## Description
An implementation of a DAL that exposes data for medical doctor and researcher from two data sources - patient biographical data and blood tests. The data returned is compliant with privacy policies, which are enforced by the enforcement engine.

## Installation

1) clone git@github.ibm.com:cloud-platforms/DITAS-VDC-DAL-grpc.git

2) build vdc-dal-grpc-assembly-0.1.jar library:

```
sbt assembly

```
3) Clone DITAS-DAL repository

4) cp vdc-dal-grpc-assembly-0.1.jar to lib directory

5) Build and copy to lib directory scala-influxdb-client jar

6) Create distribution with:
```
sbt universal:packageZipTarball
```
7) Unzip the archive in target/universal/:
```
tar xvfz ideko-dal-influxdb-0.1.tgz
```


## Execution:

Running the server:

```
bin/IdekoInfluxdbServer <ServerConfigFile>
```

The src/test/scala/resources/ directory contains examples of config files for the server. 

