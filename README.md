# Système de Réservation de Coworking avec GraphQL

Ce projet implémente un système de réservation d'espaces de coworking en utilisant GraphQL, Node.js et MongoDB.

1. Analyse du Problème
Problème :
Gérer les réservations de bureaux/salles sans conflits horaires, remplacer un système manuel (Google Sheets).

Entités & Relations :

Utilisateur : Membre du coworking

Espace : Bureau ou salle de réunion

Réservation : Créneau horaire attribué à un utilisateur pour un espace

Relations :

Un Utilisateur peut avoir plusieurs Réservations

Un Espace peut avoir plusieurs Réservations

Une Réservation appartient à un Utilisateur et un Espace

Fonctionnalités (Web Service GraphQL) :

Gestion des utilisateurs (CRUD)

Gestion des espaces (CRUD)

Recherche des espaces disponibles par créneau

Création/annulation de réservations

Vérification des conflits horaires



## Fonctionnalités

- Gestion des espaces (bureaux et salles de réunion)
- Système de réservation avec vérification des conflits d'horaire
- Interface GraphQL avec GraphiQL pour le développement
- Validation des données et gestion des erreurs

## Installation

1. Cloner le repository
2. Installer les dépendances :
   ```bash
   npm install
   ```
3. Configurer MongoDB :
   - Créer un fichier `.env` avec la variable `MONGODB_URI`
   - Par défaut, le projet utilise MongoDB local sur le port 27017

## Démarrage

```bash
npm start     # Démarrer le serveur
npm run dev   # Démarrer le serveur avec nodemon
```

Le serveur sera accessible sur `http://localhost:4000` et l'interface GraphiQL sur `http://localhost:4000/graphql`

## Schéma GraphQL

### Types

- `Space` : Représente un espace de coworking
- `Reservation` : Représente une réservation

### Requêtes

```graphql
# Obtenir tous les espaces
query {
  spaces {
    id
    name
    type
    capacity
    description
  }
}

# Obtenir une réservation spécifique
query {
  reservation(id: "id_de_la_reservation") {
    id
    space {
      name
      type
    }
    user
    startTime
    endTime
    status
  }
}
```

### Mutations

```graphql
# Créer un nouvel espace
mutation {
  createSpace(
    name: "Bureau 1"
    type: "bureau"
    capacity: 1
    description: "Bureau individuel"
  ) {
    id
    name
  }
}

# Créer une réservation
mutation {
  createReservation(
    spaceId: "id_de_l_espace"
    user: "John Doe"
    startTime: "2024-01-01T09:00:00Z"
    endTime: "2024-01-01T17:00:00Z"
  ) {
    id
    status
  }
}

# Annuler une réservation
mutation {
  cancelReservation(id: "id_de_la_reservation") {
    id
    status
  }
}
```

## Structure du Projet

```
project_Web_Services/
├── models/              # Modèles MongoDB
│   ├── space.js
│   └── reservation.js
├── schema.js           # Schéma GraphQL
├── resolvers.js        # Résolveurs GraphQL
├── server.js          # Serveur Express
├── .env               # Configuration MongoDB
└── package.json       # Dépendances
```

## Technologies Utilisées

- Node.js
- Express
- MongoDB
- GraphQL
- Mongoose

