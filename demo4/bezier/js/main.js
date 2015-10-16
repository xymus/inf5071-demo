var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
               {preload: preload, create: create});

function preload() {
    
    game.load.image('lumiere', 'assets/lumiere.png');
}

function create() {

    // Arriere plan
    game.stage.backgroundColor = '#ffffff';

    // Sprites
    var sprite = game.add.sprite(100, 100, 'lumiere');
    sprite.anchor.set(0.5, 0.5)
    sprite.tint = 0xff0000

    // Tweens
    var tween = game.add.tween(sprite)
    .to({
        x: [100, 600, 200, 700],
        y: [100, 100, 500, 500],
    }, 5000) // , Phaser.Easing.Cubic.InOut)
    .interpolation(Phaser.Math.bezierInterpolation)
    .repeat(-1)
    .start();
}
