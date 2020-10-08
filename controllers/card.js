var Card = require('../models/card');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');



function saveCard(req, res) {
    var params = req.body;
   
    
    if (!params.cardNumber)
    return res.status(200).send({message: 'insert Card number'});

    var card = new Card();
    card.name = params.name;
    card.cardNumber = params.cardNumber;
    card.expMonth = params.expMonth;
    card.expYear = params.expYear;
    card.cvc = params.cvc;
    card.money = params.money;
    card.user = req.user.sub;

    card.save((err, cardStored) => {
        if (err)
            return res.status(500).send({ message: 'Error storing card' });
        if (!cardStored)
            return res.status(404).send({ message: 'The card has not been stored' });
            
        return res.status(200).send({ card: cardStored });    
    });
}

function getCard(req, res) {
    var id = req.params.id;

    Card.findById(id, function(err, card)  {
        if (err)
            return res.status(500).send({ message: 'Error returning card' });
        if (!card)
            return res.status(404).send({ message: 'not exist card' }); 
        
        return res.status(200).send({ card: card });
    });
}

function getCards(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var itemsPerPage = 200;

    Card.find({ }).populate('user')
    .paginate(page, itemsPerPage, (err, cards, total) => {
            if (err)
                return res.status(500).send({ message: 'error returnig cards' });
            if (!cards) 
                return res.status(404).send({message: 'not exists cards'});

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page,
                items_per_page: itemsPerPage,
                cards,
            });
        });
}

function getCardsUser(req, res) {
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }

    var user = req.user.sub;

    if (req.params.user) {
        user = req.params.user;
    }

    var itemsPerPage = 20;

    Card.find({ user: req.user.sub }).populate('user')
    .paginate(page, itemsPerPage, (err, cards, total) => {
            if (err)
                return res.status(500).send({ message: 'error returnig cards' });
            if (!cards) 
                return res.status(404).send({message: 'not exists cards'});

            return res.status(200).send({
                total_items: total,
                pages: Math.ceil(total/itemsPerPage),
                page,
                items_per_page: itemsPerPage,
                cards,
            });
        });
}


function depositMoney(req, res) {

    var cardId = req.params.id;
    var amount = req.body.money;


    Card.findById(cardId, function(err, cardUpdate) {
        if (err)
            return res.status(500).send({ message: 'request failed'});
        if (!cardUpdate)
            return res.status(404).send({ message: 'card not found'});    
        else {
            var newAmount = parseInt(cardUpdate.money) + parseInt(amount);
            cardUpdate.money = newAmount;
            cardUpdate.save();
            return res.status(200).send({ card: cardUpdate });
        }    
    });
    
}

function withdrawMoney(req, res) {

    var cardId = req.params.id;
    var amount = req.body.money;


    Card.findById(cardId, function(err, cardUpdate) {     
        if (err)
            return res.status(500).send({ message: 'request failed'});
        if (!cardUpdate)
            return res.status(404).send({ message: 'card not found'});    
        else {
            var newAmount = parseInt(cardUpdate.money) - parseInt(amount);
            cardUpdate.money = newAmount;
            cardUpdate.save();
            return res.status(200).send({ card: cardUpdate });
        }    
    });
    
}

function transactMoney(req, res) {

    var cardId = req.params.id;
    var amount = req.body.money;
    var newAmount, decreseAmount;

    Card.findById(cardId, function(err, foundCard) {        
        if (err)
        return res.status(500).send({message: 'error returning card'});
        if (!foundCard)
        return res.status(404).send({message: 'card not found'});
        else{
            Card.find({cardNumber: req.body.cardNumber}, function(err, cards) {
                if (err)
                return res.status(500).send({message: 'error returning cards'}); 
                if (!cards)
                return res.status(404).send({message: 'cards not founds'});                
                else {
                    newAmount = parseInt(cards[0].money) + parseInt(amount);
                    cards[0].money = newAmount;
                    decreseAmount = parseInt(foundCard.money) - parseInt(amount);
                    foundCard.money = decreseAmount;
                    foundCard.save();
                    cards[0].save();
                    res.status(200).send({ card: foundCard, cards: cards }); 
                }
            });    
        }
    });
}

function deleteCard(req, res) {
    var id = req.params.id;
    Card.find({ user: req.user.sub,  _id: id }).deleteOne(err => {
        if (err) 
            return res.status(500).send({ message: 'error deleting card'});
        
        return res.status(200).send({ message: 'card deleting'});
    });
}

module.exports = {
    saveCard,
    getCard,
    getCards,
    getCardsUser,
    depositMoney,
    withdrawMoney,
    transactMoney,
    deleteCard    
};