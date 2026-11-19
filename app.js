const translations = siteContent.translations;
const demoOverlay = document.querySelector("#demo-overlay");
const flowButton = document.querySelector("#flow-toggle");
const vectorLegend = document.querySelector("#vector-legend");
const demoStatus = document.querySelector("#demo-status");
const demoReadings = document.querySelector("#demo-readings");
const linePicker = document.querySelector(".line-picker");
const languageButtons = document.querySelectorAll("[data-language]");
const svgNamespace = "http://www.w3.org/2000/svg";

// Illustrative speeds in m/s. The same values set the arrow lengths and labels.
const arrowStarts = [169, 286, 403, 520, 637, 754];
const arrowLengthPerMeterPerSecond = 84;
const referenceLines = [
  { y: 106, speeds: [0.38, 0.46, 0.51, 0.47, 0.43, 0.49] },
  { y: 198, speeds: [0.45, 0.61, 0.67, 0.58, 0.51, 0.57] },
  { y: 290, speeds: [0.69, 0.76, 0.86, 0.80, 0.68, 0.77] },
  { y: 382, speeds: [0.44, 0.57, 0.63, 0.55, 0.46, 0.51] },
  { y: 474, speeds: [0.35, 0.41, 0.48, 0.44, 0.38, 0.43] },
];
const singleReferenceLine = [referenceLines[2]];

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

function drawFlow(overlay, lines, showVectors, showLabels = false) {
  const drawing = document.createDocumentFragment();

  for (const { y, speeds } of lines) {
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
      const vectors = svgElement("g", { class: "flow-readings" });
      arrowStarts.forEach((start, index) => {
        const speed = speeds[index];
        const tip = start + speed * arrowLengthPerMeterPerSecond;
        const reading = svgElement("g", { class: "flow-reading" });
        reading.append(svgElement("path", {
          class: "velocity-vectors",
          d: `M${start} ${arrowY} H${tip} M${tip - 11} ${arrowY - 8} L${tip} ${arrowY} L${tip - 11} ${arrowY + 8}`,
        }));
        if (showLabels) {
          const label = svgElement("text", {
            class: "velocity-label",
            x: (start + tip) / 2,
            y: arrowY - 27,
            "text-anchor": "middle",
            "dominant-baseline": "central",
          });
          label.textContent = `${speed.toFixed(2)} m/s`;
          reading.append(label);
        }
        vectors.append(reading);
      });
      drawing.append(vectors);
    }
  }

  overlay.replaceChildren(drawing);
}

function updateDemo(announce) {
  const lines = lineCount === 1 ? singleReferenceLine : referenceLines;
  const copy = translations[activeLanguage];
  drawFlow(demoOverlay, lines, flowVisible, true);
  flowButton.textContent = copy[flowVisible ? "hideFlow" : "showFlow"];
  vectorLegend.hidden = !flowVisible;
  demoReadings.hidden = !flowVisible;
  demoReadings.textContent = flowVisible
    ? lines.map(({ speeds }, index) => {
      const values = speeds.map((speed) => speed.toFixed(2)).join(", ");
      return `${copy.readingLine} ${index + 1}. ${values} m/s.`;
    }).join(" ")
    : "";
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
drawFlow(document.querySelector(".story-overlay"), singleReferenceLine, true, true);
drawFlow(document.querySelector(".hero-overlay"), referenceLines, true);
drawFlow(document.querySelector(".closing-overlay"), referenceLines, true);
setLanguage(activeLanguage);

const openingStory = document.querySelector(".opening-story");
const galleryOpening = document.querySelector(".gallery-opening");
const storyMeasurement = document.querySelector(".story-measurement");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let storyFrame = 0;

function revealProgress(element, start, end) {
  const viewportHeight = window.innerHeight;
  const top = element.getBoundingClientRect().top;
  return Math.max(0, Math.min(1, (viewportHeight * start - top) / (viewportHeight * (start - end))));
}

function updateStoryMotion() {
  storyFrame = 0;
  openingStory.style.setProperty("--opening-progress", revealProgress(galleryOpening, 0.96, 0.22));
  storyMeasurement.style.setProperty("--measurement-progress", revealProgress(storyMeasurement, 0.9, 0.52));
}

function queueStoryMotion() {
  if (!reducedMotion.matches && !storyFrame) {
    storyFrame = window.requestAnimationFrame(updateStoryMotion);
  }
}

function setStoryMotion() {
  openingStory.classList.toggle("has-opening-motion", !reducedMotion.matches);
  if (reducedMotion.matches) {
    window.cancelAnimationFrame(storyFrame);
    storyFrame = 0;
    storyMeasurement.style.removeProperty("--measurement-progress");
  } else {
    updateStoryMotion();
  }
}

setStoryMotion();
window.addEventListener("scroll", queueStoryMotion, { passive: true });
window.addEventListener("resize", queueStoryMotion);
reducedMotion.addEventListener("change", setStoryMotion);

for (const button of languageButtons) {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.language);
    queueStoryMotion();
  });
}

linePicker.addEventListener("change", (event) => {
  lineCount = Number(event.target.value);
  updateDemo(true);
});

flowButton.addEventListener("click", () => {
  flowVisible = !flowVisible;
  updateDemo(true);
});
