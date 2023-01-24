const express = require("express");
const { Worker } = require("worker_threads");

const app = express();
const port = process.env.PORT || 3000;
const THREAD_COUNT = 4;

app.get("/non-blocking/", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

function createWorker() {
  return new Promise(function (resolve, reject) {
    const worker = new Worker("./worker.js", {
      workerData: { thread_count: THREAD_COUNT },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (msg) => {
      reject(`An error ocurred: ${msg}`);
    });
  });
}

app.get("/blocking", async (req, res) => {
  const workerPromises = [];
  let start = new Date()
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }
  const thread_results = await Promise.all(workerPromises);
  const total =
    thread_results[0] +
    thread_results[1] +
    thread_results[2] +
    thread_results[3];
  const end = new Date() - start
  res.status(200).send(`result is ${total}, time : ${end}ms`);
});

app.get("/blocking-withoutworker", async (req, res) => {
  let start = new Date()
  let counter = 0;
  for (let i = 0; i < 20_000_000_000 / workerData.thread_count; i++) {
    counter++;
  }
  
  const end = new Date() - start
  res.status(200).send(`result is ${total}, time : ${end}ms`);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});