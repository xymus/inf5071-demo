// Variables globales
var scene; 
var camera; 
var distance = 1;

// Initialisation de la scène
initializeScene(); 

// Animation de la scène
animateScene(); 

function initializeScene(){ 
    // Initialisation du canvas
    renderer = new THREE.WebGLRenderer({antialias: true}); 
    renderer.setClearColor(0x000000, 1); 
    canvasWidth = 800; 
    canvasHeight = 600; 
    renderer.setSize(canvasWidth, canvasHeight); 
    document.getElementById("canvas").appendChild(renderer.domElement); 

    // Initialisation de la scène et de la caméra
    scene = new THREE.Scene(); 
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 0.1, 100); 
    camera.position.set(0, 2.0, 0); 
    camera.up = new THREE.Vector3(0, 2, 0);
    scene.add(camera); 

    // De la lumière
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 100, 0);
    scene.add(directionalLight);
    var ambientLight = new THREE.AmbientLight(0xF0F0F0);
    scene.add(ambientLight); 


    // Chargement du plancher
    var loader = new THREE.JSONLoader();
    loader.load('assets/floor.json', function(geometry, materials) {
        var meshMaterial = new THREE.MeshFaceMaterial(materials);
        for (var i = 0; i < materials.length; ++i) {
            materials[i].side = THREE.DoubleSide;
        }
        var mesh = new THREE.Mesh(geometry, meshMaterial);
        scene.add(mesh);
    });

    // Chargement des murs
    loader = new THREE.JSONLoader();
    loader.load('assets/walls.json', function(geometry, materials) {
        var meshMaterial = new THREE.MeshFaceMaterial(materials);
        for (var i = 0; i < materials.length; ++i) {
            materials[i].side = THREE.DoubleSide;
        }
        var mesh = new THREE.Mesh(geometry, meshMaterial);
        scene.add(mesh);
    });
} 

// Keyboard interaction
document.onkeydown = function(e) {
    console.log(camera.quaternion);
    switch (e.keyCode) {
        case 37: // Left arrow
            tweenYRotation(0.25*Math.PI);
            break;
        case 39: // Right arrow
            tweenYRotation(-0.25*Math.PI);
            break;
        case 38: // Up arrow
            tweenZMove(-3.0);
            break;
        case 40: // Down arrow
            tweenZMove(3.0);
            break;
        case 85: // U key
            camera.position.y += 0.5;
            break;
        case 68: // D key
            camera.position.y -= 0.5;
            break;
    }
};

// Tweening move
function tweenZMove(deltaZ) {
    (function() {
        var params = {t: 0};
        var prevD = 0.0;
        new TWEEN.Tween(params).to({t: 1}, 300).onUpdate(function () {
            var d = params.t - prevD;
            prevD = params.t;
            camera.translateZ(deltaZ*d);
        }).start();
    }).call(this);
}

// Tweening rotation
function tweenYRotation(deltaY) {

    (function() {
        var params = {y: camera.rotation.y};
        new TWEEN.Tween(params).to({y: camera.rotation.y + deltaY}, 300).onUpdate(function () {
            camera.rotation.y = params.y;
        }).start();
    }).call(this);
}

function animateScene() { 
    var timer = new Date().getTime();
    TWEEN.update();
    requestAnimationFrame(animateScene); 
    renderScene(); 
} 

function renderScene(){ 
    renderer.render(scene, camera); 
} 
