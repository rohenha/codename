#!/bin/bash

# Script de création de la base de données MariaDB pour Adonis.js
# Assurez-vous que MariaDB est en cours d'exécution sur 127.0.0.1:3600

# Configuration
DB_HOST="127.0.0.1"
DB_PORT="3600"
DB_USER="root"
DB_PASSWORD=""
DB_NAME="codename"

echo "🗄️ Création de la base de données MariaDB..."
echo "Connexion à: $DB_HOST:$DB_PORT avec l'utilisateur $DB_USER"

# Créer la base de données
if [ -z "$DB_PASSWORD" ]; then
  mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE $DB_NAME;
SHOW DATABASES LIKE '$DB_NAME';
EOF
else
  mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE $DB_NAME;
SHOW DATABASES LIKE '$DB_NAME';
EOF
fi

if [ $? -eq 0 ]; then
  echo "✅ Base de données '$DB_NAME' créée avec succès!"
  echo ""
  echo "📝 Prochaines étapes:"
  echo "1. Vérifiez que la configuration est correcte dans .env"
  echo "2. Lancez l'application: npm run dev"
  echo "3. Créez vos migrations: npm run dev -- make:migration <name>"
  echo "4. Lancez les migrations: npm run dev -- migrate"
else
  echo "❌ Erreur lors de la création de la base de données"
  echo "Vérifiez que:"
  echo "  - MariaDB est en cours d'exécution sur $DB_HOST:$DB_PORT"
  echo "  - L'utilisateur $DB_USER existe et peut se connecter"
  echo "  - Les identifiants sont corrects"
  exit 1
fi
