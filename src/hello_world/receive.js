const amqp = require("amqplib");

const config = require("../config");

const main = async () => {
  const conn = await amqp.connect(config.rabbitmqUri);

  const chan = await conn.createChannel();

  const queue = "q";

  await chan.assertQueue(queue);

  await chan.consume(queue, (msg) => {
    console.log(`${process.pid} - ${msg.content.toString()}`);
    chan.ack(msg);
  });

  setTimeout(() => conn.close(), 1000 * 60);
};

main();
