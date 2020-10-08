const express = require('express');
const UserController = require('../controllers/user');

const router = express.Router();
const auth = require('../middlewares/authenticated');

router.post('/register', UserController.saveUser);
router.post('/login', UserController.loginUser);
router.get('/user/:id', auth.ensureAuth, UserController.getUser);
router.put('/update-user/:id', auth.ensureAuth, UserController.updateUser);
router.post('/deposit/:id', auth.ensureAuth, UserController.depositMoney);
router.post('/withdraw/:id', auth.ensureAuth, UserController.withdrawMoney);
router.post('/transact/:id', auth.ensureAuth, UserController.transactMoney);

module.exports = router;