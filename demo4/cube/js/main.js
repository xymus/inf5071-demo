// Variables globales
var scene; 
var camera; 
var distance = 5;

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
    camera = new THREE.PerspectiveCamera(45, canvasWidth / canvasHeight, 1, 100); 
    camera.position.set(0, 2 * distance / 3, distance); 
    camera.lookAt(scene.position); 
    scene.add(camera); 

    // Création du sol
    var floorGeometry = new THREE.Geometry(); 
    floorGeometry.vertices.push(new THREE.Vector3(-5.0, 0.0,  5.0)); 
    floorGeometry.vertices.push(new THREE.Vector3( 5.0, 0.0,  5.0)); 
    floorGeometry.vertices.push(new THREE.Vector3( 5.0, 0.0, -5.0)); 
    floorGeometry.vertices.push(new THREE.Vector3(-5.0, 0.0, -5.0)); 
    floorGeometry.faces.push(new THREE.Face3(0, 1, 2)); 
    floorGeometry.faces.push(new THREE.Face3(0, 2, 3)); 
    var floorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0x202020, 
        side: THREE.DoubleSide,
    }); 
    var floorMesh = new THREE.Mesh(floorGeometry, floorMaterial); 
    floorMesh.position.set(0, 0, 0); 
    scene.add(floorMesh); 

    // Création du cube
    var boxGeometry = new THREE.BoxGeometry(1, 1, 1); 
    var boxMaterials = [ 
        new THREE.MeshBasicMaterial({color: 0xFF0000}), 
        new THREE.MeshBasicMaterial({color: 0x00FF00}), 
        new THREE.MeshBasicMaterial({color: 0x0000FF}), 
        new THREE.MeshBasicMaterial({color: 0xFFFF00}), 
        new THREE.MeshBasicMaterial({color: 0x00FFFF}), 
        new THREE.MeshBasicMaterial({color: 0xFF00FF}) 
    ]; 
    var boxMaterial = new THREE.MeshFaceMaterial(boxMaterials); 
    boxMesh = new THREE.Mesh(boxGeometry, boxMaterial); 
    boxMesh.position.set(0, 0.5, 0); 
    scene.add(boxMesh); 
} 

function animateScene() { 
    var timer = new Date().getTime() * 0.0002;
    camera.position.x = -distance * Math.cos(timer);
    camera.position.z = distance * Math.sin(timer);
    camera.lookAt(scene.position); 
    requestAnimationFrame(animateScene); 
    renderScene(); 
} 

function renderScene(){ 
    renderer.render(scene, camera); 
} 
