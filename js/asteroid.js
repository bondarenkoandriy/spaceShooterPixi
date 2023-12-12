export default class Asteroid {
  constructor(app) {
    this.app = app;
    this.sprite = PIXI.Sprite.from("../assets/enemy/static.png");
    this.sprite.x = (Math.random() * this.app.screen.width) / 2;
    this.sprite.y = Math.random() * ((this.app.screen.height + 10) / 4);
    this.sprite.xSpeed = Math.random() * 2 - 1;
    this.sprite.ySpeed = Math.random() * 2 - 1;

    this.setup();
  }

  setup() {
    this.app.stage.addChild(this.sprite);
  }

  update(projectiles, asteroids) {
    this.sprite.x += this.sprite.xSpeed;
    this.sprite.y += this.sprite.ySpeed;

    if (
      this.sprite.x < 0 ||
      this.sprite.x + this.sprite.width > this.app.screen.width
    ) {
      this.sprite.xSpeed *= -1;
    }
    if (
      this.sprite.y < 0 ||
      this.sprite.y + this.sprite.height > (this.app.screen.height + 10) / 2
    ) {
      this.sprite.ySpeed *= -1;
    }

    projectiles.forEach((projectile, index) => {
      if (
        this.sprite.x < projectile.x + projectile.width &&
        this.sprite.x + this.sprite.width > projectile.x &&
        this.sprite.y < projectile.y + projectile.height &&
        this.sprite.y + this.sprite.height > projectile.y
      ) {
        this.app.stage.removeChild(projectile);
        projectiles.splice(index, 1);

        this.app.stage.removeChild(this.sprite);
        asteroids.splice(asteroids.indexOf(this), 1);
      }
    });
  }
}
