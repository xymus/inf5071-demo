// Variables globales
var scene;
var camera;
var distance = 15;

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

	// Sphère et config
	var geometry = new THREE.Geometry();
	var w = 36;
	var h = 24;
	var r = 5.0;

	// Vertices
	var uvs = [];
	for (m = 0; m < w; m ++) {
		for (p = 0; p < h; p ++) {

			// Entre 0 et 2 pi
			var u = m * 2.0 * Math.PI / (w-1);

			// Entre 0 et pi
			var v = p * Math.PI / (h-1);

			// Coordonnées sur la spère
			var vec = new THREE.Vector3(
				r * Math.cos(u) * Math.sin(v),
				r * Math.cos(v),
				r * Math.sin(u) * Math.sin(v));
			geometry.vertices.push(vec);

			// Alternative, pas une spère
			//vec = new THREE.Vector3(
				//r * (1+Math.cos(v)) * Math.cos(u),
				//r * (1+Math.cos(v)) * Math.sin(u),
				//r * Math.sin(v));

			// UV entre 0 et 1 pour la texture
			uvs.push(new THREE.Vector2(m/(w-1), p/(h-1)));
		}
	}

	// Triangles
	for (m = 0; m < w-1; m ++) {
		for (p = 0; p < h-1; p ++) {
			var a = m*h + p;
			geometry.faces.push(new THREE.Face3(a, a+h, a+1));
			geometry.faces.push(new THREE.Face3(a+h, a+h+1, a+1));
		}
	}

	// Shaders
	var vertexShader = document.getElementById("shader-vs").innerHTML;
	var fragmentShader = document.getElementById("shader-fs").innerHTML;

	var uniforms = {
		texture: {type: "t", value: THREE.ImageUtils.loadTexture("assets/earth.jpg")}
	};

	var attributes = {
		uvs: {type: 'v2', value: uvs}
	};

	material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		attributes: attributes,
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
