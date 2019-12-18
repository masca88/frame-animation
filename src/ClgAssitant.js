import anime from 'animejs';
import fs from 'fs';
import { createDot, generateBezierPath } from './utils';
import frameSvg from './frame.svg';
const { innerWidth, innerHeight } = window;
const FRAME_DOT_QTY = 150;
const FRAME_PARTICLES_COLORS = [
  '#578ad4',
  '#4e92d7',
  '#0eb2e0',
  '#e6ecf9',
  '#7562ca',
  '#6f69cc'
];

const startPoint = {
  x: innerWidth / 2,
  y: 100
};
const endPoint = {
  x: innerWidth - 500,
  y: innerHeight - 300
};

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
  }

  async init() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.generateRoadPath();
        await this.initFrame();
        await this.generateFrameParticles(FRAME_DOT_QTY);
        this.particlesAnimation = this.initParticlesAnimation();
        this.frameAnimation = this.initFrameAnimation();
        resolve(true);
      } catch (error) {
        reject(error);
      }
    })
  }

  generateRoadPath() {
    return new Promise(async (resolve, reject) => {
      try {
        const road = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        road.style.height = '100vh';
        road.style.width = '100vw';
        road.style.position = 'absolute';
        road.style.strokeWidth = 0;
        road.style.fill = 'none';
        this.rootNode.appendChild(road);

        const roadPath = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'path'
        );
        roadPath.setAttributeNS(null, 'id', 'road');
        roadPath.setAttributeNS(
          null,
          'd',
          generateBezierPath(this.start, this.end)
        );
        road.appendChild(roadPath);
        this.roadPathAnimation = anime.path(this.rootNode.querySelector('#road'));
        resolve(true);
      } catch (error) {
        reject(error);
      }
    })
  }

  async initFrame() {
    return new Promise(async (resolve, reject) => {
      try {
        const rawSvg = await fetch(frameSvg);
        const parser = new DOMParser();
        const svgNode = await parser.parseFromString(await rawSvg.text(), "image/svg+xml");
        this.rootNode.appendChild(svgNode.documentElement);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    })
  }

  generateFrameParticles(qty) {
    return new Promise(async (resolve, reject) => {
      try {
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
            this.rootNode.querySelector('#clgFrame')
          );
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    })   

  }

  initParticlesAnimation() {    
    return anime({
      targets: this.rootNode.querySelectorAll('#clgFrame circle'),
      opacity: [1, 0, 1],
      delay: anime.stagger(200, { grid: [14, 5], from: 'center' }),
      duration: 1000,
      loop: true,
      easing: 'easeInOutQuad'
    });
  }

  initFrameAnimation() {
    const animation = anime.timeline({
      targets: this.rootNode.querySelectorAll('#clgFrame'),
      easing: 'spring',
      loop: false,
      autoplay: false,
    });
    this.initialPosition = {
      targets: this.rootNode.querySelectorAll('#clgFrame'),
      translateX: this.start.x,
      translateY: this.start.y
    };
    this.lookLeft = {
      targets: this.rootNode.querySelectorAll('#clgFrame'),
      rotate: -30
    };
    this.lookRight = {
      targets: this.rootNode.querySelectorAll('#clgFrame'),
      rotate: 30
    };
    this.changeColor = {
      targets: this.rootNode.querySelectorAll('#clgFrame .cls-1'),
      fill: this.endColor
    };
    this.move = {
      targets: this.rootNode.querySelectorAll('#clgFrame'),
      translateX: this.roadPathAnimation('x'),
      translateY: this.roadPathAnimation('y'),
      scale: 0.6,
      rotate: 180,
      easing: 'linear',
      duration: 1500
    };
    this.spin = {
      targets: this.rootNode.querySelectorAll('#clgFrame'),
      rotate: 720
    };
    animation
      .add(this.initialPosition)
      .add(this.lookRight)
      .add(this.lookLeft)
      .add(this.changeColor, '-=2100')
      .add(this.move,'-=500')
      .add(this.spin);

    return animation;
  }
}

export default ClgAssistant;
