const Joi = require("joi");
Joi.ObjectId = require("joi-objectid")(Joi);

const id = Joi.ObjectId();
const username = Joi.string();
const provider = Joi.string();
const name = Joi.string();
const email = Joi.string().email();
const image = Joi.string().uri();
const accessToken = Joi.string();
const refreshToken = Joi.string();

const createUserDto = Joi.object({
  username: username.required(),
  provider: provider.required().default("local"),
  name: name.required(),
  email: email.required(),
  image: image.required(),
  accessToken: accessToken.required(),
  refreshToken,
  password: Joi.string().when("provider", {
    is: "local",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
});

const updateUserDto = Joi.object({
  name: name,
  email: email,
  image: image,
});

const getUserDto = Joi.object({
  id: id.required(),
});

module.exports = {
  createUserDto,
  getUserDto,
  updateUserDto,
  id,
};
