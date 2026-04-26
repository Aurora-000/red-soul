import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const portalDataPath = path.join(projectRoot, "js", "portal-data.js");
const outputDir = path.join(projectRoot, "assets", "posters");

const hashPosterContent = (value = "") => {
    let hash = 2166136261;

    for (let index = 0; index < value.length; index += 1) {
        hash ^= value.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16).padStart(8, "0");
};

const collectSvgImages = (value, bucket) => {
    if (typeof value === "string" && value.startsWith("data:image/svg+xml;charset=UTF-8,")) {
        bucket.add(value);
        return;
    }

    if (Array.isArray(value)) {
        value.forEach((item) => collectSvgImages(item, bucket));
        return;
    }

    if (value && typeof value === "object") {
        Object.values(value).forEach((item) => collectSvgImages(item, bucket));
    }
};

const source = fs.readFileSync(portalDataPath, "utf8");
const sandbox = {
    window: { __POSTER_BUILD_MODE__: "inline" },
    console,
    encodeURIComponent
};

vm.runInNewContext(source, sandbox, { filename: portalDataPath });

const posterData = sandbox.window?.PortalData;
if (!posterData) {
    throw new Error("Failed to evaluate portal-data.js and load window.PortalData");
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });

const svgImages = new Set();
collectSvgImages(posterData, svgImages);

for (const dataUri of svgImages) {
    const svg = decodeURIComponent(dataUri.replace("data:image/svg+xml;charset=UTF-8,", ""));
    const fileName = `${hashPosterContent(svg)}.svg`;
    fs.writeFileSync(path.join(outputDir, fileName), `${svg.trim()}\n`, "utf8");
}

console.log(`Generated ${svgImages.size} poster assets in ${outputDir}`);
