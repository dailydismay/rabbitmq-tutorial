const amqp = require("amqplib");

const config = require("../config");

const main = async () => {
  const conn = await amqp.connect(config.rabbitmqUri);

  const chan = await conn.createChannel();

  const queue = "work";

  await chan.assertQueue(queue, { durable: true });

  chan.prefetch(5);

  await chan.consume(queue, (msg) => {
    setTimeout(() => {
      console.log(msg.content.toString());
      chan.ack(msg);
    }, 2000);
  });

  setTimeout(() => conn.close(), 1000 * 60);
};

main();
