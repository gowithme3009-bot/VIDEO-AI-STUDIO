
import { Client, handle_file } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

(() => {
  "use strict";

  const SPACE_I2V = "zerogpu-aoti/wan2-2-fp8da-aoti-faster";
  const SPACE_T2V = "zerogpu-aoti/wan2-2-fp8da-aoti";

  const textMode = document.getElementById("textMode");
  const imageMode = document.getElementById("imageMode");
  const imageSection = document.getElementById("imageSection");
  const prompt = document.getElementById("prompt");
  const counter = document.getElementById("counter");
  const imageInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");
  const uploadMessage = document.getElementById("uploadMessage");
  const removeImage = document.getElementById("removeImage");
  const duration = document.getElementById("duration");
  const generateButton = document.getElementById("generateButton");
  const notice = document.getElementById("notice");
  const resultSection = document.getElementById("resultSection");
  const resultVideo = document.getElementById("resultVideo");
  const downloadLink = document.getElementById("downloadLink");

  let currentMode = "text";
  let selectedImage = null;
  let imageObjectUrl = null;
  let isGenerating = false;

  function message(text, type = "info") {
    notice.textContent = text;
    notice.className = `notice ${type}`;
  }

  function setMode(mode) {
    currentMode = mode;

    textMode.classList.toggle("active", mode === "text");
    imageMode.classList.toggle("active", mode === "image");

    imageSection.classList.toggle("hidden", mode !== "image");

    message(
      mode === "text"
        ? "Mode texte vers vidéo sélectionné."
        : "Mode image vers vidéo sélectionné."
    );
  }

  textMode.addEventListener("click", () => setMode("text"));
  imageMode.addEventListener("click", () => setMode("image"));

  prompt.addEventListener("input", () => {
    counter.textContent = `${prompt.value.length}/1500`;
  });

  imageInput.addEventListener("change", () => {
    const file = imageInput.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
      message("Format non accepté. Utilisez PNG, JPG ou WebP.", "error");
      imageInput.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      message("Image trop volumineuse. Maximum : 10 Mo.", "error");
      imageInput.value = "";
      return;
    }

    selectedImage = file;

    if (imageObjectUrl) {
      URL.revokeObjectURL(imageObjectUrl);
    }

    imageObjectUrl = URL.createObjectURL(file);
    imagePreview.src = imageObjectUrl;

    imagePreview.classList.remove("hidden");
    uploadMessage.classList.add("hidden");
    removeImage.classList.remove("hidden");

    message("Image ajoutée avec succès.");
  });

  removeImage.addEventListener("click", () => {
    selectedImage = null;
    imageInput.value = "";

    if (imageObjectUrl) {
      URL.revokeObjectURL(imageObjectUrl);
      imageObjectUrl = null;
    }

    imagePreview.removeAttribute("src");
    imagePreview.classList.add("hidden");
    uploadMessage.classList.remove("hidden");
    removeImage.classList.add("hidden");

    message("Image supprimée.");
  });

  function extractVideoUrl(data) {
    if (!Array.isArray(data) || !data.length) {
      throw new Error("Le moteur n'a retourné aucun résultat.");
    }

    const video = data[0];

    if (typeof video === "string") {
      return video;
    }

    if (video?.url) {
      return video.url;
    }

    if (video?.video?.url) {
      return video.video.url;
    }

    if (video?.path) {
      return video.path;
    }

    throw new Error("Format vidéo retourné non reconnu.");
  }

  async function generateTextVideo(text, seconds) {
    const client = await Client.connect(SPACE_T2V);

    const inputs = [
      text,
      "",
      seconds,
      1,
      3,
      4,
      42,
      true
    ];

    return await submitAndCollect(client, inputs);
  }

  async function generateImageVideo(file, text, seconds) {
    const client = await Client.connect(SPACE_I2V);

    const image = await handle_file(file);

    const inputs = [
      image,
      text,
      6,
      "",
      seconds,
      1,
      1,
      42,
      true
    ];

    return await submitAndCollect(client, inputs);
  }

  async function submitAndCollect(client, inputs) {
    const submission = client.submit("/generate_video", inputs);

    let finalData = null;

    for await (const event of submission) {
      if (event.type === "status") {
        const status = event.stage;

        if (status === "pending") {
          message("Votre demande est dans la file d'attente...");
        } else if (status === "generating") {
          message("Le modèle IA génère votre vidéo. Patientez...");
        } else {
          message("Traitement de votre demande...");
        }
      }

      if (event.type === "complete") {
        finalData = event.data;
      }

      if (event.type === "error") {
        throw new Error(
          event.message || "Le moteur vidéo a rencontré une erreur."
        );
      }
    }

    if (!finalData) {
      throw new Error("La génération n'a pas retourné de vidéo.");
    }

    return finalData;
  }

  function displayVideo(url) {
    resultVideo.src = url;
    downloadLink.href = url;

    resultSection.classList.remove("hidden");

    resultSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    message("Vidéo générée ! Vous pouvez la visionner.", "success");
  }

  generateButton.addEventListener("click", async () => {
    if (isGenerating) return;

    const text = prompt.value.trim();

    if (!text) {
      message("Veuillez écrire une description de votre vidéo.", "error");
      prompt.focus();
      return;
    }

    if (currentMode === "image" && !selectedImage) {
      message("Ajoutez une image avant de continuer.", "error");
      return;
    }

    isGenerating = true;
    generateButton.disabled = true;
    generateButton.textContent = "Génération en cours...";
    resultSection.classList.add("hidden");

    const seconds = Number(duration.value);

    try {
      message("Connexion au moteur vidéo Hugging Face...");

      let data;

      if (currentMode === "image") {
        data = await generateImageVideo(
          selectedImage,
          text,
          seconds
        );
      } else {
        data = await generateTextVideo(text, seconds);
      }

      const videoUrl = extractVideoUrl(data);
      displayVideo(videoUrl);

    } catch (error) {
      console.error("VIDEO AI STUDIO:", error);

      const detail = error?.message || "Erreur inconnue.";

      message(
        "La génération a échoué : " + detail +
        " Vous pouvez réessayer ou vérifier la disponibilité du moteur.",
        "error"
      );

    } finally {
      isGenerating = false;
      generateButton.disabled = false;
      generateButton.innerHTML = "<span>✦</span> Générer ma vidéo";
    }
  });

  window.addEventListener("beforeunload", () => {
    if (imageObjectUrl) {
      URL.revokeObjectURL(imageObjectUrl);
    }
  });

  console.log("VIDEO AI STUDIO V0.3 initialisé.");
})();
  
