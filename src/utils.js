import anime from 'animejs';

export const createDot = (x, y, r, fill, parentNode) => {
  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttributeNS(null, "cx", x);
  dot.setAttributeNS(null, "cy", y);
  dot.setAttributeNS(null, "r", r);
  dot.setAttributeNS(null, "fill", fill);
  parentNode.appendChild(dot);
};

export const randomCoord = () => {
  const { innerWidth, innerHeight } = window;
  return `${anime.random(0, innerWidth)},${anime.random(0, innerHeight)}`;
};

export const generateBezierPath = (start, end) =>
  `M${start.x},${start.y} Q${randomCoord()} ${end.x},${end.y}`;

export default {
  createDot,
  randomCoord,
  generateBezierPath,
};
