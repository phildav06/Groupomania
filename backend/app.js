//  Imports
const express = require('express');
const helmet = require('helmet');
const path = require('path');

const userRoutes = require('./routes/userRoute');
const messageRoutes = require('./routes/messageRoute');

// Création de l'application Express sécurisée par elmet
const app = express();
app.use(helmet());

//  Gestion de la compatibilité des différents ports entre serveurs
app.use((req, res, next) => {
  // Accès à l'origine par tout le monde
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Autorisation de certains en-têtes
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  // Autorisation des certaines méthodes 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  Users route
app.use('/api/users', userRoutes);

//  Messages route
app.use('/api/messages/', messageRoutes);

// Images route
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;
