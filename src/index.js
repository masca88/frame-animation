import 'babel-polyfill';
import "./styles.less";
import ClgAssistant from "./ClgAssitant";
import Explosion from "./Explosion";

const clgAssistant = new ClgAssistant(
  "frameClassTest",
  { x: window.innerWidth / 2 - 60, y: 50 },
  { x: window.innerWidth / 2 + 200, y: 400 }
);

document.querySelector(".action-bar #play").onclick = () => clgAssistant.frameAnimation.play();
document.querySelector(".action-bar #pause").onclick = () => clgAssistant.frameAnimation.pause();
document.querySelector(".action-bar #restart").onclick = () => clgAssistant.frameAnimation.restart();