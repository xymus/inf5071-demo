// ---------------- //
// Global variables //
// ---------------- //
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
               {preload: preload, create: create, update: update});
game.cx = game.width / 2;
game.cy = game.height / 2;
var scene;
var colorChangeTime;

// Flèches du clavier
var leftKey;
var rightKey;

// ----- //
// Utils //
// ----- //
Phaser.Graphics.prototype.drawRegularPolygon = function (x, y, n, r, a) {
    this.moveTo(x + r * Math.cos(a), y + r * Math.sin(a));
    for (i = 1; i <= n; i++) {
        var a2 = i * 2 * Math.PI / n;
        var x2 = x + r * Math.cos(a + a2);
        var y2 = y + r * Math.sin(a + a2);
        this.lineTo(x2, y2);
    }
}

Phaser.Color.updateValue = function(color, valueChange) {
    var rgb = Phaser.Color.getRGB(color);
    var hsv = Phaser.Color.RGBtoHSV(rgb.r, rgb.g, rgb.b);
    hsv.v += valueChange;
    rgb = Phaser.Color.HSVtoRGB(hsv.h, hsv.s, hsv.v);
    console.log(Phaser.Color.toRGBA(rgb.r, rgb.g, rgb.b));
    return rgb.r << 16 | rgb.g << 8 | rgb.b;
}

// ------------ //
// Scene object //
// ------------ //
function Scene (graphics, angle, radius, color) {
    this.graphics = graphics;
    this.angle = angle;
    this.radius = radius;
    this.color = color;

    this.obstacles = [new Obstacle(), new Obstacle(),
                      new Obstacle(), new Obstacle(), new Obstacle()];

    this.playerAngle = 0.0;
    this.playerLive = true;
    this.playerSpeed = 0.0
    this.playerSpeedMax = 0.005

    this.particleWave = game.add.sprite(-200, -200, 'wave');
    this.particleWave.anchor.set(0.5, 0.5);

    this.particleLost = game.add.sprite(game.world.centerX, game.world.centerY, 'lost');
    this.particleLost.alpha = 0.0;
    this.particleLost.anchor.set(0.5, 0.5);
}

function Obstacle() {
    this.zone = Math.floor(6 * Math.random());
    this.colorMod = -0.3;
    this.dist = 12.0;
    this.depth = 1.0;

    this.update = function () {
        this.dist -= 0.1;
    }

    this.collide = function (playerAngle) {
        return this.dist < 1.4 &&
            playerAngle >= this.zone *    Math.PI / 3 &&
            playerAngle < (this.zone+1) * Math.PI / 3;
    }
}

Scene.prototype.drawZone = function (angle, color) {
    this.graphics.lineStyle(5, color, 1);
    this.graphics.moveTo(this.radius * Math.cos(angle),
                         this.radius * Math.sin(angle));
    this.graphics.beginFill(color);
    this.graphics.lineTo(12 * this.radius * Math.cos(angle),
                         12 * this.radius * Math.sin(angle));
    this.graphics.lineTo(12 * this.radius * Math.cos(angle + Math.PI / 3),
                         12 * this.radius * Math.sin(angle + Math.PI / 3));
    this.graphics.lineTo(this.radius * Math.cos(angle + Math.PI / 3),
                         this.radius * Math.sin(angle + Math.PI / 3));
    this.graphics.endFill();
}

Scene.prototype.drawObstacle = function (obs) {
    angle = this.angle + obs.zone * Math.PI / 3
    inner = obs.dist
    outer = obs.dist + obs.depth
    if (inner < 1.0) inner = 1.0

    var color = Phaser.Color.updateValue(this.color, obs.colorMod);

    this.graphics.lineStyle(5, color, 1);
    this.graphics.moveTo(inner * this.radius * Math.cos(angle),
                         inner * this.radius * Math.sin(angle));
    this.graphics.beginFill(color);
    this.graphics.lineTo(outer * this.radius * Math.cos(angle),
                         outer * this.radius * Math.sin(angle));
    this.graphics.lineTo(outer * this.radius * Math.cos(angle + Math.PI / 3),
                         outer * this.radius * Math.sin(angle + Math.PI / 3));
    this.graphics.lineTo(inner * this.radius * Math.cos(angle + Math.PI / 3),
                         inner * this.radius * Math.sin(angle + Math.PI / 3));

    // Pour la ligne seulement
    this.graphics.lineTo(inner * this.radius * Math.cos(angle),
                         inner * this.radius * Math.sin(angle));

    this.graphics.endFill();
}

Scene.prototype.drawPlayer = function () {
    var color = Phaser.Color.updateValue(this.color, -0.2);
    var angle = this.angle + this.playerAngle;
    var width = Math.PI / 40;

    this.graphics.lineStyle(5, color, 1);
    this.graphics.moveTo(1.2 * this.radius * Math.cos(angle - width),
                         1.2 * this.radius * Math.sin(angle - width));
    this.graphics.beginFill(color);
    this.graphics.lineTo(1.3 * this.radius * Math.cos(angle),
                         1.3 * this.radius * Math.sin(angle));
    this.graphics.lineTo(1.2 * this.radius * Math.cos(angle + width),
                         1.2 * this.radius * Math.sin(angle + width));
    this.graphics.lineTo(1.2 * this.radius * Math.cos(angle - width),
                         1.2 * this.radius * Math.sin(angle - width));
    this.graphics.endFill();
}

Scene.prototype.update = function () {
    this.graphics.clear();
    this.graphics.x = game.cx;
    this.graphics.y = game.cy;
    // Zones
    var darkColor = Phaser.Color.updateValue(this.color, -0.7);
    var lightColor = Phaser.Color.updateValue(this.color, -0.6);
    this.drawZone(this.angle, darkColor);
    this.drawZone(this.angle + Math.PI / 3, lightColor);
    this.drawZone(this.angle + 2 * Math.PI / 3, darkColor);
    this.drawZone(this.angle + 3 * Math.PI / 3, lightColor);
    this.drawZone(this.angle + 4 * Math.PI / 3, darkColor);
    this.drawZone(this.angle + 5 * Math.PI / 3, lightColor);

    for (i in this.obstacles) {
        var obs = this.obstacles[i];
        var collision = obs.collide(this.playerAngle);
        if (this.playerLive && collision) {
            this.playerLive = false;

            this.particleLost.x = game.world.centerX;
            this.particleLost.y = game.world.centerY;
            this.particleLost.alpha = 0.0;

            var tween = game.add.tween(this.particleLost);
            tween.to({alpha: 1.0}, 2000);
            tween.easing(Phaser.Easing.Sinusoidal.In);
            tween.start();

            var tweenScale = game.add.tween(this.particleLost.scale);
            tweenScale.to({x: 2.0, y: 2.0}, 2000);
            tweenScale.easing(Phaser.Easing.Sinusoidal.In);
            tweenScale.start();
        }

        obs.update();

        if (obs.dist + obs.depth <= 1.0) {
            if (this.playerLive) {
                this.particleWave.x = game.world.centerX;
                this.particleWave.y = game.world.centerY;
                this.particleWave.alpha = 0.0;

                var tween = game.add.tween(this.particleWave);
                tween.to({y: -100, alpha: 1.0}, 2000);
                tween.easing(Phaser.Easing.Sinusoidal.In);
                tween.start();
            }

            this.obstacles[i] = new Obstacle();
        }

        this.drawObstacle(obs);
    }

    var particleColor = Phaser.Color.updateValue(this.color, -0.1);
    this.particleWave.tint = particleColor;
    this.particleLost.tint = particleColor;

    if (this.playerLive) {
        this.drawPlayer();

        if (leftKey.isDown == rightKey.isDown) {
            this.playerSpeed = 0.0;
        } else if (leftKey.isDown) {
            this.playerSpeed = -this.playerSpeedMax;
        } else if (rightKey.isDown) {
            this.playerSpeed = this.playerSpeedMax;
        }
    }

    scene.playerAngle += this.playerSpeed * game.time.elapsedMS;
    scene.playerAngle %= Math.PI * 2;
    if (scene.playerAngle < 0.0) scene.playerAngle += Math.PI * 2;

    // Polygon
    this.graphics.lineStyle(5, this.color, 1);
    this.graphics.drawRegularPolygon(0, 0, 6, this.radius, this.angle);
};

// -------------- //
// Main functions //
// -------------- //
function preload() {
    game.load.image('wave', 'assets/wave.png');
    game.load.image('lost', 'assets/lost.png');
}

function create() {
    var graphics = game.add.graphics();
    scene = new Scene(graphics, 0, 50, 0xFF00FF);
    colorChangeTime = game.time.time;

    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebar.onDown.add(function onDown() {
        if (scene.playerLive) return;

        scene.particleWave.destroy();
        scene.particleLost.destroy();

        scene = new Scene(graphics, 0, 50, 0xFF00FF);
        colorChangeTime = game.time.time;
    }, this);
}

function update() {
    var colors = [0xFF0000, 0x00FF00, 0x0000FF, 0xFFFF00, 0xFF00FF, 0x00FFFF];
    var elapsed = game.time.elapsed / 1000; // Temps écoulé en secondes
    var angularSpeed = Math.PI/2;             // Vitesse angulaire en radian/seconde
    var direction = (game.time.time / 1000) % 10 < 5 ? 1 : -1;
    if ((game.time.time - colorChangeTime) / 1000 > 3) {
        scene.color = colors[Math.floor(Math.random() * colors.length)]
        colorChangeTime = game.time.time;
    }
    scene.angle += direction * elapsed * angularSpeed;
    scene.radius = 50; // + 2 * Math.random();
    scene.update();
}
