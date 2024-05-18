# MongoDB Replica Set Setup using Docker Compose

This guide explains how to set up a MongoDB replica set using Docker Compose.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Directory Structure

Ensure your directory structure looks like this:

```
.
├── docker-compose.yaml
├── setup
│   ├── Dockerfile
│   ├── rsconf.js
│   └── setup.sh
```

## Files

### `docker-compose.yaml`

```yaml
version: '3'

services:
  node1:
    image: mongo
    ports:
      - 70001:27017
    volumes:
      - $HOME/mongoclusterdata/node1:/data/mongodb
    networks:
      - mongo-network
    command: mongod --replSet rs-lab-01
  node2:
    image: mongo
    ports:
      - 70002:27017
    volumes:
      - $HOME/mongoclusterdata/node2:/data/mongodb
    networks:
      - mongo-network
    command: mongod --replSet rs-lab-01
    depends_on:
      - node1 
  node3:
    image: mongo
    ports:
      - 70003:27017
    volumes:
      - $HOME/mongoclusterdata/node3:/data/mongodb
    networks:
      - mongo-network
    command: mongod --replSet rs-lab-01
    depends_on:
      - node2
  setup-rs:
    image: "setup-rs"
    networks:
      - mongo-network
    build: ./setup
    depends_on:
      - node1

networks:
  mongo-network:
    driver: bridge
```

### `setup/Dockerfile`

```Dockerfile
FROM mongo

# Create App Directory
WORKDIR /usr/src/configs

# Install App Dependencies
COPY rsconf.js .
COPY setup.sh .

CMD ["./setup.sh"]
```

### `setup/rsconf.js`

```javascript
// Initiate Replicaset
rs.initiate({
    _id: "rs-lab-01",
    version: 1,
    members: [{
            _id: 0,
            host: "node1:27017"
        },
        {
            _id: 1,
            host: "node2:27017"
        },
        {
            _id: 2,
            host: "node3:27017"
        }
    ]
});

// Show Existing Configuration
rs.conf()
```

### `setup/setup.sh`

```bash
#!/bin/bash
echo ******************************************************
echo Starting Replicaset
echo ******************************************************
# Sleep to wait for all mongo nodes to be ready
sleep 10 | echo Sleeping 
# Run script to initiate Replicaset
mongo mongodb://node1:27017 rsconf.js
```

## Setup and Usage

1. **Navigate to your project directory**:

    ```bash
    cd path/to/your/project
    ```

2. **Create the necessary directories for data storage**:

    ```bash
    mkdir -p $HOME/mongoclusterdata/node1
    mkdir -p $HOME/mongoclusterdata/node2
    mkdir -p $HOME/mongoclusterdata/node3
    ```

3. **Build and start the Docker containers**:

    ```bash
    docker-compose up --build
    ```

    This command will:
    - Build the `setup-rs` image from the `Dockerfile`.
    - Start the MongoDB nodes and the setup container.
    - The setup container will initiate the replica set after the nodes are up and running.

4. **Verify the replica set**:

    After running the containers, you can connect to any of the MongoDB nodes and check the replica set configuration:

    ```bash
    mongo --port 70001
    ```

    Then, run:

    ```javascript
    rs.status()
    ```

    This should show the status of the replica set with all three nodes.

## Stopping the Containers

To stop and remove the containers, run:

```bash
docker-compose down
```

This will stop the running containers and remove them, but it will keep the data in the `$HOME/mongoclusterdata` directory.

---
