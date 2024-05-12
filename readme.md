npx autocannon -r 1 -c 4 -d 60 http://localhost:3001/lighttask // Running 4 connections in 60 seconds, 1 request per second


npx autocannon -r 1 -c 1 -d 60 -t 60 -j http://localhost:3002/heavytask // Running 16 connections in 5 seconds

