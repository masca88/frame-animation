import 'babel-polyfill';
import anime from 'animejs';
import ClgAssistant from './ClgAssitant';
import Explosion from './Explosion';
import './styles.less';

const clgAssistant = new ClgAssistant({
  id: 'clg-assistant',
  start: { x: window.innerWidth / 2 - 60, y: 50 },
  end: { x: window.innerWidth / 2 + 200, y: window.innerHeight - 500 },
});

const explosion = new Explosion({
  id: 'explosion',
  color: 'linear-gradient(45deg, #22c1c3 0%, #fdbb2d 100%)',
});

const animation = anime.timeline({
  targets: document.body,
  loop: false,
});
(async () => {
  await explosion.init();
  await clgAssistant.init();
  
  animation
    .add(clgAssistant.initialPosition)
    .add(clgAssistant.lookRight)
    .add(clgAssistant.lookLeft)
    .add(explosion.showDots, '-=200')
    .add(explosion.explode, '-=100')
    .add(clgAssistant.changeColor, '-=450')
    .add(clgAssistant.move, '-=500')
    .add(clgAssistant.spin);
})();


document.querySelector('.action-bar #play').onclick = () => animation.play();
document.querySelector('.action-bar #pause').onclick = () => animation.pause();
document.querySelector('.action-bar #restart').onclick = () => animation.restart();