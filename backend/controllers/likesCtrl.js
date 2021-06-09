// *********** CONTROL LIKES ***********
//  Imports
const asyncLib = require('async');
const jwtCtrl = require('../middleware/auth');
const models = require('../models');

//  Constants Liked or Disliked
const liked = 1;
const disliked = 0;

module.exports = {
    likeMessage: (req, res) => {

        // Get the authentication header
        const headerAuth = req.headers['authorization'];
        const userId = jwtCtrl.getUserId(headerAuth);

        // Params
        const messageId = parseInt(req.params.messageId);

        if (messageId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters!' });
        }

        asyncLib.waterfall([
            (done) => {
                models.Message.findOne({
                  where: { id: messageId }
                })
                .then((messageFound) => {
                  done(null, messageFound);
                })
                .catch((err) => {
                    // console.log(err.message);
                  return res.status(500).json({ 'error': 'unable to verify message' });
                });
            },
            (messageFound, done) => {
                if (messageFound) {
                    models.User.findOne({
                        where: { id: userId }
                    })
                        .then((userFound) => {
                            done(null, messageFound, userFound)
                    })
                        .catch((err) => {
                        return res.status(500).json({ 'error': 'unable to verify user!' });
                    })
                } else {
                    res.status(404).json({ 'error': ' message already liked!' });
                }
            },
            (messageFound, userFound, done) => {
                if (userFound) {
                    models.Like.findOne({
                        where: {
                            userId: userId,
                            messageId: messageId
                        }
                    })
                        .then((userAlreadyLikedFound) => {
                            done(null, messageFound, userFound, userAlreadyLikedFound);
                        })
                        .catch((err) => {
                            return res.status(500).json({ 'error': 'unable to verify if user already liked!' })
                        })
                } else {
                    res.status(404).json({ 'error': 'user not exist' });
                }
            },
            // Vérif if the user has not already liked
            (messageFound, userFound, userAlreadyLikedFound, done) => {
                if (!userAlreadyLikedFound) {
                    messageFound.addUser(userFound, { through:{is_Liked: liked} })

                        .then((alreadyLikeFound) => {
                            done(null, messageFound, userFound);
                        })
                        .catch((err) => {
                            console.log(err.message);
                            return res.status(500).json({ 'error': 'unable to set user reaction!' });
                        });
                } else {
                    if (userAlreadyLikedFound.is_Liked === disliked)
                    {
                        userAlreadyLikedFound.update({
                            is_Liked: liked,
                        })
                        .then(() => {
                            done(null, messageFound, userFound);
                        })
                        .catch((err) => {
                            res.status(500).json({ 'error': ' cannot update user reaction!' });
                        });
                    } else {
                    res.status(409).json({ 'error': 'message already liked!' });
                    }
                }
            },
            //  Update message with incrementation
            (messageFound, userFound, done) => {
                messageFound.update({
                    likes: messageFound.likes + 1,
                })
                    .then(() => {
                        done(messageFound);
                    })
                    .catch((err) => {
                        res.status(500); json({ 'error': 'cannot update the number of likes' })
                    });
            },
        ], (messageFound) => {
            if (messageFound) {
                return res.status(201).json(messageFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update message' });
            }
        });
    },
    dislikeMessage: (req, res) => {

        // Get the authentication header
        const headerAuth = req.headers['authorization'];
        const userId = jwtCtrl.getUserId(headerAuth);

        // Params
        const messageId = parseInt(req.params.messageId);

        if (messageId <= 0) {
            return res.status(400).json({ 'error': 'invalid parameters!' });
        }

        asyncLib.waterfall([
            (done) => {
                models.Message.findOne({
                    where: { id: messageId }
                })
                    .then((messageFound) => {
                        done(null, messageFound);
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'unable to verify message!' });
                    });
            },
            (messageFound, done) => {
                if (messageFound) {
                    models.User.findOne({
                        where: { id: userId }
                    })
                        .then((userFound) => {
                            done(null, messageFound, userFound)
                    })
                        .catch((err) => {
                        return res.status(500).json({ 'error': 'unable to verify user!' });
                    })
                } else {
                    res.status(404).json({ 'error': ' message already liked!' });
                }
            },
            (messageFound, userFound, done) => {
                if (userFound) {
                    models.Like.findOne({
                        where: {
                            userId: userId,
                            messageId: messageId
                        }
                    })
                        .then((userAlreadyLikedFound) => {
                            done(null, messageFound, userFound, userAlreadyLikedFound);
                        })
                        .catch((err) => {
                            return res.status(500).json({ 'error': 'unable to verify if user already liked!' })
                        })
                } else {
                    res.status(404).json({ 'error': 'user not exist' });
                }
            },
            // Vérif if the user has not already disliked
            (messageFound, userFound, userAlreadyLikedFound, done) => {
                if (!userAlreadyLikedFound) {
                    messageFound.addUser(userFound, { through:{is_Liked: disliked} })
                        .then((alreadyLikedFound) => {
                            done(null, messageFound, userFound, userAlreadyLikedFound);
                        })
                        .catch((err) => {
                            console.log(err.message);
                            return res.status(500).json({ 'error': 'unable to set user reaction!' });
                        });
                } else {
                    if (userAlreadyLikedFound.is_Liked === liked) {
                        userAlreadyLikedFound.update({
                            is_Liked: disliked,
                        })
                        .then(() => {
                            done(null, messageFound, userFound);
                        })
                        .catch((err) => {
                            res.status(500).json({ 'error': ' cannot update user reaction!' });
                        });
                    } else {
                        res.status(409).json({ 'error': 'message already disliked' });
                      }
                }
            },
            //  Update message with incrementation dislike
            (messageFound, userFound, done) => {
                messageFound.update({
                    likes: messageFound.likes - 1,
                })
                    .then(() => {
                        done(messageFound);
                    })
                    .catch((err) => {
                        res.status(500); json({ 'error': 'cannot update the number of dislikes' })
                    });
            },
        ], (messageFound) => {
            if (messageFound) {
                return res.status(201).json(messageFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update message' });
            }
        });
    }
};