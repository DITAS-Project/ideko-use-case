# InfluxDB DAL
DAL for the InfluxDB.

## Configuration file
The InfluxDB configuration files can be found on the `config` folder.

## Running with Docker
- Set the credentials on the `config/idekoDalGrpcServerConfig.yml` file.
- Copy the content of this repository to the system.
- Run `docker build -t influxdb-dal-ideko .` from the folder where the Dockerfile is.
- Run `docker run -p 50052:50052 --restart always --name influxdb-dal-ideko -d influxdb-dal-ideko`.

## Testing
Testing can easily done with [BloomRPC](https://github.com/uw-labs/bloomrpc/releases), installing and running the software, adding the endpoint (`ip:50052`) to the interface, loading the Proto files that can be found on the `src\IDEKO-DAL-InfluxDB-grpc\src\main\protobuf` folder and completing the following JSON, by adding a valid token on the `authorization` field.

```
{
  "query": "SELECT time,  \"value\" FROM \"{{db}}\".\"{{policy}}\".\"I_CMX_LQLS26_AW8HY7\" ORDER BY time DESC LIMIT 15",
  "machineId": "CMX_LQLS26",
  "dalMessageProperties": {
    "purpose": "",
    "requesterId": "",
    "authorization": "Bearer VALID_TOKEN"
  }
}
```
