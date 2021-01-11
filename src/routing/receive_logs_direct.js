const amqp = require("amqplib");

const config = require("../config");

const main = async () => {
  const conn = await amqp.connect(config.rabbitmqUri);

  const chan = await conn.createChannel();

  const exchange = "direct_logs";
  await chan.assertExchange(exchange, "direct", { durable: false });

  const q = await chan.assertQueue("", {
    exclusive: true,
  });

  process.argv
    .slice(2)
    .forEach((severity) => chan.bindQueue(q.queue, exchange, severity));

  await chan.consume(
    q.queue,
    (msg) => {
      console.log(
        " [x] %s: '%s'",
        msg.fields.routingKey,
        msg.content.toString()
      );
    },
    { noAck: true }
  );

  setTimeout(() => conn.close(), 1000 * 60);
};

main();
