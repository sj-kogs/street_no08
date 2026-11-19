const translations = siteContent.translations;
const demoOverlay = document.querySelector("#demo-overlay");
const flowButton = document.querySelector("#flow-toggle");
const vectorLegend = document.querySelector("#vector-legend");
const demoStatus = document.querySelector("#demo-status");
const linePicker = document.querySelector(".line-picker");
const languageButtons = document.querySelectorAll("[data-language]");
const svgNamespace = "http://www.w3.org/2000/svg";

// Preset artwork in SVG coordinates. These lengths are decorative.
const arrowStarts = [169, 286, 403, 520, 637, 754];
const referenceLines = [
  { y: 178, arrowLengths: [38, 51, 56, 49, 43, 48] },
  { y: 290, arrowLengths: [58, 64, 72, 67, 57, 65] },
  { y: 403, arrowLengths: [37, 48, 53, 46, 39, 43] },
];

let activeLanguage = "en";
let lineCount = 1;
let flowVisible = false;

function svgElement(tag, attributes) {
  const element = document.createElementNS(svgNamespace, tag);
  for (const [name, value] of Object.entries(attributes)) {
    element.setAttribute(name, value);
  }
  return element;
}

function drawFlow(overlay, lines, showVectors) {
  const drawing = document.createDocumentFragment();

  for (const { y, arrowLengths } of lines) {
    drawing.append(svgElement("path", {
      class: "reference-line",
      d: `M128 ${y} H872`,
    }));
    for (const x of [128, 872]) {
      drawing.append(svgElement("circle", {
        class: "reference-point",
        cx: x,
        cy: y,
        r: 5,
      }));
    }
    if (showVectors) {
      const arrowY = y - 17;
      const arrowPaths = arrowStarts.map((start, index) => {
        const tip = start + arrowLengths[index];
        return `M${start} ${arrowY} H${tip} M${tip - 11} ${arrowY - 8} L${tip} ${arrowY} L${tip - 11} ${arrowY + 8}`;
      });
      drawing.append(svgElement("path", {
        class: "velocity-vectors",
        d: arrowPaths.join(" "),
      }));
    }
  }

  overlay.replaceChildren(drawing);
}

function updateDemo(announce) {
  const lines = lineCount === 1 ? [referenceLines[1]] : referenceLines;
  const copy = translations[activeLanguage];
  drawFlow(demoOverlay, lines, flowVisible);
  flowButton.textContent = copy[flowVisible ? "hideFlow" : "showFlow"];
  vectorLegend.hidden = !flowVisible;
  if (announce) {
    demoStatus.textContent = copy.status[lineCount][Number(flowVisible)];
  }
}

function setLanguage(language) {
  activeLanguage = language;
  const copy = translations[language];
  document.documentElement.lang = language;
  document.title = copy.title;
  document.querySelector('meta[name="description"]').content = copy.description;

  for (const element of document.querySelectorAll("[data-copy]")) {
    element.textContent = copy[element.dataset.copy];
  }
  for (const element of document.querySelectorAll("[data-label]")) {
    element.setAttribute("aria-label", copy[element.dataset.label]);
  }
  for (const image of document.querySelectorAll("[data-alt]")) {
    image.alt = copy[image.dataset.alt];
  }
  for (const button of languageButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  }

  demoStatus.textContent = "";
  updateDemo(false);
}

for (const image of document.querySelectorAll("[data-image]")) {
  const source = siteContent.images[image.dataset.image];
  if (image.getAttribute("src") !== source) {
    image.src = source;
  }
}

document.querySelector("#closing-cta").href = siteContent.closingUrl;
drawFlow(document.querySelector(".hero-overlay"), referenceLines, true);
drawFlow(document.querySelector(".closing-overlay"), referenceLines, true);
setLanguage(activeLanguage);

for (const button of languageButtons) {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
}

linePicker.addEventListener("change", (event) => {
  lineCount = Number(event.target.value);
  updateDemo(true);
});

flowButton.addEventListener("click", () => {
  flowVisible = !flowVisible;
  updateDemo(true);
});
