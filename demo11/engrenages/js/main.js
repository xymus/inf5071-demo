// Variables globales
var scene;
var camera;
var distance = 5;

// Les 2 engranages
var gears = [];

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
	//camera.position.set(0, 2 * distance / 3, distance);
	camera.position.set(0, 0, distance);
	camera.lookAt(scene.position);
	scene.add(camera);

	// Chargement des engrenages
	var loader = new THREE.JSONLoader();
	loader.load(
		'assets/engranage.json',
		function (geometry, materials) {
			var material = new THREE.MeshNormalMaterial( { shading: THREE.SmoothShading } );

			gears[0] = new THREE.Mesh(geometry, material);
			gears[1] = new THREE.Mesh(geometry, material);

			// Tourner pour rotation sur l'axe X
			gears[0].rotation.z += 0.5 * Math.PI;
			gears[1].rotation.z += 0.5 * Math.PI;

			// Distancer et "fitter" les 2 engrenages ensembles
			gears[0].position.y -= 0.9;
			gears[1].position.y += 0.9;
			gears[0].rotation.x -= 0.08 * Math.PI;

			scene.add(gears[0]);
			scene.add(gears[1]);
		}
	);
}

function animateScene() {

	// Les engrenages tournent
	for (i in gears) {
		var gear = gears[i];

		var dir = i == 0? -1: 1; // Tournent en sens inverse
		gear.rotation.x += 0.01 * Math.PI * dir;
	}

	// Camera
	var timer = new Date().getTime() * 0.0006;
	camera.position.x = -distance * Math.cos(timer);
	camera.position.z = distance * Math.sin(timer);
	camera.lookAt(scene.position);

	requestAnimationFrame(animateScene);
	renderScene();
}

function renderScene(){
	renderer.render(scene, camera);
}
