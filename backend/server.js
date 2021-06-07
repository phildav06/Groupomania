//  Imports
// Import package http de node pour créer un serveur
const http = require('http');

// Importation de l'application (dossier app)
const app = require('./app');

//  Import de la config
require('dotenv').config({ path: './config/.env' });


// Renvoi d'un port valide
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
// la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const port = normalizePort(`${process.env.PORT}`);

// Indique à l'application sur quel port le serveur fonctionne (soit 3000)
app.set('port', port);

// la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée
// Elle est ensuite enregistrée dans le serveur
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// Création du serveur de l'application
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind + '! 😊');
});
// Écoute du serveur sur port 3000
server.listen(port);