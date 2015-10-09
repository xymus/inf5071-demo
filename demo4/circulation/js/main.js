var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game',
               {preload: preload, create: create});

function preload() {
    
    game.load.image('lumiere', 'assets/lumiere.png');
    game.load.image('arriere', 'assets/arriere.png');
}

function create() {

    // Arriere plan
    game.stage.backgroundColor = '#ffffff';
    var arriere = game.add.sprite(200, 140, 'arriere');
    arriere.anchor.set(0.5, 0.5)

    // Sprites des lumières
    var lumRouge = game.add.sprite(200, 100, 'lumiere');
    lumRouge.anchor.set(0.5, 0.5)
    lumRouge.tint = 0xff0000
    lumRouge.alpha = 0.0

    var lumJaune = game.add.sprite(200, 140, 'lumiere');
    lumJaune.tint = 0xffff00
    lumJaune.anchor.set(0.5, 0.5)
    lumJaune.alpha = 0.0

    var lumVert = game.add.sprite(200, 180, 'lumiere');
    lumVert.tint = 0x00ff00
    lumVert.anchor.set(0.5, 0.5)
    lumVert.alpha = 0.0

    // Config
    var alphaDelais = 500

    // Tweens

    // Rouge plein
    var tRouge = game.add.tween(lumRouge)
    .easing(Phaser.Easing.Sinusoidal.InOut)
    .to({alpha: 1.0}, alphaDelais)
    .to({},           4000,     Phaser.Easing.Linear.None)
    .to({alpha: 0.0}, alphaDelais)

    // Vert flash
    var tVertFlashant = game.add.tween(lumVert)
    .easing(Phaser.Easing.Sinusoidal.InOut)
    .to({alpha: 1.0}, alphaDelais)
    .to({alpha: 0.0}, alphaDelais)
    .repeatAll(2);

    // Vert plein
    var tVertPlein = game.add.tween(lumVert)
    .easing(Phaser.Easing.Sinusoidal.InOut)
    .to({alpha: 1.0}, alphaDelais)
    .to({},           5000,     Phaser.Easing.Linear.None)
    .to({alpha: 0.0}, alphaDelais)

    // Jaune plein
    var tJaune = game.add.tween(lumJaune)
    .easing(Phaser.Easing.Sinusoidal.InOut)
    .to({alpha: 1.0}, alphaDelais)
    .to({},           1000,     Phaser.Easing.Linear.None)
    .to({alpha: 0.0}, alphaDelais)

    // Enchaînement
    tRouge.chain(tVertFlashant)
    tVertFlashant.chain(tVertPlein)
    tVertPlein.chain(tJaune)
    tJaune.chain(tRouge)

    tRouge.start();
}
