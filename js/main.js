import Game from "./game.js";

const app = new PIXI.Application({ width: 1280, height: 720 });
document.body.appendChild(app.view);

const game = new Game(app);
game.setup();
game.setupListeners();

app.ticker.add(() => {
  game.update();
});
