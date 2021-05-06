const jwt = require('jsonwebtoken');

const UnauthorizedError = require('../errors/unauthorized-err');
const ForbiddenError = require('../errors/forbidden-err');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // извлечение авторизационного заголовка
  const { authorization } = req.headers;
  // проверка наличия заголовка или того, что он начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  // извлечение токена
  const token = authorization.replace('Bearer ', '');
  // верификация токена
  let payload;

  try {
    // попытка верифицировать токен
    payload = jwt.verify(token, 'some-secret-string');
  } catch (err) {
    // отправка ошибки при неудаче
    throw new ForbiddenError('В доступе отказано');
  }

  req.user = payload; // запись payload в объект запроса
  next(); // пропуск запроса дальше
};
