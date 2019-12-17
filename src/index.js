import anime from "animejs";
import { take } from "lodash";
import "./styles.less";
import ClgAssistant from "./ClgAssitant";
const { innerWidth, innerHeight } = window;

const frameParticlesColors = [
  "#578ad4",
  "#4e92d7",
  "#0eb2e0",
  "#e6ecf9",
  "#7562ca",
  "#6f69cc"
];

const FRAME_DOT_QTY = 150;
const EXPLOSION_DOT_QTY = 400;

const startPoint = {
  x: innerWidth / 2,
  y: 100
};
const endPoint = {
  x: innerWidth - 500,
  y: innerHeight - 300
};

const randomCoord = () => {
  const { innerWidth, innerHeight } = window;
  return `${anime.random(0, innerWidth)},${anime.random(0, innerHeight)}`;
};

const generateBezierPath = (start, end) =>
  `M${start.x},${start.y} Q${randomCoord()} ${end.x},${end.y}`;

const newpath = document.createElementNS(
  document.getElementById("road").namespaceURI,
  "path"
);
newpath.setAttributeNS(null, "id", "road");
newpath.setAttributeNS(null, "d", generateBezierPath(startPoint, endPoint));
document.getElementById("road").appendChild(newpath);

const path = anime.path("#road path");

generateFrameParticles(FRAME_DOT_QTY);
generateDotExplosion(EXPLOSION_DOT_QTY);

anime({
  targets: "#clgFrame circle",
  opacity: [1, 0, 1],
  delay: anime.stagger(200, { grid: [14, 5], from: "center" }),
  duration: 1000,
  loop: true,
  easing: "easeInOutQuad"
});

var animation = anime.timeline({
  targets: "#clgFrame",
  easing: "spring",
  loop: false
});

animation
  .add({
    translateX: startPoint.x,
    translateY: startPoint.y
  })
  .add({
    rotate: 30
  })
  .add({
    rotate: -30
  })
  .add({
    targets: ".fake #clgFrame",
    filter: ["grayscale(0)", "grayscale(1)"]
  })
  .add(
    {
      targets: "#explosion circle",
      r: [0, () => anime.random(1, 8)],
      delay: anime.stagger(40, { grid: [14, 5], from: "center" }),
      duration: 100,
      easing: "linear"
    },
    "-=500"
  )
  .add(
    {
      targets: take(document.querySelectorAll("#explosion circle"), 10),
      r: innerWidth > innerHeight ? innerWidth : innerHeight,
      delay: anime.stagger(300, { grid: [14, 5], from: "center" }),
      duration: 450,
      easing: "easeInCirc"
    },
    "-=1000"
  )
  // .add(
  //   {
  //     targets: "#bgExplosion",
  //     clipPath: ["circle(0% at center)", "circle(100% at center)"],
  //     direction: "alternate",
  //     easing: "linear",
  //     duration: 300
  //   },
  //   "-=1500"
  // )
  .add(
    {
      targets: ".fake .cls-1",
      fill: "#fff"
    },
    "-=1600"
  )
  .add(
    {
      targets: "#clgFrame",
      translateX: path("x"),
      translateY: path("y"),
      scale: 0.6,
      rotate: 180,
      easing: "linear",
      duration: 1500
    },
    "-=500"
  )
  .add({
    rotate: 720
  });

function createDot(x, y, r, fill, parentNode) {
  const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  dot.setAttributeNS(null, "cx", x);
  dot.setAttributeNS(null, "cy", y);
  dot.setAttributeNS(null, "r", r);
  dot.setAttributeNS(null, "fill", fill);

  parentNode.appendChild(dot);
}

function generateDotExplosion(qty) {
  for (let i = 0; i < qty; i++) {
    const r = anime.random(0, innerHeight / 4);
    const alpha = Math.random() * (2 * Math.PI - 0) + 2 * Math.PI;
    const x = r * Math.cos(alpha) + innerWidth / 2;
    const y = r * Math.sin(alpha) + innerHeight / 2;
    createDot(x, y, 0, null, document.getElementById("clipPathExplosion"));
  }
}

function generateFrameParticles(qty) {
  for (let i = 0; i < qty; i++) {
    const r = anime.random(0, 180);
    const alpha = Math.random() * (2 * Math.PI - 0) + 2 * Math.PI;
    const x = r * Math.cos(alpha) + 240;
    const y = r * Math.sin(alpha) + 240;
    createDot(
      x,
      y,
      anime.random(1, 8),
      frameParticlesColors[anime.random(0, 5)],
      document.getElementById("clgFrame")
    );
  }
}

document.querySelector("#restart").onclick = animation.restart;

// const clgAssistant = new ClgAssistant(
//   "frameClassTest",
//   { x: 10, y: 200 },
//   { x: 600, y: 400 }
// );

// console.log(clgAssistant);
