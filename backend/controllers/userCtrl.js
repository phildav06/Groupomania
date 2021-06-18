//  Imports
const bcrypt = require('bcrypt');
const asyncLib = require('async');
const jwtCtrl = require('../middleware/auth');
const verifInputUsers = require('../utils/verifInputUsers');
const models = require('../models');
require('dotenv').config({ path: './config/.env' });

//  Routes
module.exports = {
    register: (req, res) => {

        //  Params
        const email = req.body.email;
        const pseudo = req.body.pseudo;
        const password = req.body.password;
        const avatar = req.body.avatar;
        const is_admin = req.body.is_admin;

        if (email == null || pseudo == null || password == null) {
            return res.status(400).json({ 'error': 'a field is not filled!' });
        }
        if (!verifInputUsers.PSEUDO_REGEX(pseudo)) {
            return res.status(400).json({ 'error': 'wrong pseudo! (must be length 15 characters max, no dot and no special characters)' });
        }
        // Verif email by regex
        if (!verifInputUsers.EMAIL_REGEX(email)) {
            return res.status(400).json({ 'error': 'email is not valid!' });
        }
        // Verif password by regex
        if (!verifInputUsers.PASSWORD_REGEX(password)) {
            return res.status(400).json({ 'error': 'password invalid (must contain at least: 8 characters, 1 lowercase letter, 1 uppercase, 1 number and 1 special character as only   !#@$?/%µ²*,&~èçà+_¤-  )!' });
        }

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    attributes: ['email'],
                    where: { email: email }
                })
                    .then((userFound) => {
                        done(null, userFound);
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'unable to verify user!' });
                    });
            },
            (userFound, done) => {
                if (!userFound) {
                    bcrypt.hash(password, 10, (err, bcryptPassword) => {
                        done(null, userFound, bcryptPassword);
                    });
                } else {
                    return res.status(409).json({ 'error': 'user already exist!' });
                }
            },
            (userFound, bcryptPassword, done) => {
                const newUser = models.User.create({
                    email: email,
                    pseudo: pseudo,
                    password: bcryptPassword,
                    avatar: avatar,
                    is_admin: 0
                })
                    .then((newUser) => {
                        done(newUser);
                    })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'cannot add user' });
                    });
            }
        ], (newUser) => {
            if (newUser) {
                return res.status(201).json({
                    'userId': newUser.id
                });
            } else {
                return res.status(500).json({ 'error': 'cannot add user!' })
            }
        });
    },
    login: (req, res) => {

        // Params
        const email = req.body.email;
        const password = req.body.password;

        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'a field is not filled!' });
        }

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    where: { email: email }
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
                    bcrypt.compare(password, userFound.password, (errOfcrypt, resOfcrypt) => {
                        done(null, userFound, resOfcrypt);
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not exist in DB' });
                }
            },
            (userFound, resOfcrypt, done) => {
                if (resOfcrypt) {
                    done(userFound);
                } else {
                    return res.status(403).json({ 'error': 'invalid password' });
                }
            }
        ], (userFound) => {
            if (userFound) {
                return res.status(201).json({
                    'userId': userFound.id,
                    'token': jwtCtrl.generateTokenUser(userFound)
                });
            } else {
                return res.status(500).json({ 'error': 'cannot log on user' });
            }
        });
    },
    userProfile: (req, res) => {
        // Get the authentication header
        const headerAuth = req.headers['authorization'];
        const userId = jwtCtrl.getUserId(headerAuth);

        if (userId < 0)
            return res.status(400).json({ 'error': 'wrong token' });

        models.User.findOne({
            attributes: ['id', 'email', 'pseudo', 'avatar'],
            where: { id: userId }
        })
            .then((user) => {
                if (user) {
                    res.status(201).json(user);
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            })
            .catch((err) => {
                res.status(500).json({ 'error': 'cannot fetch user' });
            });
    },
    updateUserProfile: (req, res) => {
        // Get the authentication header
        const headerAuth = req.headers['authorization'];
        const userId = jwtCtrl.getUserId(headerAuth);

        // Params
        const avatar = req.body.avatar;

        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    attributes: ['id', 'avatar'],
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
                    userFound.update({
                        avatar: (avatar ? avatar : userFound.avatar)
                    })
                        .then(() => {
                            done(userFound);
                        })
                        .catch((err) => {
                            res.status(500).json({ 'error': 'cannot update user' });
                        });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], (userFound) => {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update user profile' });
            }
        });
    }
};