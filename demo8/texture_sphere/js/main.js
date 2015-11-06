// Variables globales
var scene; 
var camera; 
var distance = 15;
var uniforms;

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
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 1000); 
    camera.position.set(0, distance / 2, distance); 
    camera.lookAt(scene.position); 
    scene.add(camera); 

    // Sphère
    geometry = new THREE.SphereGeometry(5, 32, 32);

    // Chargement des shaders
    var vertexShader = document.getElementById("shader-vs").innerHTML; 
    var fragmentShader = document.getElementById("shader-fs").innerHTML; 

    // Chargement des uniformes
    uniforms = {
		texture: {type: "t", value: THREE.ImageUtils.loadTexture("assets/bright-sky.jpg")}
    };

    // Chargement du matériel
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
		side: THREE.DoubleSide
    });

    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
} 

function animateScene() { 
    var timer = new Date().getTime() * 0.0005;
    camera.position.x = -distance * Math.cos(timer);
    camera.position.z = distance * Math.sin(timer);

    camera.lookAt(scene.position); 
    requestAnimationFrame(animateScene); 
    renderScene(); 
} 

function renderScene(){ 
    renderer.render(scene, camera); 
} 
