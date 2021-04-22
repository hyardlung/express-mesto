const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .orFail(new Error('NotValidId'))
    .then((cards) => res.send(cards))
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

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный ID карточки' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new Error('NotValidId'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные' });
      } else if (err.message === 'NotValidId') {
        res.status(404).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};
