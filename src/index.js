import 'babel-polyfill';
import anime from 'animejs';
import ClgAssistant from "./ClgAssitant";
import Explosion from "./Explosion";
import "./styles.less";

const clgAssistant = new ClgAssistant(
  "clg-assistant",
  { x: window.innerWidth / 2 - 60, y: 50 },
  { x: window.innerWidth / 2 + 200, y: 400 }
);

const explosion = new Explosion(
  "explosion",
  "fake"
);

(async () => {
  await explosion.init();
  await clgAssistant.init();

  const animation = anime.timeline({
    targets: document.body,
    loop: false,
  });

  animation
    .add(clgAssistant.initialPosition)
    .add(clgAssistant.lookRight)
    .add(clgAssistant.lookLeft)
    .add(explosion.showDots, '-=500')
    .add(explosion.explode, '-=1000')
    .add(clgAssistant.changeColor, '-=2100')
    .add(clgAssistant.move, '-=500')
    .add(clgAssistant.spin);
})();


document.querySelector(".action-bar #play").onclick = () => clgAssistant.frameAnimation.play();
document.querySelector(".action-bar #pause").onclick = () => clgAssistant.frameAnimation.pause();
document.querySelector(".action-bar #restart").onclick = () => clgAssistant.frameAnimation.restart();