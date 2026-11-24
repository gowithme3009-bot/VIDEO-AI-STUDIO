import { Client, handle_file } from "https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js";

(() => {
  "use strict";

  const SPACE_I2V = "zerogpu-aoti/wan2-2-fp8da-aoti-faster";
  const SPACE_T2V = "mastaP/wan22-remix-sfw-t2v";
  const $ = (id) => document.getElementById(id);

  const textMode = $("textMode"), imageMode = $("imageMode");
  const imageSection = $("imageSection"), prompt = $("prompt");
  const counter = $("counter"), imageInput = $("imageInput");
  const imagePreview = $("imagePreview"), uploadMessage = $("uploadMessage");
  const removeImage = $("removeImage"), duration = $("duration");
  const durationHelp = duration.closest(".field").querySelector(".field-help");
  const defaultDurationHelp = durationHelp.textContent;
  const generateButton = $("generateButton"), notice = $("notice");
  const resultSection = $("resultSection"), resultVideo = $("resultVideo");
  const downloadLink = $("downloadLink");
  const progressPanel = $("progressPanel"), progressBar = $("progressBar");
  const progressTitle = $("progressTitle"), progressDetail = $("progressDetail");
  const progressSteps = Array.from(document.querySelectorAll("[data-progress-step]"));

  let mode = "text", selectedImage = null, imageObjectUrl = null, generating = false;

  const progressLabels = {
    connecting: ["Connexion au moteur IA", "Contact du service Hugging Face..."],
    queued: ["En attente dans la file", "Le service prépare votre tour. Le délai dépend de la disponibilité."],
    generating: ["Création de votre vidéo", "Le modèle IA travaille. Cette étape peut prendre plusieurs minutes."],
    receiving: ["Récupération du résultat", "La vidéo est prête côté moteur, chargement du fichier..."],
    done: ["Génération terminée", "Votre vidéo est disponible ci-dessous."],
    error: ["Génération interrompue", "Consultez le message d'erreur ci-dessous."]
  };
  const progressOrder = ["connecting", "queued", "generating", "receiving", "done"];

  function setProgress(stage, detail) {
    const index = progressOrder.indexOf(stage);
    const labels = progressLabels[stage] || progressLabels.connecting;
    progressPanel.classList.remove("hidden", "is-error", "is-done");
    progressPanel.classList.toggle("is-error", stage === "error");
    progressPanel.classList.toggle("is-done", stage === "done");
    progressTitle.textContent = labels[0];
    progressDetail.textContent = detail || labels[1];
    progressBar.classList.toggle("is-indeterminate", stage !== "done" && stage !== "error");
    progressBar.style.width = stage === "done" ? "100%" : stage === "error" ? "0%" : "38%";
    progressSteps.forEach((step) => {
      const stepIndex = progressOrder.indexOf(step.dataset.progressStep);
      step.classList.toggle("is-current", stepIndex === index);
      step.classList.toggle("is-complete", index >= 0 && stepIndex < index);
    });
  }

  function showMessage(text, type = "info") {
    notice.textContent = text;
    notice.className = "notice " + type;
  }

  function updateDurationOptions() {
    Array.from(duration.options).forEach((option) => {
      option.disabled = mode === "text" && Number(option.value) > 5;
    });
    if (duration.selectedOptions[0] && duration.selectedOptions[0].disabled) {
      duration.value = "5";
    }
    durationHelp.textContent = mode === "text"
      ? "Le moteur texte vers vidéo accepte des clips de 1 à 5 secondes."
      : defaultDurationHelp;
  }

  function setMode(nextMode) {
    mode = nextMode;
    textMode.classList.toggle("active", mode === "text");
    imageMode.classList.toggle("active", mode === "image");
    textMode.setAttribute("aria-pressed", String(mode === "text"));
    imageMode.setAttribute("aria-pressed", String(mode === "image"));
    imageSection.classList.toggle("hidden", mode !== "image");
    updateDurationOptions();
    showMessage(mode === "text" ? "Mode texte vers vidéo sélectionné." : "Mode image vers vidéo sélectionné.");
  }

  updateDurationOptions();
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
        const status = event.status;
        const stage = event.stage || (status && typeof status === "object" ? status.stage : status);
        if (stage === "pending") {
          const position = event.position ?? (status && status.position);
          const queueInfo = Number.isFinite(position) ? " Position dans la file : " + (position + 1) + "." : "";
          setProgress("queued", "Le service prépare votre tour." + queueInfo);
          showMessage("Demande reçue : attente de votre tour dans la file IA...");
        } else if (stage === "generating") {
          setProgress("generating");
          showMessage("Le modèle IA génère votre vidéo. Cela peut prendre plusieurs minutes...");
        } else if (stage === "complete") {
          setProgress("receiving");
          showMessage("Le moteur a terminé le calcul. Récupération du fichier vidéo...");
        } else if (stage === "error") {
          const message = event.message || (status && status.message) || "Le service IA a signalé une erreur.";
          throw new Error(message);
        } else {
          setProgress("generating", "Le service traite votre demande...");
          showMessage("Traitement par le service IA...");
        }
      } else if (event.type === "data" || event.type === "complete") {
        setProgress("receiving");
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
    setProgress("connecting");
    const seconds = Number(duration.value);

    try {
      showMessage("Connexion à Hugging Face. Le service gratuit peut être momentanément indisponible...");
      setProgress("connecting");
      let client, inputs;
      if (mode === "image") {
        client = await Client.connect(SPACE_I2V, { events: ["status", "data"] });
        const image = await handle_file(selectedImage);
        inputs = [image, text, 6, "", seconds, 1, 1, 42, true];
      } else {
        client = await Client.connect(SPACE_T2V, { events: ["status", "data"] });
        // API mastaP/wan22-remix-sfw-t2v: prompt, negative prompt, seconds, steps, guidance, seed, randomize.
        inputs = [text, "", seconds, 8, 1, 42, true];
      }
      const data = await collectSubmission(client, inputs);
      const videoUrl = extractVideoUrl(data);
      resultVideo.src = videoUrl;
      downloadLink.href = videoUrl;
      resultSection.classList.remove("hidden");
      resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
      setProgress("done");
      showMessage("Le service a retourné une vidéo. Vous pouvez la visionner ou la télécharger.", "success");
    } catch (error) {
      console.error("VIDEO AI STUDIO:", error);
      const detail = error && error.message ? error.message : "Erreur inconnue.";
      setProgress("error", detail);
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
