import { Client, handle_file } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

(() => {
  "use strict";

  const SPACE_I2V = "zerogpu-aoti/wan2-2-fp8da-aoti-faster";
  const SPACE_T2V = "zerogpu-aoti/wan2-2-fp8da-aoti";
  const $ = (id) => document.getElementById(id);

  const textMode = $("textMode"), imageMode = $("imageMode");
  const imageSection = $("imageSection"), prompt = $("prompt");
  const counter = $("counter"), imageInput = $("imageInput");
  const imagePreview = $("imagePreview"), uploadMessage = $("uploadMessage");
  const removeImage = $("removeImage"), duration = $("duration");
  const generateButton = $("generateButton"), notice = $("notice");
  const resultSection = $("resultSection"), resultVideo = $("resultVideo");
  const downloadLink = $("downloadLink");

  let mode = "text", selectedImage = null, imageObjectUrl = null, generating = false;

  function showMessage(text, type = "info") {
    notice.textContent = text;
    notice.className = "notice " + type;
  }

  function setMode(nextMode) {
    mode = nextMode;
    textMode.classList.toggle("active", mode === "text");
    imageMode.classList.toggle("active", mode === "image");
    textMode.setAttribute("aria-pressed", String(mode === "text"));
    imageMode.setAttribute("aria-pressed", String(mode === "image"));
    imageSection.classList.toggle("hidden", mode !== "image");
    showMessage(mode === "text" ? "Mode texte vers vidéo sélectionné." : "Mode image vers vidéo sélectionné.");
  }

  textMode.addEventListener("click", () => setMode("text"));
  imageMode.addEventListener("click", () => setMode("image"));
  prompt.addEventListener("input", () => { counter.textContent = prompt.value.length + "/1500"; });

  function clearImage() {
    selectedImage = null;
    imageInput.value = "";
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    imageObjectUrl = null;
    imagePreview.removeAttribute("src");
    imagePreview.classList.add("hidden");
    uploadMessage.classList.remove("hidden");
    removeImage.classList.add("hidden");
  }

  imageInput.addEventListener("change", () => {
    const file = imageInput.files && imageInput.files[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      clearImage(); showMessage("Format non accepté. Utilisez PNG, JPG ou WebP.", "error"); return;
    }
    if (file.size > 10 * 1024 * 1024) {
      clearImage(); showMessage("Image trop volumineuse. Maximum : 10 Mo.", "error"); return;
    }
    if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl);
    selectedImage = file;
    imageObjectUrl = URL.createObjectURL(file);
    imagePreview.src = imageObjectUrl;
    imagePreview.classList.remove("hidden");
    uploadMessage.classList.add("hidden");
    removeImage.classList.remove("hidden");
    showMessage("Image ajoutée. Vous pouvez lancer la génération.");
  });
  removeImage.addEventListener("click", () => { clearImage(); showMessage("Image supprimée."); });

  function extractVideoUrl(data) {
    const item = Array.isArray(data) ? data[0] : data;
    if (typeof item === "string") return item;
    const url = item && (item.url || (item.video && item.video.url) || item.path || (item.video && item.video.path));
    if (typeof url === "string" && url) return url;
    throw new Error("Le moteur n'a pas retourné de fichier vidéo reconnu.");
  }

  async function collectSubmission(client, inputs) {
    const submission = client.submit("/generate_video", inputs);
    let result = null;
    for await (const event of submission) {
      if (event.type === "status") {
        const stage = event.stage || (event.status && event.status.stage);
        if (stage === "pending") showMessage("Demande en attente dans la file du service IA...");
        else if (stage === "generating") showMessage("Le modèle IA génère votre vidéo. Cela peut prendre plusieurs minutes...");
        else if (stage === "error") throw new Error(event.message || "Le service IA a signalé une erreur.");
        else showMessage("Traitement par le service IA...");
      } else if (event.type === "data" || event.type === "complete") {
        result = event.data;
      } else if (event.type === "error") {
        throw new Error(event.message || "Le service IA a rencontré une erreur.");
      }
    }
    if (!result) throw new Error("Aucun résultat reçu du service IA.");
    return result;
  }

  async function generate() {
    const text = prompt.value.trim();
    if (!text) { showMessage("Veuillez écrire une description de votre vidéo.", "error"); prompt.focus(); return; }
    if (mode === "image" && !selectedImage) { showMessage("Ajoutez une image avant de continuer.", "error"); return; }

    generating = true;
    generateButton.disabled = true;
    generateButton.textContent = "Connexion au moteur IA...";
    resultSection.classList.add("hidden");
    resultVideo.removeAttribute("src");
    const seconds = Number(duration.value);

    try {
      showMessage("Connexion à Hugging Face. Le service gratuit peut être momentanément indisponible...");
      let client, inputs;
      if (mode === "image") {
        client = await Client.connect(SPACE_I2V, { events: ["status", "data"] });
        const image = await handle_file(selectedImage);
        inputs = [image, text, 6, "", seconds, 1, 1, 42, true];
      } else {
        client = await Client.connect(SPACE_T2V, { events: ["status", "data"] });
        inputs = [text, "", seconds, 1, 3, 4, 42, true];
      }
      const data = await collectSubmission(client, inputs);
      const videoUrl = extractVideoUrl(data);
      resultVideo.src = videoUrl;
      downloadLink.href = videoUrl;
      resultSection.classList.remove("hidden");
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
      showMessage("Le service a retourné une vidéo. Vous pouvez la visionner ou la télécharger.", "success");
    } catch (error) {
      console.error("VIDEO AI STUDIO:", error);
      const detail = error && error.message ? error.message : "Erreur inconnue.";
      showMessage("Génération impossible : " + detail + " Réessayez plus tard ou ouvrez directement le Space Hugging Face.", "error");
      const space = mode === "image" ? SPACE_I2V : SPACE_T2V;
      const link = document.createElement("a");
      link.href = "https://huggingface.co/spaces/" + space;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = " Ouvrir le moteur sur Hugging Face";
      notice.appendChild(link);
    } finally {
      generating = false;
      generateButton.disabled = false;
      generateButton.innerHTML = "<span>✦</span> Générer ma vidéo";
    }
  }

  generateButton.addEventListener("click", generate);
  window.addEventListener("beforeunload", () => { if (imageObjectUrl) URL.revokeObjectURL(imageObjectUrl); });
  console.log("VIDEO AI STUDIO V0.4 prêt.");
})();
