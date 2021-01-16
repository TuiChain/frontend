import jazzicon from "jazzicon";
import fs from "fs";

function generateTokenImage(tokenAddress) {
  const svgDiameter = 100;
  const capSize = 80;

  const capBase64 = fs.readFileSync('../assets/logo.png', 'base64');
  let identicon = jazzicon(svgDiameter, tokenAddress);
  let svg = identicon.childNodes[0];

  let background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("width", svgDiameter);
  background.setAttribute("height", svgDiameter);
  background.setAttribute("fill", identicon.style.background);

  let cap = document.createElementNS("http://www.w3.org/2000/svg", "image");
  cap.setAttribute("href", "data:image/png;base64," + capBase64);
  cap.setAttribute("x", (svgDiameter - capSize) / 2);
  cap.setAttribute("y", (svgDiameter - capSize) / 2);
  cap.setAttribute("width", capSize);
  cap.setAttribute("height", capSize);
  cap.setAttribute("preserveAspectRatio", "xMidYMid meet");
  svg.prepend(background);
  svg.append(cap);
  let svgString = new XMLSerializer().serializeToString(svg);
  return "data:image/svg+xml;base64," + btoa(svgString);
}

export default {
  generateTokenImage
}
