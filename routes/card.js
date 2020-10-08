const express = require('express');
const CardController = require('../controllers/card');

const router = express.Router();
const auth = require('../middlewares/authenticated');

router.post('/card', auth.ensureAuth, CardController.saveCard);
router.get('/card/:id', auth.ensureAuth, CardController.getCard);
router.get('/cards/:page?', auth.ensureAuth, CardController.getCards);
router.get('/cards-user/:user/:page?', auth.ensureAuth, CardController.getCardsUser),
router.post('/card-deposit/:id', auth.ensureAuth, CardController.depositMoney);
router.post('/card-withdraw/:id', auth.ensureAuth, CardController.withdrawMoney);
router.post('/card-transact/:id', auth.ensureAuth, CardController.transactMoney);
router.delete('/card/:id', auth.ensureAuth, CardController.deleteCard);

module.exports = router;