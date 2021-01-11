const amqp = require("amqplib");

const config = require("../config");

const main = async () => {
  const conn = await amqp.connect(config.rabbitmqUri);

  const chan = await conn.createChannel();

  const exchange = "direct_logs";
  const args = process.argv.slice(2);
  const msg = args.slice(1).join(" ") || "Hello World!";
  const severity = args.length > 0 ? args[0] : "info";

  await chan.assertExchange(exchange, "direct", { durable: false });

  console.log(await chan.publish(exchange, severity, Buffer.from(msg)));
  console.log(" [x] Sent %s: '%s'", severity, msg);

  setTimeout(() => conn.close(), 500);
};

main();
