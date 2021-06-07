// GESTION DES FICHIERS ENVOYÉS VERS L'API
// Importation du pakage multer
const multer = require('multer');

//  Type de fichiers acceptés
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
};

const storage = multer.diskStorage({
    //Destination des fichiers vers le dossier images
    destination: (req, file, callback) => {
        callback(null, 'images');
    },

    // Ajout de l'extension
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage: storage }).single('image');