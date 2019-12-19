import _ from 'lodash';
import anime from "animejs";
import { svgNs, newSvg, createDotElement } from './utils';
const { innerWidth, innerHeight } = window;

const distanceTo = (point1, point2) => Math.sqrt((Math.pow(point2.x - point1.x, 2)) + (Math.pow(point2.y - point1.y, 2)));

const EXPLOSION_DOT_QTY = 200;

const centerPoint = {
  x: innerWidth / 2,
  y: 300
};

class Explosion {
  constructor({
    id, 
    color = '#000',
    center = centerPoint
  }) {
    this.rootNode = document.getElementById(id) || document.body;
    this.center = center;
    this.bgColor = color;
  }

  async init() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.initExplosion();
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
        const svg = newSvg('100%', '100%');
        svg.id = 'explosion';
        const defs = document.createElementNS(svgNs, 'defs');
        const clippath = document.createElementNS(svgNs, 'clipPath');
        clippath.setAttribute('id', 'clipPathExplosion');
        const dots = await this.generateDotExplosion(EXPLOSION_DOT_QTY);
        dots.forEach(element => {
          clippath.appendChild(element);
        });
        defs.appendChild(clippath);
        svg.appendChild(defs);

        const bg = document.createElement("div");
        bg.id = "bg";
        bg.setAttribute('style', `
          position: absolute;
          height: 100%;
          width: 100%;
          background: ${this.bgColor};
          clip-path:url(#clipPathExplosion);
        `);
        this.rootNode.appendChild(bg);
        this.rootNode.appendChild(svg);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    })
  }

  generateDotExplosion(qty) {
    return new Promise(async (resolve, reject) => {
      try {
        const points = [];
        for (let i = 0; i < qty; i++) {
          const r = anime.random(0, innerHeight / 2);
          const alpha = Math.random() * (2 * Math.PI - 0) + 2 * Math.PI;
          const x = r * Math.cos(alpha) + innerWidth / 2;
          const y = r * Math.sin(alpha) + innerHeight / 2;
          points.push({ x, y });
        }        
        resolve(_.sortBy(points, (point) => distanceTo(this.center, point)).map(({ x, y }) => {
          return createDotElement(
            x,
            y,
            0,
            null,
          );
        }));
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
      delay: anime.stagger(2, { easing: 'easeOutCirc' }),
      duration: 30,
      direction: 'alternate',
      easing: "linear"
    };
    this.explode = {
      targets: _.take(_.shuffle(this.rootNode.querySelectorAll("circle")), 10),
      r: innerWidth > innerHeight ? innerWidth : innerHeight,
      delay: anime.stagger(10),
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
