#!/bin/bash

# 🚀 Athena Factory Migration Tool (Skill v1.0)
# Migrates sites from ~/kla/sites/ to the Athena V9 Factory (~/0-IT/4-pj/x-v9/athena/sites/).

SITE_NAME=$1
GH_ORG="athenasitesy"
FACTORY_PATH="/home/kareltestspecial/0-IT/4-pj/x-v9/athena"
VAULT_PUSHER="/home/kareltestspecial/0-IT/4-pj/x-v9/control/forklift/push.sh"

if [ -z "$SITE_NAME" ]; then
    echo "Usage: ./athena-migrate.sh <site_name> [-p|--park]"
    exit 1
fi

SOURCE_PATH="/home/kareltestspecial/kla/sites/$SITE_NAME"
TARGET_PATH="$FACTORY_PATH/sites/$SITE_NAME"

if [ ! -d "$SOURCE_PATH" ]; then
    echo "❌ Error: Source '$SOURCE_PATH' not found."
    exit 1
fi

echo "📦 Migrating '$SITE_NAME' to the Factory..."
mkdir -p "$TARGET_PATH"
rsync -av --exclude 'node_modules' --exclude 'dist' --exclude '.git' "$SOURCE_PATH/" "$TARGET_PATH/"

echo "🏗️  Staging changes in Monorepo..."
cd "$FACTORY_PATH" || exit 1
git add "sites/$SITE_NAME"
git commit -m "feat: migrate $SITE_NAME from kla to factory" || echo "Nothing to commit in Factory"

echo "📤 Pushing to Monorepo (origin)..."
git push origin main

# Switch GH account for Org Repo Create if needed
CURRENT_GH_USER=$(gh auth status | grep "Logged in to github.com account" | head -n 1 | awk '{print $NF}')
echo "👤 Current GH User: $CURRENT_GH_USER"

if [[ "$CURRENT_GH_USER" != "athenacmsfactory" ]]; then
    echo "🔄 Switching to athenacmsfactory for repo creation..."
    gh auth switch -h github.com -u athenacmsfactory
fi

echo "🌿 Performing Subtree Push to $GH_ORG/$SITE_NAME..."
if ! gh repo view "$GH_ORG/$SITE_NAME" &>/dev/null; then
    echo "✨ Creating repository $GH_ORG/$SITE_NAME..."
    gh repo create "$GH_ORG/$SITE_NAME" --public --description "Athena Site: $SITE_NAME"
fi

git subtree push --prefix "sites/$SITE_NAME" "git@github-athena:$GH_ORG/$SITE_NAME.git" main

# Switch back to Karel if we switched away
if [[ "$CURRENT_GH_USER" != "athenacmsfactory" ]]; then
    echo "🔄 Switching back to $CURRENT_GH_USER..."
    gh auth switch -h github.com -u "$CURRENT_GH_USER"
fi

# Optional Parking
if [[ "$2" == "-p" || "$2" == "--park" ]]; then
    echo "🚜 🚜 Parking site in Vault..."
    chmod +x "$VAULT_PUSHER"
    "$VAULT_PUSHER" "$SITE_NAME" --yes
fi

echo "✅ Migration and Sync complete for '$SITE_NAME'."
