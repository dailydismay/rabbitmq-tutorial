const amqp = require("amqplib");
const uuid = require("uuid");

const config = require("../config");

const main = async () => {
  const conn = await amqp.connect(config.rabbitmqUri);

  const chan = await conn.createChannel();

  const queue = "q";

  const msg = "hello world - " + uuid.v4();

  await chan.assertQueue(queue);

  await chan.sendToQueue(queue, Buffer.from(msg));

  setTimeout(() => conn.close(), 500);
};

main();
