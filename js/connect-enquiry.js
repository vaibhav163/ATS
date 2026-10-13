// Usage:
//   node connect-enquiry.js .            (preview only, changes nothing)
//   node connect-enquiry.js . --write    (applies the changes)
const fs = require("fs");
const path = require("path");

const root = path.resolve(process.argv[2] || ".");
const write = process.argv.includes("--write");
const jsFile = path.join(root, "js", "enquiry.js");

if (!fs.existsSync(jsFile)) {
  console.error("Cannot find " + jsFile + "\nPut enquiry.js inside the js folder first.");
  process.exit(1);
}

const SKIP_DIRS = new Set(["_external", "node_modules", ".git", "js", "css", "images"]);

// The three old blocks every page has
const CUTS = [
  ["old modal CSS",
    /<style type="text\/css">\s*#myModal \.iosBugFixCaret[\s\S]*?<\/style>\s*/],
  ["old modal + captcha scripts",
    /<div id="myModal"[\s\S]*?window\.onload\s*=\s*function\s*\(\)\s*\{\s*Captchacode\(\);\s*\}\s*;?\s*<\/script>\s*/],
  ["old WhatsApp button",
    /<!-- Floating WhatsApp Button -->[\s\S]*?whatsappButton\.href\s*=\s*whatsappURL;\s*\}\s*\}\);\s*<\/script>\s*/]
];

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), out);
    } else if (e.name.toLowerCase().endsWith(".html")) {
      out.push(path.join(dir, e.name));
    }
  }
  return out;
}

let changed = 0, skipped = 0;

for (const file of walk(root, [])) {
  const rel = path.relative(root, file);
  let html = fs.readFileSync(file, "utf8");

  if (!html.includes("</body>")) continue;

  if (/enquiry\.js|SITE_CFG|enquiryForm/.test(html)) {
    console.log("SKIP (already converted or edited by hand): " + rel);
    skipped++;
    continue;
  }
  if (!html.includes('id="myModal"')) {
    console.log("SKIP (no old modal found): " + rel);
    skipped++;
    continue;
  }

  const missing = [];
  for (const [name, re] of CUTS) {
    if (re.test(html)) html = html.replace(re, "");
    else missing.push(name);
  }
  if (missing.length) {
    console.log("SKIP (did not match: " + missing.join(", ") + "): " + rel);
    skipped++;
    continue;
  }

  const src = path.relative(path.dirname(file), jsFile).split(path.sep).join("/");
  const tag = '<script src="' + src + '"></script>\n';
  const i = html.lastIndexOf("</body>");
  html = html.slice(0, i) + tag + html.slice(i);

  console.log((write ? "UPDATED: " : "WOULD UPDATE: ") + rel + "  ->  " + src);
  if (write) fs.writeFileSync(file, html, "utf8");
  changed++;
}

console.log("\n" + changed + " page(s) " + (write ? "updated" : "ready to update") + ", " + skipped + " skipped.");
if (!write) console.log("Run again with --write to apply.");