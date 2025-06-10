require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const User = require('./models/User');
const Space = require('./models/Space');
const Booking = require('./models/Booking');

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connecté !'))
.catch(err => console.error('Erreur MongoDB:', err));

// Résolveurs GraphQL
const resolvers = {
  Query: {
    users: () => User.find(),
    spaces: () => Space.find(),
    availableSpaces: async (_, { start, end }) => {
      const bookings = await Booking.find({
        start: { $lt: new Date(end) },
        end: { $gt: new Date(start) }
      });
      const bookedSpaceIds = bookings.map(b => b.spaceId);
      return Space.find({ _id: { $nin: bookedSpaceIds } });
    }
  },
  Mutation: {
    createUser: (_, { name, email }) => new User({ name, email }).save(),
    createSpace: (_, { name, type, capacity }) => new Space({ name, type, capacity }).save(),
    bookSpace: async (_, { userId, spaceId, start, end }) => {
      // Vérifier conflit
      const existing = await Booking.findOne({
        spaceId,
        start: { $lt: new Date(end) },
        end: { $gt: new Date(start) }
      });
      
      if (existing) throw new Error("Conflit de réservation!");
      
      return new Booking({ 
        userId, 
        spaceId, 
        start: new Date(start), 
        end: new Date(end) 
      }).save();
    }
  },
  // Relations
  Booking: {
    user: (parent) => User.findById(parent.userId),
    space: (parent) => Space.findById(parent.spaceId)
  }
};

async function startServer() {
  // Créer l'application Express
  const app = express();
  
  // Configurer Apollo Server
  const server = new ApolloServer({ typeDefs, resolvers });
  
  // Démarrer Apollo Server avant d'appliquer le middleware
  await server.start();
  
  // Appliquer le middleware Apollo à Express
  server.applyMiddleware({ app });
  
  // Démarrer le serveur
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Serveur prêt sur http://localhost:${PORT}${server.graphqlPath}`);
  });
}

// Démarrer le serveur
startServer().catch(err => console.error('Erreur démarrage serveur:', err));