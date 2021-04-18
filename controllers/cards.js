const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.send(card))
    .catch((err) => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.deleteCardById = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(new Error('Not valid id'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'Not valid id') {
        res.status(404).send({ message: 'Такой карточки не существует' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
