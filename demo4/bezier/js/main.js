var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
               {preload: preload, create: create});

function preload() {
    
    game.load.image('light', 'assets/light.png');
}

function create() {

    // Arriere plan
    game.stage.backgroundColor = '#ffffff';

    // Sprites
    var sprite = game.add.sprite(100, 100, 'light');
    sprite.anchor.set(0.5, 0.5)
    sprite.tint = 0xff0000

    // Tweens
    var tween = game.add.tween(sprite).to({
    x: [100, 600, 200, 700],
    y: [100, 100, 500, 500],
    }, 5000, Phaser.Easing.Quadratic.InOut, true).interpolation(function(v, k){
        return Phaser.Math.bezierInterpolation(v, k);
    });
    tween.repeat(-1);
    tween.start();
}
