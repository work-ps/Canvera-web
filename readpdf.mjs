import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
const doc = await pdfjsLib.getDocument({
  url: "C:/Users/ASUS/Downloads/Canvera Project Files/Product Catalogue Final - Curved_compressed19012026 (1)_compressed.pdf",
  useWorkerFetch: false, isEvalSupported: false, useSystemFonts: true
}).promise;
let allSizes = new Set();
for (let p = 1; p <= doc.numPages; p++) {
  const page = await doc.getPage(p);
  const content = await page.getTextContent();
  const text = content.items.map(i => i.str).join(" ");
  const matches = text.match(/Sizes?\s+available[:\s]+([^.]+?)(?:\s+(?:Box|Bag|Material|Binding|Print|Design|Orientation|Colour|\n))/gi);
  if (matches) {
    matches.forEach(m => {
      const sizes = m.match(/\d+x\d+/gi);
      if (sizes) sizes.forEach(s => allSizes.add(s.toLowerCase()));
    });
  }
  // Also grab any standalone size mentions
  const directSizes = text.match(/\d+x\d+/gi);
  if (directSizes) directSizes.forEach(s => {
    if (["12x18","12x16","12x15","12x12","10x10","14x20","8x10","a4"].includes(s.toLowerCase()))
      allSizes.add(s.toLowerCase());
  });
}
console.log("All unique sizes found:", [...allSizes].sort());
