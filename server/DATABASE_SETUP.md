# Configuration de la Base de Données

## Informations de Connexion

Cette application Adonis.js est configurée pour se connecter à une base de données MariaDB avec les paramètres suivants:

- **Host**: 127.0.0.1
- **Port**: 3600
- **User**: root
- **Password**: (vide - sans mot de passe)
- **Database**: codename

## Fichiers Configurés

### 1. `.env` (Variables d'environnement)
```
DB_HOST=127.0.0.1
DB_PORT=3600
DB_USER=root
DB_PASSWORD=
DB_DATABASE=codename
```

### 2. `start/env.ts` (Validation des variables)
Définit les variables d'environnement avec validation de type.

### 3. `config/database.ts` (Configuration Lucid)
Configuration de la connexion MySQL2 pour Lucid ORM.

### 4. `adonisrc.ts`
Enregistrement des commandes Lucid et configuration de base.

## Structure des Migrations et Seeders

```
database/
├── migrations/     # Fichiers de migration de schéma
└── seeders/       # Fichiers de seeders pour les données
```

## Commandes Disponibles

Une fois la base de données MariaDB en place, vous pouvez utiliser:

```bash
# Créer une migration
npm run dev -- make:migration create_users_table

# Exécuter les migrations
npm run dev -- migrate

# Créer un seeder
npm run dev -- make:seeder UserSeeder

# Exécuter les seeders
npm run dev -- db:seed
```

## Installation et Démarrage

### Prérequis
- MariaDB 10.4+ en cours d'exécution sur 127.0.0.1:3600
- Base de données `codename` créée

### Étapes

1. Installer les dépendances:
   ```bash
   npm install
   ```

2. Compiler le projet:
   ```bash
   npm run build
   ```

3. Démarrer le serveur de développement:
   ```bash
   npm run dev
   ```

## Dépendances Installées

- `@adonisjs/lucid@22.4.2` - ORM pour Node.js
- `mysql2` - Pilote MySQL/MariaDB pour Node.js

## Vérification de la Connexion

La connexion à la base de données sera automatiquement testée au démarrage de l'application. Si la base de données n'est pas accessible, l'application affichera une erreur de connexion.
