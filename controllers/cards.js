const Card = require('../models/card');
const BadRequestError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenError = require('../errors/forbidden-err');

// получение всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

// создание карточки
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

// удаление карточки по ID
module.exports.deleteCardById = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  // поиск карточки и проверка её ID на соответствие ID пользователя
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Такой карточки не существует');
      }
      if (card.owner._id.toString() !== owner) {
        throw new ForbiddenError('В доступе отказано');
      }
      // поиск и удаление карточки
      return Card.findByIdAndRemove(cardId)
        .populate(['owner', 'likes'])
        .then(() => res.send({ message: 'Карточка успешно удалена' }))
        .catch(next);
    })
    .catch(next);
};

// лайк карточки
module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: owner } },
    { new: true, runValidators: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) throw new NotFoundError('Такой карточки не существует');
      res.send(card);
    })
    .catch(next);
};

// дизлайк карточки
module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const owner = req.user._id;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: owner } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((card) => {
      if (!card) throw new NotFoundError('Такой карточки не существует');
      res.send(card);
    })
    .catch(next);
};
