const router = require('express').Router();
const {
  getUsers,
  getUserById,
  getMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/me', getMe);
router.get('/:userId', getUserById);
router.get('/', getUsers);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
