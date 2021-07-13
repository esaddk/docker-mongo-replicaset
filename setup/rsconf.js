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