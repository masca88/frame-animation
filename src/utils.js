export const createDot = (x, y, r, fill, parentNode) => {
  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttributeNS(null, "cx", x);
  dot.setAttributeNS(null, "cy", y);
  dot.setAttributeNS(null, "r", r);
  dot.setAttributeNS(null, "fill", fill);

  parentNode.appendChild(dot);
};

export default {
  createDot
};
