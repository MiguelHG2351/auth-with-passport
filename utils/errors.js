const boom = require("@hapi/boom");

const unauthorized = (message) => {
  const {
    output: { statusCode, payload },
  } = boom.unauthorized(message);
  return {
    statusCode,
    payload,
  };
};

const notFound = (message) => {
  const {
    output: { statusCode, payload },
  } = boom.notFound(message);
  return {
    statusCode,
    payload,
  };
};

const badRequest = (message) => {
  const {
    output: { statusCode, payload },
  } = boom.badRequest(message);
  return {
    statusCode,
    payload,
  };
};

module.exports = {
  unauthorized,
  notFound,
  badRequest,
};
