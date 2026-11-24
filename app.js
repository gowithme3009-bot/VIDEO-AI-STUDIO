(() => {
  const prompt = document.getElementById("prompt");
  const counter = document.getElementById("counter");
  const input = document.getElementById("imageInput");
  const preview = document.getElementById("imagePreview");
  const remove = document.getElementById("removeImage");
  const zone = document.getElementById("uploadZone");
  const notice = document.getElementById("notice");
  let imageUrl = null;

  prompt.addEventListener("input", () => {
    counter.textContent = `${prompt.value.length} / 1800`;
  });

  input.addEventListener("change", () => {
    const file = input.files && input.files[0];
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      show("Format non accepté. Choisissez une image PNG, JPG ou WebP.");
      input.value = "";
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      show("Image trop volumineuse : la limite de cette version est de 10 Mo.");
      input.value = "";
      return;
    }
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = URL.createObjectURL(file);
    preview.src = imageUrl;
    preview.hidden = false;
    remove.hidden = false;
    zone.querySelector("strong").textContent = file.name;
    show("Image chargée localement. Elle n'a pas été envoyée.");
  });

  remove.addEventListener("click", () => {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    imageUrl = null;
    input.value = "";
    preview.removeAttribute("src");
    preview.hidden = true;
    remove.hidden = true;
    zone.querySelector("strong").textContent = "Choisir une image";
    show("Image retirée.");
  });

  document.getElementById("generateBtn").addEventListener("click", () => {
    const text = prompt.value.trim();
    if (!text) {
      show("Ajoutez d'abord une description de votre vidéo.");
      prompt.focus();
      return;
    }
    const payload = {
      prompt: text,
      imageSelected: Boolean(input.files && input.files[0]),
      aspectRatio: document.getElementById("ratio").value,
      durationSeconds: Number(document.getElementById("duration").value)
    };
    show("Votre projet est prêt. Le moteur de génération n'est pas encore connecté : aucune vidéo n'a été générée ni envoyée. Prochaine étape : configurer un fournisseur distant gratuit compatible.");
    console.info("VIDEO AI STUDIO — paramètres préparés :", payload);
  });

  function show(message) {
    notice.textContent = message;
    notice.hidden = false;
  }
})();