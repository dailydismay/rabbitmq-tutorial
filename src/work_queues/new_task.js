const amqp = require("amqplib");
const uuid = require("uuid");

const config = require("../config");

const main = async () => {
  const conn = await amqp.connect(config.rabbitmqUri);

  const chan = await conn.createChannel();

  const queue = "work";

  const msg = "hello world - " + uuid.v4();

  await chan.assertQueue(queue, { durable: true });

  for (let i = 0; i < 10; i += 1)
    await chan.sendToQueue(queue, Buffer.from(`${i} - ` + msg), {
      persistent: true,
    });

  setTimeout(() => {
    conn.close();
    process.exit(0);
  }, 500);
};

main();
