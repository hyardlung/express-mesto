const jwt = require('jsonwebtoken');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  // извлечение авторизационного заголовка
  const { authorization } = req.headers;
  // проверка наличия заголовка или того, что он начинается с Bearer
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Необходима авторизация' });
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
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  req.user = payload; // запись payload в объект запроса
  next(); // пропуск запроса дальше
};
