const fastify = require('fastify')();

const { fastifySchedulePlugin } = require('@fastify/schedule');
const { SimpleIntervalJob, AsyncTask } = require('toad-scheduler');
const { fetch } = require('undici');

const task = new AsyncTask(
    'simple task',
    () => { return doFetch()
      .then((result) => {
        /* continue the promise chain */
      }) },
    (err) => {
      /* handle errors here */
    });

const job = new SimpleIntervalJob({ seconds: 2 }, task)

fastify.register(fastifySchedulePlugin);

fastify.ready().then(() => {
  fastify.scheduler.addSimpleIntervalJob(job);
});

async function doFetch() {
  await fetch(process.env.WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ content: 'hello, world' })
  });
}
