const amqp = require("amqplib");

const config = require("../config");

const main = async () => {
  const conn = await amqp.connect(config.rabbitmqUri);

  const chan = await conn.createChannel();

  const exchange = "logs";
  await chan.assertExchange(exchange, "fanout", { durable: false });

  const q = await chan.assertQueue("", {
    exclusive: true,
  });

  chan.bindQueue(q.queue, exchange, "");

  await chan.consume(
    q.queue,
    (msg) => {
      console.log("123");
      console.log(`[${q.queue}] - ${msg.content.toString()}`);
      // chan.ack(msg);
    },
    { noAck: true }
  );

  setTimeout(() => conn.close(), 1000 * 60);
};

main();
