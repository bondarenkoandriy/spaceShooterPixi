export default class Player {
  constructor(app, projectiles, ammoText, maxAmmo) {
    this.app = app;
    this.projectiles = projectiles;
    this.ammoText = ammoText;
    this.sprite = PIXI.Sprite.from("../assets/ship/static.png");
    this.sprite.y = this.app.screen.height - 100;
    this.sprite.x = this.app.screen.width / 2;
    this.sprite.speed = 5;
    this.maxProjectiles = maxAmmo;

    this.keys = {
      left: false,
      right: false,
      leftState: false,
      rightState: false,
      space: false,
    };

    this.setup();
  }

  setup() {
    this.app.stage.addChild(this.sprite);
  }

  handleKeyDown(event) {
    switch (event.key) {
      case "ArrowLeft":
        if (this.keys.rightState === true) {
          this.keys.right = false;
        }
        this.keys.leftState = true;
        this.keys.left = true;
        break;
      case "ArrowRight":
        if (this.keys.leftState === true) {
          this.keys.left = false;
        }
        this.keys.rightState = true;
        this.keys.right = true;
        break;
      case " ":
        if (this.keys.space === true) {
          this.keys.space = false;
        }
        this.shootProjectile();
        break;
    }
  }

  handleKeyUp(event) {
    switch (event.key) {
      case "ArrowLeft":
        if (this.keys.rightState === true) {
          this.keys.right = true;
        }
        this.keys.leftState = false;
        this.keys.left = false;
        break;
      case "ArrowRight":
        if (this.keys.leftState === true) {
          this.keys.left = true;
        }
        this.keys.rightState = false;
        this.keys.right = false;
        break;
      case " ":
        this.keys.space = false;
        break;
    }
  }

  shootProjectile() {
    if (this.maxProjectiles !== 0) {
      const projectile = new PIXI.Graphics();
      projectile.beginFill(0xff0000);
      projectile.drawCircle(0, 0, 5);
      projectile.endFill();

      this.maxProjectiles--;
      projectile.x = this.sprite.x + this.sprite.width / 2;
      projectile.y = this.sprite.y - 10;

      this.app.stage.addChild(projectile);
      this.projectiles.push(projectile);
    } else {
      console.log("Відсутні патрони ");
    }
    this.updateAmmoText();
  }

  updateAmmoText() {
    this.ammoText.text = `Патрони: ${this.maxProjectiles}`;
  }

  update() {
    if (this.keys.left) {
      this.sprite.x -= this.sprite.speed;
    }
    if (this.keys.right) {
      this.sprite.x += this.sprite.speed;
    }

    if (this.sprite.x < 0) {
      this.sprite.x = 0;
    } else if (this.sprite.x + this.sprite.width > this.app.screen.width) {
      this.sprite.x = this.app.screen.width - this.sprite.width;
    }

    this.projectiles.forEach((projectile, index) => {
      projectile.y -= 5;

      if (projectile.y < 0) {
        this.app.stage.removeChild(projectile);
        this.projectiles.splice(index, 1);
      }
    });
  }
}
