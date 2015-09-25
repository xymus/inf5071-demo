var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
               {preload: preload, create: create, update: update});

function preload() {
    
    // Charge la spritesheet de 4 images à 64x64 pixels
    game.load.spritesheet('flame', 'drawing.png', 64, 64, 4);
}

function create() {

    // Arriere blanc
    game.stage.backgroundColor = '#ffffff';

    // Sprite pour la flame
    var flame = game.add.sprite(200, 200, 'flame');

    // La seule animation de la flame
    var idle = flame.animations.add('idle');

    // Lancer l'animation à 15 fps et répétition
    flame.animations.play('idle', 15, true);
}
