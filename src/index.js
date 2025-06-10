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
    users: async () => await User.find(),
    spaces: async () => await Space.find(),
    availableSpaces: async (_, { start, end }) => {
      const bookings = await Booking.find({
        start: { $lt: new Date(end) },
        end: { $gt: new Date(start) }
      });

      const bookedSpaceIds = bookings.map(b => b.spaceId);
      return await Space.find({ _id: { $nin: bookedSpaceIds } });
    }
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
      const user = new User({ name, email });
      return await user.save();
    },
    createSpace: async (_, { name, type, capacity }) => {
      const space = new Space({ name, type, capacity });
      return await space.save();
    },
    bookSpace: async (_, { userId, spaceId, start, end }) => {
      const existing = await Booking.findOne({
        spaceId,
        start: { $lt: new Date(end) },
        end: { $gt: new Date(start) }
      });

      if (existing) {
        throw new Error("Conflit de réservation!");
      }

      const booking = new Booking({
        userId,
        spaceId,
        start: new Date(start),
        end: new Date(end)
      });

      return await booking.save();
    }
  },
  Booking: {
    user: async (parent) => await User.findById(parent.userId),
    space: async (parent) => await Space.findById(parent.spaceId)
  }
};

async function startServer() {
  const app = express();
  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Serveur prêt sur http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(err => console.error('Erreur démarrage serveur:', err));
