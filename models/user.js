const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const UnauthorizedError = require('../errors/unauthorized-err');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    validate: {
      validator(url) {
        return /^(http:\/\/|https:\/\/)w*\w/.test(url);
      },
      message: 'Некорректный формат ссылки',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: 'Некорректный формат электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  // попытка найти пользователя по почте
  return this.findOne({ email }).select('+password')
    // eslint-disable-next-line consistent-return
    .then((user) => {
      // не найден - промис отклонён
      if (!user) {
        return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
      }
      // найден - сравнение хешей
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) { // хеши не совпали - промис отклонён
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
