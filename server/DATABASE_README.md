# 🗄️ Configuration de la Base de Données - Adonis.js

## 📋 Résumé

Ce serveur Adonis.js est configuré pour utiliser une base de données **MariaDB** accessible sur:
- **Host**: 127.0.0.1
- **Port**: 3600
- **Utilisateur**: root
- **Mot de passe**: (aucun)
- **Base de données**: codename

## ✅ Installation Complète

Tous les fichiers de configuration sont en place et l'application est prête à fonctionner.

### Fichiers Configurés:
- ✅ [.env](/.env) - Variables d'environnement
- ✅ [.env.example](/.env.example) - Exemple de configuration
- ✅ [config/database.ts](/config/database.ts) - Configuration Lucid ORM
- ✅ [start/env.ts](/start/env.ts) - Validation des variables
- ✅ [adonisrc.ts](/adonisrc.ts) - Configuration Adonis avec Lucid

### Dépendances Installées:
- ✅ `@adonisjs/lucid@22.4.2` - ORM Node.js
- ✅ `mysql2` - Pilote MySQL/MariaDB

## 🚀 Démarrage Rapide

### 1. Créer la Base de Données (si nécessaire)

**Méthode 1: Utiliser le script automatisé**
```bash
./setup-db.sh
```

**Méthode 2: Manuellement avec mysql**
```bash
mysql -h 127.0.0.1 -P 3600 -u root
```

```sql
CREATE DATABASE IF NOT EXISTS codename CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Démarrer l'Application

```bash
npm run dev
```

L'application se connectera automatiquement à la base de données au démarrage.

## 📚 Utilisation avec Lucid ORM

### Créer une Migration

```bash
npm run dev -- make:migration create_users_table
```

Cela crée un fichier dans `database/migrations/`

### Exécuter les Migrations

```bash
npm run dev -- migrate
```

### Créer un Seeder

```bash
npm run dev -- make:seeder UserSeeder
```

### Exécuter les Seeders

```bash
npm run dev -- db:seed
```

## 🔍 Vérification de la Configuration

Pour vérifier que tout est bien configuré:

```bash
# Vérifiez les variables d'environnement
cat .env | grep DB_

# Compilez le projet
npm run build

# Vérifiez qu'il n'y a pas d'erreurs TypeScript
```

## 📂 Structure du Dossier Database

```
database/
├── migrations/          # Fichiers de migration de schéma
│   └── .gitkeep
└── seeders/            # Fichiers de données initiales
    └── .gitkeep
```

Les migrations et seeders sont version contrôlées. Les données générées à la runtime ne le sont pas.

## ⚙️ Paramètres Personnalisés

Pour modifier les paramètres de connexion:

1. Éditez le fichier `.env`
2. Modifiez les variables `DB_*` appropriées
3. Redémarrez l'application

### Exemple d'une Configuration Personnalisée

```env
DB_HOST=localhost
DB_PORT=3307
DB_USER=app_user
DB_PASSWORD=secure_password
DB_DATABASE=my_database
```

## 🆘 Dépannage

### "Cannot connect to database"

1. Vérifiez que MariaDB est en cours d'exécution:
   ```bash
   mysql -h 127.0.0.1 -P 3600 -u root
   ```

2. Vérifiez les variables dans `.env`

3. Assurez-vous que la base de données existe:
   ```bash
   mysql -h 127.0.0.1 -P 3600 -u root -e "SHOW DATABASES;"
   ```

### "Unknown database 'codename'"

Créez la base de données:
```bash
mysql -h 127.0.0.1 -P 3600 -u root -e "CREATE DATABASE codename;"
```

### "Access denied for user"

Vérifiez les identifiants dans `.env` et assurez-vous que l'utilisateur a les permissions appropriées.

## 📖 Documentation Officielle

- [Lucid ORM Documentation](https://docs.adonisjs.com/guides/database)
- [Adonis.js Database Guide](https://docs.adonisjs.com/guides/database)
- [MySQL2 Driver](https://github.com/sidorares/node-mysql2)

## 🎯 Prochaines Étapes

1. ✅ Configuration complète
2. 📝 Créez vos migrations
3. 🗄️ Exécutez les migrations
4. 🌱 Créez des seeders si nécessaire
5. 🧪 Testez votre application

Bonne chance! 🚀
