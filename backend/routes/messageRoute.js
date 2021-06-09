// Création d'un routeur express
const express = require('express');
const router = express.Router();


// *********** CONTROL MESSAGES ***********
const messageCtrl = require('../controllers/messageCtrl');          // Importation du fichier "message" du dossier "controllers"
const multer = require('../middleware/multer-config');              // Importation du fichier "multer-config" du dossier "middleware" pour le téléchargement
const likesCtrl = require('../controllers/likesCtrl'); 


router.get('/', messageCtrl.getAllMessages);                        // Récupération de tous les messages
router.post('/new', multer, messageCtrl.createMessage);             // Création d'un message
// router.put('/:id', multer, messageCtrl.modifyMessage);           // Modification d'un message
// router.delete('/:id', messageCtrl.deleteMessage);                // Suppression d'un message
// router.get('/:id', messageCtrl.getOneMessage);                   // Récupération d'un message

router.post('/:messageId/like', likesCtrl.likeMessage);             // Like message
router.post('/:messageId/dislike', likesCtrl.dislikeMessage);       // disLike message

module.exports = router;
