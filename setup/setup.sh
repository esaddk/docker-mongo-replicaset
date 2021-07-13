#!/bin/bash
echo ******************************************************
echo Starting Replicaset
echo ******************************************************
# Slepp for waiting all mongo node ready
sleep 10 | echo Sleeping 
#Run script to initiate Replicaset
mongo mongodb://node1:27017 rsconf.js
