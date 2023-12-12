import Player from "./player.js";
import Asteroid from "./asteroid.js";

export default class Game {
  constructor(app) {
    this.app = app;
    this.player = null;
    this.projectiles = [];
    this.asteroids = [];
    this.maxAsteroids = 5;
    this.maxAmmo = 10;
    this.gameEnded = false;
    this.timer = 60;
    this.timerText = new PIXI.Text(`Залишилось часу: ${this.timer} сек`, {
      fontSize: 20,
      fill: 0xffffff,
    });
    this.timerText.anchor.set(0.5, 0);
    this.timerText.x = this.app.screen.width / 2;
    this.timerText.y = 10;
    this.ammoText = new PIXI.Text(`Патрони: 10`, {
      fontSize: 20,
      fill: 0xffffff,
    });
    this.ammoText.anchor.set(1, 0);
    this.ammoText.x = this.app.screen.width - 10;
    this.ammoText.y = 10;
    this.gameTimer = setInterval(this.updateTimer.bind(this), 1000);
    this.infinityGame = false;
    this.infinityLevel = { asteroids: 7, ammo: 10, timer: 55 };
    this.infinityButton = this.createInfinityButton();
  }

  setup() {
    const backgroundFiles = [];
    for (let i = 1; i <= 33; i++) {
      backgroundFiles.push(`assets/background/r1 (${i}).png`);
    }

    const randomIndex = Math.floor(Math.random() * backgroundFiles.length);
    const randomBackgroundFile = backgroundFiles[randomIndex];

    const background = PIXI.Sprite.from(randomBackgroundFile);
    background.width = this.app.screen.width;
    background.height = this.app.screen.height;

    this.app.stage.addChild(background);
    this.app.stage.addChild(this.timerText);
    this.app.stage.addChild(this.ammoText);
    this.app.stage.addChild(this.infinityButton);
    this.createGameObjects();
  }

  createInfinityButton() {
    const button = new PIXI.Text(
      `Нескінчений режим - ${this.infinityGame ? "УВІМКНЕНО" : "Вимкнено"}`,
      {
        fontSize: 16,
        fill: 0xffffff,
      }
    );
    button.anchor.set(0, 0);
    button.x = 10;
    button.y = 10;
    button.interactive = true;
    button.buttonMode = true;
    button.on("pointerdown", this.toggleInfinity.bind(this));

    return button;
  }

  toggleInfinity() {
    this.infinityGame = !this.infinityGame;
    this.infinityButton.text = `Нескінчений режим - ${
      this.infinityGame ? "УВІМКНЕНО" : "Вимкнено"
    }`;
  }

  createGameObjects() {
    this.player = new Player(
      this.app,
      this.projectiles,
      this.ammoText,
      this.maxAmmo
    );
    for (let i = 0; i < this.maxAsteroids; i++) {
      this.asteroids.push(new Asteroid(this.app));
    }
  }

  setupListeners() {
    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  handleKeyDown(event) {
    this.player.handleKeyDown(event);
  }

  handleKeyUp(event) {
    this.player.handleKeyUp(event);
  }

  update() {
    if (!this.gameEnded) {
      this.player.update();
      this.asteroids.forEach((asteroid) =>
        asteroid.update(this.projectiles, this.asteroids)
      );
      this.checkGameStatus();
    }
  }

  updateTimer() {
    if (!this.gameEnded) {
      this.timer--;
      this.timerText.style.fill = this.timer <= 10 ? 0xff0000 : 0xffffff;
      this.timerText.text = `Залишилось часу: ${this.timer} sec`;
      if (this.timer <= 0) {
        this.endGame("You Lose!");
      }
    }
  }

  checkGameStatus() {
    if (
      this.player.maxProjectiles === 0 &&
      this.projectiles.length === 0 &&
      this.asteroids.length > 0
    ) {
      this.endGame("You lose!");
    } else if (this.asteroids.length === 0) {
      this.infinityGame ? this.infinityMode() : this.endGame("You win!");
    }
  }

  endGame(message) {
    this.gameEnded = true;

    const gameOverText = new PIXI.Text(message, {
      fontSize: 40,
      fill: 0xffffff,
    });
    gameOverText.anchor.set(0.5);
    gameOverText.x = this.app.screen.width / 2;
    gameOverText.y = this.app.screen.height / 2;
    this.app.stage.addChild(gameOverText);

    const restartButton = new PIXI.Text("RESTART :3", {
      fontSize: 36,
      fill: 0xff0000,
      align: "center",
    });
    restartButton.anchor.set(0.5);
    restartButton.x = this.app.screen.width / 2;
    restartButton.y = this.app.screen.height / 2 + 60;
    restartButton.interactive = true;
    restartButton.buttonMode = true;
    restartButton.on("pointerdown", this.restartGame.bind(this));
    this.app.stage.addChild(restartButton);
  }

  infinityLevelUp() {
    this.infinityLevel.ammo = this.infinityLevel.ammo + 2;
    this.infinityLevel.timer = this.infinityLevel.timer - 1;
    this.infinityLevel.asteroids = this.infinityLevel.asteroids + 2;
  }

  infinityMode() {
    this.infinityLevelUp();
    this.app.stage.removeChildren();
    this.projectiles = [];
    this.asteroids = [];
    this.maxAsteroids = this.infinityLevel.asteroids;
    this.gameEnded = false;
    this.timer = this.infinityLevel.timer;
    this.maxAmmo = this.infinityLevel.ammo;
    this.ammoText.text = `Патрони: ${this.maxAmmo}`;
    this.timerText.text = `Залишилось часу: ${this.timer} сек`;
    this.setup();
  }

  restartGame() {
    this.app.stage.removeChildren();
    this.infinityLevel = { asteroids: 7, ammo: 10, timer: 55 };
    this.projectiles = [];
    this.asteroids = [];
    this.maxAsteroids = 5;
    this.gameEnded = false;
    this.timer = 60;
    this.maxAmmo = 10;
    this.ammoText.text = `Патрони: ${this.maxAmmo}`;
    this.timerText.text = `Залишилось часу: ${this.timer} сек`;
    this.setup();
  }
}
