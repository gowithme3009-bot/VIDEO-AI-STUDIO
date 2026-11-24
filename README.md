
# 🎬 VIDEO AI STUDIO

**Atelier gratuit de création vidéo IA — Texte vers vidéo et Image vers vidéo.**

VIDEO AI STUDIO est une application web conçue pour fonctionner sur ordinateur et Android. Elle permet de préparer des prompts et de générer des vidéos à l'aide de modèles IA accessibles via Hugging Face Spaces.

## ✨ Fonctionnalités

- ✍️ Génération vidéo à partir d'un texte.
- 🖼️ Animation d'une image avec un prompt.
- ⏱️ Choix de la durée de la vidéo.
- 👀 Aperçu du résultat.
- 📥 Téléchargement de la vidéo lorsqu'elle est disponible.
- 📱 Interface adaptée aux téléphones Android.
- 🌐 Hébergement possible avec GitHub Pages.

## 🧠 Moteurs IA

Le projet utilise des espaces publics Hugging Face basés sur Wan 2.2 :

- **Texte vers vidéo :** [Wan 2.2 Text-to-Video](https://huggingface.co/spaces/zerogpu-aoti/wan2-2-fp8da-aoti)
- **Image vers vidéo :** [Wan 2.2 Image-to-Video](https://huggingface.co/spaces/zerogpu-aoti/wan2-2-fp8da-aoti-faster)

La disponibilité dépend des serveurs, des files d'attente et des limites d'utilisation de ces services externes.

## 🚀 Installation et utilisation

1. Ouvrir VIDEO AI STUDIO depuis son site GitHub Pages.
2. Choisir Texte vers vidéo ou Image vers vidéo.
3. Écrire une description précise de la scène.
4. Ajouter une image si le mode Image vers vidéo est sélectionné.
5. Choisir la durée.
6. Lancer la génération.
7. Attendre le résultat, puis télécharger la vidéo si elle est disponible.

## 🌍 Hébergement GitHub Pages

Le projet peut être hébergé gratuitement avec GitHub Pages.

Dans le dépôt :

1. Ouvrir **Settings**.
2. Sélectionner **Pages**.
3. Choisir **GitHub Actions** comme source.
4. Attendre la fin du déploiement.

Adresse prévue du site :

https://gowithme3009-bot.github.io/VIDEO-AI-STUDIO/

## 📁 Structure du projet

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

## 💰 Coût et limites

- Le code du projet peut être hébergé gratuitement sur GitHub.
- GitHub Pages propose un hébergement statique gratuit dans les limites de son offre.
- Les générations vidéo utilisent des services externes qui peuvent appliquer des quotas, des temps d'attente ou des restrictions.
- La génération illimitée et gratuite n'est pas garantie.
- Aucun paiement ni clé API personnelle ne doit être nécessaire pour le fonctionnement prévu de cette version.

## 🔐 Sécurité

Ne jamais placer de mot de passe, clé API ou jeton personnel dans les fichiers publics du dépôt.

## 📌 État du projet

**Version :** 0.3  
**Statut :** Bêta expérimentale  
**Publication automatique :** Non  
**Génération vidéo :** Dépend des espaces Hugging Face disponibles.

---

Créé pour expérimenter la génération vidéo IA avec des outils accessibles et des technologies open source.
