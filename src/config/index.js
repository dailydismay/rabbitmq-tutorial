require("dotenv").config();

module.exports = {
  rabbitmqUri: process.env.RABBITMQ_URI || "amqp://dev:dev@localhost:5672",
};
