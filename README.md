# 🎬 VIDEO AI STUDIO

**Atelier expérimental de création vidéo IA — texte vers vidéo et image vers vidéo.**

VIDEO AI STUDIO est une application web statique pensée pour les téléphones Android et les ordinateurs. Elle utilise des espaces publics Hugging Face pour tenter de générer des vidéos à partir d'une description ou d'une image.

## Fonctionnalités

- Génération texte vers vidéo.
- Animation d'une image avec un prompt.
- Choix de durée souhaitée selon les limites du moteur.
- Aperçu vidéo et lien de téléchargement lorsque le moteur retourne un fichier.
- Interface responsive en français.
- Hébergement du site avec GitHub Pages.

## Moteurs IA externes

- **Texte vers vidéo :** [Wan2.2 Remix SFW — Text to Video](https://huggingface.co/spaces/mastaP/wan22-remix-sfw-t2v). Le Space annonce des clips de 1 à 5 secondes, en 832 × 480 à 16 images/seconde. L'application utilise 8 étapes et une guidance de 1.0, conformément aux réglages par défaut annoncés par le Space.
- **Image vers vidéo :** [Wan 2.2 Image-to-Video](https://huggingface.co/spaces/zerogpu-aoti/wan2-2-fp8da-aoti-faster).

Ces espaces sont des services tiers. Leur disponibilité, leurs files d'attente, leurs quotas et leurs conditions peuvent changer sans préavis. Le fonctionnement gratuit et illimité n'est pas garanti.

**Attention aux droits :** le Space texte-vers-vidéo indique que la licence de sa version Remix et les droits de ses poids/sorties ne sont pas établis pour un usage commercial. Réservez les essais à un usage non commercial tant que ces droits ne sont pas clarifiés. Respectez également les règles du Space concernant les personnes réelles identifiables et l'étiquetage des contenus générés par IA.

## Utilisation

1. Ouvrir le site publié avec GitHub Pages.
2. Choisir **Texte vers vidéo** ou **Image vers vidéo**.
3. Rédiger un prompt décrivant le sujet, le mouvement et l'ambiance.
4. En mode image, sélectionner une image PNG, JPG ou WebP de 10 Mo maximum.
5. Choisir une durée disponible et lancer la génération.
6. Patienter pendant la connexion et le traitement par le service externe.
7. Lire ou télécharger la vidéo si une génération aboutit.

En mode **Texte vers vidéo**, les choix supérieurs à 5 secondes sont désactivés, car le Space sélectionné limite les clips à 5 secondes. Les options de durée du mode image restent distinctes.

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

- **Version :** 0.4 — correctif moteur en test sur une branche séparée.
- **Statut :** bêta expérimentale.
- **Publication automatique sur les réseaux :** aucune.
- **Génération vidéo :** dépend des espaces Hugging Face externes et n'est pas encore garantie.

## Licence

Le code de ce dépôt est distribué sous licence MIT. Cette licence ne remplace pas les licences et conditions propres aux modèles Wan, aux poids de fine-tuning, aux espaces Hugging Face ou aux services tiers utilisés.
