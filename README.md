# 🎬 VIDEO AI STUDIO

**Atelier expérimental de création vidéo IA — texte vers vidéo et image vers vidéo.**

VIDEO AI STUDIO est une application web statique pensée pour les téléphones Android et les ordinateurs. Elle utilise des espaces publics Hugging Face pour tenter de générer des vidéos à partir d'une description ou d'une image.

## Fonctionnalités

- Génération texte vers vidéo.
- Animation d'une image avec un prompt.
- Choix de durée souhaitée.
- Aperçu vidéo et lien de téléchargement lorsque le moteur retourne un fichier.
- Interface responsive en français.
- Hébergement du site avec GitHub Pages.

## Moteurs IA externes

- **Texte vers vidéo :** [Wan 2.2 Text-to-Video](https://huggingface.co/spaces/zerogpu-aoti/wan2-2-fp8da-aoti)
- **Image vers vidéo :** [Wan 2.2 Image-to-Video](https://huggingface.co/spaces/zerogpu-aoti/wan2-2-fp8da-aoti-faster)

Ces espaces sont des services tiers. Leur disponibilité, leurs files d'attente, leurs quotas et leurs conditions peuvent changer sans préavis. Le fonctionnement gratuit et illimité n'est pas garanti. Si un moteur est indisponible, l'application affiche un message et un lien vers le Space concerné.

## Utilisation

1. Ouvrir le site publié avec GitHub Pages.
2. Choisir **Texte vers vidéo** ou **Image vers vidéo**.
3. Rédiger un prompt décrivant le sujet, le mouvement et l'ambiance.
4. En mode image, sélectionner une image PNG, JPG ou WebP de 10 Mo maximum.
5. Choisir la durée souhaitée et lancer la génération.
6. Patienter pendant la connexion et le traitement par le service externe.
7. Lire ou télécharger la vidéo si une génération aboutit.

## Déploiement GitHub Pages

Le workflow `.github/workflows/pages.yml` déploie le contenu de la branche `main`.

Dans les paramètres du dépôt :

1. Ouvrir **Settings → Pages**.
2. Dans **Build and deployment**, choisir **GitHub Actions** comme source.
3. Fusionner la version validée dans `main` pour déclencher le déploiement, ou lancer le workflow manuellement depuis **Actions**.

URL prévue : https://gowithme3009-bot.github.io/VIDEO-AI-STUDIO/

## Structure

```text
VIDEO-AI-STUDIO/
├── index.html
├── styles.css
├── app.js
├── README.md
├── LICENSE
├── .nojekyll
└── .github/
    └── workflows/
        └── pages.yml
```

## Coût, confidentialité et limites

- Le dépôt public et GitHub Pages peuvent être utilisés sans frais dans les limites de GitHub.
- La génération vidéo est effectuée par des services externes et n'est pas garantie gratuite, illimitée ou toujours disponible.
- Les prompts et images sélectionnés sont transmis au Space Hugging Face choisi.
- Ne soumettez aucune donnée personnelle, confidentielle ou sensible.
- N'ajoutez jamais de mot de passe, clé API ou jeton personnel dans les fichiers publics.

## État du projet

- **Version :** 0.4
- **Statut :** bêta expérimentale
- **Publication automatique sur les réseaux :** aucune
- **Génération vidéo :** dépend des espaces Hugging Face externes.

## Licence

Le code de ce dépôt est distribué sous licence MIT. Cette licence ne remplace pas les licences et conditions propres aux modèles Wan, aux espaces Hugging Face ou aux services tiers utilisés.
