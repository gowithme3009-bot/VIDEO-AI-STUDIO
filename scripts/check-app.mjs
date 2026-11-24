import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import vm from "node:vm";

const html = readFileSync("index.html", "utf8");
const app = readFileSync("app.js", "utf8");
const css = readFileSync("styles.css", "utf8");
const readme = readFileSync("README.md", "utf8");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
assert.equal(ids.length, new Set(ids).size, "Les identifiants HTML doivent être uniques.");

for (const id of ["textMode", "imageMode", "imageSection", "prompt", "duration", "generateButton", "notice", "resultSection", "resultVideo", "downloadLink", "progressPanel", "progressBar", "progressTitle", "progressDetail", "progressState"]) {
  assert.ok(ids.includes(id), "Élément HTML manquant : " + id);
  assert.ok(app.includes(' $("' + id + '")') || app.includes('$("' + id + '")'), "Élément non relié dans app.js : " + id);
}

for (const stage of ["connecting", "queued", "generating", "receiving", "done"]) {
  assert.ok(html.includes('data-progress-step="' + stage + '"'), "Étape HTML manquante : " + stage);
  assert.ok(app.includes(stage + ":"), "Étape JavaScript manquante : " + stage);
}

assert.match(app, /const status = event\.status/, "Le statut Gradio doit être lu.");
assert.match(app, /typeof status === "object" \? status\.stage : status/, "Les statuts Gradio chaîne et objet doivent être acceptés.");
assert.match(app, /stage === "complete"/, "Le statut Gradio complete doit être reconnu.");
assert.match(app, /stage === "pending"/, "Le statut Gradio pending doit être reconnu.");
assert.match(app, /stage === "generating"/, "Le statut Gradio generating doit être reconnu.");
assert.match(app, /stage === "error"/, "Le statut Gradio error doit être reconnu.");
assert.match(app, /return event\.data;/, "Le résultat final doit terminer immédiatement la lecture du flux Gradio.");
assert.match(app, /progressState\.textContent = stage === "done"/, "Le libellé d’état doit refléter la fin ou l’arrêt.");
assert.match(app, /option\.disabled = Number\(option\.value\) > 5/, "Les durées supérieures à 5 s doivent être désactivées.");
assert.match(html, /<option value="4">4 secondes<\/option>/, "Une durée courte doit être proposée.");
assert.match(html, /<option value="5">5 secondes<\/option>/, "La durée maximale de 5 s doit être proposée.");
assert.match(app, /mastaP\/wan22-remix-sfw-t2v/, "Le moteur T2V de test doit être configuré.");
assert.match(app, /zerogpu-aoti\/wan2-2-fp8da-aoti-faster/, "Le moteur I2V d'origine doit être conservé.");
assert.match(app, /inputs = \[text, "", seconds, 8, 1, 42, true\]/, "Les 7 entrées T2V doivent suivre l'API du Space Remix.");
assert.match(app, /inputs = \[image, text, 6, "", seconds, 1, 1, 42, true\]/, "Les 9 entrées I2V doivent suivre l'ordre des composants Gradio.");
assert.match(app, /item\.url[\s\S]*item\.path/, "La récupération vidéo doit accepter une URL ou un chemin retourné.");
assert.match(css, /@keyframes progress-pulse/, "Animation de progression absente.");
assert.match(html, /La barre indique une activité, pas un temps restant/, "La progression ne doit pas afficher un faux temps restant.");
assert.match(readme, /Dans les deux modes, les choix supérieurs à 5 secondes sont désactivés/, "Limites de durée non documentées.");

new vm.Script(app.replace(/^import\s+.*;\s*/m, ""), { filename: "app.js" });
console.log("OK — contrôles structurels et contrats API VIDEO AI STUDIO réussis.");
