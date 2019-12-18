import anime from "animejs";
import { take } from "lodash";
import { createDot } from './utils';
import explosionSvg from './explosion.svg';
const { innerWidth, innerHeight } = window;

const EXPLOSION_DOT_QTY = 200;

const centerPoint = {
  x: innerWidth / 2,
  y: 300
};

class Explosion {
  constructor(rootNodeId, response, center = centerPoint) {
    this.rootNode = document.getElementById(rootNodeId) || document.body;
    this.response = response;
    this.center = center;
  }

  async init() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.initExplosion();
        await this.generateDotExplosion(EXPLOSION_DOT_QTY);
        this.explosionAnimation = this.initExplosionAnimation();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    })
  }

  async initExplosion() {
    return new Promise(async (resolve, reject) => {
      try {
        const rawSvg = await fetch(explosionSvg);
        const parser = new DOMParser();
        const svgNode = await parser.parseFromString(await rawSvg.text(), "image/svg+xml");
        this.rootNode.appendChild(svgNode.documentElement);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    })
  }

  generateDotExplosion(qty) {
    return new Promise(async (resolve, reject) => {
      try {
        for (let i = 0; i < qty; i++) {
          const r = anime.random(0, innerHeight / 2);
          const alpha = Math.random() * (2 * Math.PI - 0) + 2 * Math.PI;
          const x = r * Math.cos(alpha) + innerWidth / 2;
          const y = r * Math.sin(alpha) + innerHeight / 2;
          createDot(
            x,
            y,
            0,
            null,
            this.rootNode.querySelector('#clipPathExplosion'),
          );
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    })
  }

  initExplosionAnimation() {
    const animation = anime.timeline({
      targets: this.rootNode,
      loop: false,
      autoplay: false,
    });

    this.showDots = {
      targets: this.rootNode.querySelectorAll("circle"),
      r: [0, () => anime.random(1, 8)],
      delay: anime.stagger(40, { grid: [14, 5], from: "center" }),
      duration: 100,
      easing: "linear"
    };
    this.explode = {
      targets: take(this.rootNode.querySelectorAll("circle"), 10),
      r: innerWidth > innerHeight ? innerWidth : innerHeight,
      delay: anime.stagger(300, { grid: [14, 5], from: "center" }),
      duration: 450,
      easing: "easeInCirc"
    };

    animation
      .add(this.showDots)
      .add(this.explode);

    return animation;
  }
}

export default Explosion;
