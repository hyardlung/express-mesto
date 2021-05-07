const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden-err');

const { NODE_ENV, JWT_SECRET } = process.env;

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // извлечение авторизационного заголовка
  // const { authorization } = req.headers;
  const token = req.cookies.mestoToken;
  if (!token) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  // верификация токена
  let payload;

  try {
    // попытка верифицировать токен
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    // отправка ошибки при неудаче
    throw new ForbiddenError('В доступе отказано');
  }

  req.user = payload; // запись payload в объект запроса
  next(); // пропуск запроса дальше
};
