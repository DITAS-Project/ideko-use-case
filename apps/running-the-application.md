# How to run the IDEKO UC application

## Components
In order to run the application, you have to run the following components:

1. **Elasticsearch**
2. **DAL**:  From the image taken from the private hub
3. **VDC-CAF**: From the image taken from the private hub
4. **Request Monitor**: Image taken from the public DITAS DockerHub

... and create the following files (configuring the proper IPs) in the path `/opt/config` of the host machine:

**traffic.json**
```
{
    "ElasticSearchURL":"http://127.0.0.1:9200",
    "VDCName":"computation-vdc",
    "windowTime":10,
    "ignore":[".*:9200","127.0.0.1:8484"],
    "components":{".*:3306":"mysql",".*:9042":"cassandra"}
}
```

**monitor.json**
```
{
    "Endpoint":"http://127.0.0.1:1888",
    "ElasticSearchURL":"http://127.0.0.1:9200",
    "VDCName":"computation-vdc",
    "ZipkinEndpoint": "http://localhost:9411",
    "Opentracing":false,
    "UseSelfSigned":true,
    "ForwardTraffic":false,
    "verbose":true,
    "Authentication": true,
    "jwkURL": "https://127.0.0.1:58080/auth/realms/288/protocol/openid-connect/certs"
}
```

## Launching

1. Create the **two files** as stated before.

2. Run **Elasticsearch**: For testing, we took the image from the official docs.
```
docker pull docker.elastic.co/elasticsearch/elasticsearch:7.0.1
docker run -p 9200:9200 -p 9300:9300 -e "discovery.type=single-node" docker.elastic.co/elasticsearch/elasticsearch:7.0.1
```
3. Run **DAL**: The image is taken from the IDEKO's UC private docker registry.
```
docker run -p 40001:40001 --restart always --name streaming-dal -d 127.0.0.1:5050/streaming-dal
```

4. Run **VDC**: The image is taken from the IDEKO's UC private docker registry.
 ```
docker run -d -p 1888:1888 --restart always -v /opt/config:/etc/ditas 127.0.0.1:5050/computation-vdc
```

5. Run **Request Monitor**: The *CONTAINER_ID* from the *run* command must be the ID of the VDC (step #3).
```
# Option 1: Using local build
docker build -t ditas/request-monitor -f Dockerfile.artifact .
docker run -d -v /opt/config:/etc/ditas --pid=container:[CONTAINER_ID] -p 80:80 -p 443:443 ditas/request-monitor

# Option 2: Using DITAS DockerHub
docker run -d -v /opt/config:/etc/ditas --pid=container:[CONTAINER_ID] -p 80:80 -p 443:443 ditas/vdc-request-monitor:production
```

## Notes

- If the **VDC** container stops, the **Request Monitor** container will be stopped too. Both container must be launched together.
