# VIDEO AI STUDIO

Interface web mobile-first pour préparer des créations **texte vers vidéo** et **image vers vidéo**.

## État actuel — V0.1

Cette version contient :
- une interface française responsive, adaptée aux téléphones ;
- une zone de prompt avec compteur ;
- l'import local d'une image PNG/JPG/WebP (10 Mo max) et son aperçu ;
- le choix du format 9:16, 16:9 ou 1:1 ;
- le choix d'une durée cible de 5, 10 ou 15 secondes ;
- un message explicite lorsque le moteur vidéo n'est pas connecté.

**Important : cette version ne génère pas encore de vidéo.** Le bouton prépare et valide les paramètres, mais n'appelle aucun moteur IA. Une connexion à un fournisseur d'inférence vidéo compatible sera ajoutée après vérification de ses conditions, quotas, accès depuis Madagascar et exigences éventuelles de clé API.

## Lancer l'application

Aucun outil de compilation n'est nécessaire :
1. Ouvrir `index.html` dans un navigateur, ou publier le dépôt avec GitHub Pages.
2. Pour GitHub Pages : Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.

## Structure

```text
VIDEO-AI-STUDIO/
├── index.html
├── styles.css
├── app.js
├── README.md
└── .github/
    └── workflows/
        └── pages.yml
```

## Prochaine étape technique

Créer une couche serveur/proxy ou une intégration sécurisée vers un fournisseur vidéo. Ne jamais placer une clé API secrète dans `app.js`, dans le HTML, dans GitHub Pages ou dans un dépôt public.

## Modèles et licences

Ce dépôt est une interface originale. Les modèles tels que Wan, LTX-Video ou les outils ComfyUI restent des projets tiers, avec leurs propres licences, conditions d'utilisation, besoins matériels et règles d'accès. Vérifier la licence et les conditions de chaque modèle avant toute intégration.

## Licence de cette interface

MIT — voir `LICENSE`.
