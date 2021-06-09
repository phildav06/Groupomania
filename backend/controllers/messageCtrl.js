// *********** CONTROL MESSAGES ***********
//  Imports
const asyncLib = require('async');
const jwtCtrl = require('../middleware/auth');
const models = require('../models');

// Limit control length message
const MESSAGE_LIMIT = 4;
const ITEMS_LIMIT = 50;

//  Routes
module.exports = {
    createMessage: (req, res) => {

        // Get the authentication header
        const headerAuth = req.headers['authorization'];
        const userId = jwtCtrl.getUserId(headerAuth);

        // Params
        const content = req.body.content;

        if (content == null) {
            return res.status(400).json({ 'error': 'missing parameters!' });
        }

        if (content.length <= MESSAGE_LIMIT) {
            return res.status(400).json({ 'error': 'invalid parameters!' });
        }

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    where: { id: userId }
                })
                    .then((userFound) => {
                        done(null, userFound);
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            (userFound, done) => {
                if (userFound) {
                    models.Message.create({
                        content: content,
                        likes: 0,
                        dislikes: 0,
                        UserId: userFound.id
                    })
                        .then((newMessage) => {
                            done(newMessage);
                        });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], (newMessage) => {
            if (newMessage) {
                return res.status(201).json(newMessage);
            } else {
                return res.status(500).json({ 'error': 'cannot post message' });
            }
        });
    },
    getAllMessages: (req, res) => {
        const fields = req.query.fields;
        const limit = parseInt(req.query.limit);
        const offset = parseInt(req.query.offset);
        const order = req.query.order;

        if (limit > ITEMS_LIMIT) {
            limit = ITEMS_LIMIT;
        }

        models.Message.findAll({
            order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],
            attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
            limit: (!isNaN(limit)) ? limit : null,
            offset: (!isNaN(offset)) ? offset : null,
            include: [{
                model: models.User,
                attributes: ['pseudo']
            }]
        }).then((messages) => {
            if (messages) {
                res.status(200).json(messages);
            } else {
                res.status(404).json({ "error": "no messages found" });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json({ "error": "invalid fields" });
        });
    }
};