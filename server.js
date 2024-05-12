const express = require("express")
const cluster = require("cluster");
const os = require('os')

let app = express()
const START_PORT = 3001;

if (cluster.isPrimary) {
    // for (const id in cluster.workers) {
    //     console.log(`worker ${id} has been cleared`)
    //     Promise(cluster.workers[id].kill()).then(result=>result)
    // }

    const CPUs = os.cpus().length;
    console.log("Available CPUs:", CPUs)
    cluster.schedulingPolicy = cluster.SCHED_RR

    for (let i = 0; i < CPUs-1; i++) {
        cluster.fork({
            port: parseInt(3002+i),
        })
        //environment variables
    }

    cluster.on("online", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} is online`)
    })

    cluster.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} has exited`);
    });

} else {
    //child process
    app.get("/heavytask", (req, res) => {
        console.log(`Heavy request ${process.pid} :${process.env.port} start`)
        let counter = 0;
        while (counter < 9000000000) {
            counter++;
        }
        console.log(`Heavy request ${process.pid} :${process.env.port} end`)
        res.end(`${counter} Iteration request completed ${process.env.port}`)
    })

    app.listen(process.env.port, () => console.log(`child worker process ${process.pid} is listening on port ${process.env.port}`))
    return
}

app.get("/heavytask", (req, res) => {
    //heavy task will be redirected to a child process
    const CPUs = os.cpus().length;
    const PORT = parseInt(parseInt(Math.random() * CPUs) + START_PORT + 1)
    res.redirect(`http://localhost:${PORT}/heavytask`)

})

app.get("/lighttask", (req, res) => {
    // process.send(`Light request ${process.pid}`)
    console.log(`Light process ${process.pid}`)
    res.send("A simple HTTP request")

})

app.listen(START_PORT, () => console.log(`primary worker process ${process.pid} is listening on port ${START_PORT}`))


