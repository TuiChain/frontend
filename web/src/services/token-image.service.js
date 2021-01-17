import jazzicon from "@metamask/jazzicon";
import Constants from "../constants";

/**
 * Function that generates a unique token image for a token address
 *
 * @param { String } tokenAddress String which represents the address of the token
 *
 * @returns SVG string which represents the image
 */
function generateTokenImage(tokenAddress) {
  let svgDiameter = 100;
  let capSize = 80;

  let capBase64 = Constants.logo_png;
  let identicon = jazzicon(svgDiameter, tokenAddress);
  let svg = identicon.childNodes[0];

  let background = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "rect"
  );
  background.setAttribute("width", svgDiameter);
  background.setAttribute("height", svgDiameter);
  background.setAttribute("fill", identicon.style.background);

  let cap = document.createElementNS("http://www.w3.org/2000/svg", "image");
  cap.setAttribute("href", capBase64);
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
  generateTokenImage,
};
