## Scaling of Express Server
Express server will fork child process according to number of CPU cores
Primary process will redirect "heavy tasks" to a child process with a different port.
In this way the server will not hang on long API calls.

Start Express server
```
npm run start
```

1. use Postman to call http://localhost:3001/heavytask
2. npx autocannon -r 1 -c 4 -d 60 http://localhost:3001/lighttask // Running 4 connections in 60 seconds, 1 request per second


