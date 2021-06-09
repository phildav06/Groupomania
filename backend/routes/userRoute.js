const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/userCtrl');

//  Users routes
router.post('/register/', userCtrl.register);
router.post('/login/', userCtrl.login);
router.get('/profile/', userCtrl.userProfile);
router.put('/profile/', userCtrl.updateUserProfile);

module.exports = router;