const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

// РЕГИСТРАЦИЯ (создание пользователя, добавление в базу данных)
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

// АВТОРИЗАЦИЯ
module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-string',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

// получение залогиненного пользователя
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.send(user);
      } else {
        res.status(404).send('Пользователь с таким ID не найден');
      }
    })
    .catch((err) => next(err));
};

// получение пользователя из бд по ID
module.exports.getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь с указанным ID не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

// получение всех пользователей из бд
module.exports.getUsers = (req, res) => {
  User.find({})
    .orFail(new Error('NotValidId'))
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Объект не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

// обновление данных пользователя
module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Пользователь с указанным ID не найден' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

// обновление аватара пользователя
module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};
