import anime from "animejs";
import { take } from "lodash";
import "./styles.less";
const { innerWidth, innerHeight } = window;
const FRAME_DOT_QTY = 150;
const EXPLOSION_DOT_QTY = 200;
const FRAME_PARTICLES_COLORS = [
  "#578ad4",
  "#4e92d7",
  "#0eb2e0",
  "#e6ecf9",
  "#7562ca",
  "#6f69cc"
];

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

class ResponseAnimation {
  constructor(rootNodeId, response, start = startPoint, end = endPoint) {
    this.rootNode = document.getElementById(rootNodeId) || document.body;
    this.response = response;
    this.startCoords = start;
    this.endCoords = end;
    this.roadPathAnimation = this.generateRoadPath();
  }

  static generateRoadPath() {
    const road = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    road.style = {
      height: "100vh",
      width: "100vw",
      position: "absolute",
      strokeWidth: 0,
      fill: "none"
    };
    this.rootNode.appendChild(road);

    const roadPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    roadPath.setAttributeNS(null, "id", "road");
    roadPath.setAttributeNS(
      null,
      "d",
      generateBezierPath(startPoint, endPoint)
    );
    road.appendChild(roadPath);
    return anime.path("#road");
  }

  static createDot(x, y, r, fill, parentNode) {
    const dot = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    dot.setAttributeNS(null, "cx", x);
    dot.setAttributeNS(null, "cy", y);
    dot.setAttributeNS(null, "r", r);
    dot.setAttributeNS(null, "fill", fill);

    parentNode.appendChild(dot);
  }

  static generateDotExplosion(qty) {
    for (let i = 0; i < qty; i++) {
      const r = anime.random(0, innerHeight / 2);
      const alpha = Math.random() * (2 * Math.PI - 0) + 2 * Math.PI;
      const x = r * Math.cos(alpha) + innerWidth / 2;
      const y = r * Math.sin(alpha) + innerHeight / 2;
      this.createDot(
        x,
        y,
        0,
        null,
        document.getElementById("clipPathExplosion")
      );
    }
  }

  static generateFrameParticles(qty) {
    for (let i = 0; i < qty; i++) {
      const r = anime.random(0, 180);
      const alpha = Math.random() * (2 * Math.PI - 0) + 2 * Math.PI;
      const x = r * Math.cos(alpha) + 240;
      const y = r * Math.sin(alpha) + 240;
      this.createDot(
        x,
        y,
        anime.random(1, 8),
        FRAME_PARTICLES_COLORS[anime.random(0, 5)],
        document.getElementById("clgFrame")
      );
    }
  }
}

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
  .add(
    {
      targets: "#explosion circle",
      r: [0, () => anime.random(1, 8)],
      duration: 400,
      easing: "linear"
    },
    "-=500"
  )
  .add(
    {
      targets: take(document.querySelectorAll("#explosion circle"), 10),
      r: innerWidth > innerHeight ? innerWidth : innerHeight,
      delay: anime.stagger(300, { grid: [14, 5], from: "center" }),
      duration: 1300,
      easing: "easeInCirc"
    },
    "-=700"
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
    "-=2100"
  )
  .add(
    {
      targets: "#clgFrame",
      translateX: pathAnimation("x"),
      translateY: pathAnimation("y"),
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

document.querySelector("#restart").onclick = animation.restart;
