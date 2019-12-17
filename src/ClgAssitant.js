import anime from "animejs";
import { createDot } from "./utils";
import frameSvg from "./frame.svg";
import "./styles.less";
const { innerWidth, innerHeight } = window;
const FRAME_DOT_QTY = 150;
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

class ClgAssistant {
  constructor(
    rootNodeId,
    start = startPoint,
    end = endPoint,
    startColor,
    endColor
  ) {
    this.rootNode = document.getElementById(rootNodeId) || document.body;
    this.start = start;
    this.end = end;
    this.startColor = startColor;
    this.endColor = endColor || startColor;
    this.frameSvg = frameSvg;

    this.generateRoadPath();
    this.initFrame();
    this.particlesAnimation = this.initParticlesAnimation();
    this.frameAnimation = this.initFrameAnimation();
  }

  generateRoadPath() {
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
    this.roadPathAnimation = anime.path(this.rootNode.querySelector("#road"));
  }

  initFrame() {
    var parser = new DOMParser();
    const svgNode = parser.parseFromString(this.frameSvg, "image/svg+xml");
    this.rootNode.appendChild(svgNode.documentElement);
    this.generateFrameParticles(FRAME_DOT_QTY);
  }

  generateFrameParticles(qty) {
    for (let i = 0; i < qty; i++) {
      const r = anime.random(0, 180);
      const alpha = Math.random() * (2 * Math.PI - 0) + 2 * Math.PI;
      const x = r * Math.cos(alpha) + 240;
      const y = r * Math.sin(alpha) + 240;
      createDot(
        x,
        y,
        anime.random(1, 8),
        FRAME_PARTICLES_COLORS[anime.random(0, 5)],
        this.rootNode.querySelector("#clgFrame")
      );
    }
  }

  initParticlesAnimation() {
    return anime({
      targets: this.rootNode.querySelectorAll("#clgFrame circle"),
      opacity: [1, 0, 1],
      delay: anime.stagger(200, { grid: [14, 5], from: "center" }),
      duration: 1000,
      loop: true,
      easing: "easeInOutQuad"
    });
  }

  initFrameAnimation() {
    const animation = anime.timeline({
      targets: this.rootNode.querySelectorAll("#clgFrame"),
      easing: "spring",
      loop: false
    });

    animation
      .add({
        translateX: this.start.x,
        translateY: this.start.y
      })
      .add({
        rotate: 30
      })
      .add({
        rotate: -30
      })
      .add(
        {
          targets: this.rootNode.querySelectorAll("#clgFrame .cls-1"),
          fill: this.endColor
        },
        "-=2100"
      )
      .add(
        {
          targets: "#clgFrame",
          translateX: this.roadPathAnimation("x"),
          translateY: this.roadPathAnimation("y"),
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

    return animation;
  }
}

export default ClgAssistant;
