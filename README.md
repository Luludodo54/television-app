# 📺 Application Télévision - HTML/CSS/JS

Une application web complète de télévision avec un panneau administrateur pour gérer les chaînes, les vidéos et les publicités.

## 🎯 Fonctionnalités

### 👥 Interface Viewer (index.html)
- 📺 Sélection de chaîne TV
- 🎬 Lecteur vidéo MP4 avec contrôles complets
- 📢 Affichage automatique des publicités
- 📋 Playlist avec aperçu des vidéos suivantes
- ⏱️ Minuteur et progression de lecture
- 📱 Design responsive

### ⚙️ Panneau Administrateur (admin.html)
- 🎭 Gestion complète des chaînes
- 🎥 Ajout/suppression de vidéos MP4
- 📢 Gestion des publicités
- ⚙️ Configuration de l'intervalle des pubs
- 💾 Export/Import des données
- 🗑️ Fonction de réinitialisation

## 🚀 Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/Luludodo54/television-app.git
   cd television-app
   ```

2. **Ouvrir dans le navigateur**
   - Double-cliquez sur `index.html`
   - Ou utilisez un serveur local

## 📁 Structure du Projet

```
television-app/
├── index.html        # Interface de visualisation TV
├── admin.html        # Panneau administrateur
├── style.css         # Styles de l'interface TV
├── admin-style.css   # Styles du panneau admin
├── app.js            # Logique de la télévision
├── admin.js          # Logique du panneau admin
└── README.md         # Ce fichier
```

## 🎮 Guide d'Utilisation

### Interface TV (index.html)

1. **Sélectionner une chaîne** : Utilisez le menu déroulant pour choisir une chaîne
2. **Regarder les vidéos** : Les vidéos se jouent automatiquement l'une après l'autre
3. **Voir les publicités** : Les pubs s'affichent selon l'intervalle configuré
4. **Naviguer dans la playlist** : Cliquez sur une vidéo pour la jouer immédiatement
5. **Accéder à l'admin** : Cliquez sur le bouton ⚙️ Admin

### Panneau Admin (admin.html)

#### Ajouter une chaîne
1. Entrez le nom de la chaîne (ex: "France 2")
2. Entrez une description (ex: "Chaîne généraliste")
3. Cliquez sur "➕ Ajouter Chaîne"

#### Ajouter une vidéo
1. Sélectionnez une chaîne dans le menu
2. Entrez le titre de la vidéo
3. Sélectionnez un fichier MP4
4. Entrez la durée en secondes
5. Cliquez sur "➕ Ajouter Vidéo"

#### Ajouter une publicité
1. Entrez le titre de la pub
2. Sélectionnez un fichier MP4
3. Entrez la durée en secondes
4. Cliquez sur "➕ Ajouter Pub"

#### Configurer l'intervalle des pubs
1. Modifiez le nombre "Intervalle entre les pubs"
2. Cliquez sur "💾 Sauvegarder Configuration"

#### Exporter/Sauvegarder les données
- **Exporter** : Télécharge les données en JSON
- **Réinitialiser** : Supprime toutes les données

## 💾 Stockage des Données

Les données sont stockées en **localStorage** du navigateur :
- ✅ Persistance automatique
- ✅ Pas de serveur nécessaire
- ⚠️ Les données sont locales (par navigateur)

## 🎨 Personnalisation

### Changer les couleurs
Modifiez les variables CSS dans `style.css` et `admin-style.css`

## 🔧 Technologies Utilisées

- **HTML5** : Structure
- **CSS3** : Design moderne et responsive
- **JavaScript ES6+** : Logique et interactivité
- **LocalStorage API** : Persistance des données
- **FileReader API** : Conversion des fichiers

## 📝 License

Free to use - À votre disposition !

---

**Créé avec ❤️ - App TV HTML/CSS/JS**
