const amqp = require("amqplib");
const uuid = require("uuid");

const config = require("../config");

const main = async () => {
  const conn = await amqp.connect(config.rabbitmqUri);

  const chan = await conn.createChannel();

  const exchange = "logs";

  const msg = uuid.v4();

  const ex = await chan.assertExchange(exchange, "fanout", { durable: false });

  const emptyRoutingKey = "";

  for (let i = 0; i < 10; i += 1)
    console.log(
      await chan.publish(ex.exchange, emptyRoutingKey, Buffer.from(msg))
    );

  setTimeout(() => conn.close(), 500);
};

main();
