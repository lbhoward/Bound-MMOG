var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var camera, scene;
var webglRenderer;

var GUI = document.createElement('div');
//var ctx = GUI.getContext('2d');

function init() {
	console.log("Initiliasing Bound... Please Wait...");
	
	// camera
	camera = new THREE.PerspectiveCamera( 70, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 100000 );
	camera.rotation.x = -0.5;

	//scene
	scene = new THREE.Scene();

	// lights
	var ambient = new THREE.AmbientLight( 0xffffff );
	scene.add( ambient );
	

	// renderer
	webglRenderer = new THREE.WebGLRenderer();
	webglRenderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	webglRenderer.domElement.style.position = "fixed";
	webglRenderer.domElement.id = "webGL";
	container.appendChild( webglRenderer.domElement );
	
	// joystick
	joystick = new VirtualJoystick({
		container	: document.getElementById('container'),
		mouseSupport	: true,
		width		:	SCREEN_WIDTH,
		height		:	SCREEN_HEIGHT
	});
	joystick._lastRotation = players[apIndex].rot.y;
	
	//GUI
	GUI.id = "GUI";
	GUI.width = SCREEN_WIDTH;
	GUI.height = SCREEN_HEIGHT;
	//ctx.beginPath(); 
	//ctx.strokeStyle	= "#BDBDBD"; 
	//ctx.lineWidth	= 6; 
	//ctx.arc( GUI.width/2, GUI.width/2, 40, 0, Math.PI*2, true); 
	//ctx.stroke();
	
	InitGUI(GUI);
	container.appendChild(GUI);
	GUI.style.position = "fixed";
	GUI.style.display = "";
	
	loadModel("Models/Arena/Arena.dae", 40);
	loadModel("Models/Skydome/Skydome.dae", 1000);
	
	PhysicsLoop();
}
function loadModel(modelPath, scale) {
new THREE.ColladaLoader().load(modelPath,
		function(collada) {
			var model = collada.scene;
			model.scale.set(scale, scale, scale);
			model.rotation.x = -Math.PI/2;
			scene.add(model);
			console.log(modelPath + ": Loaded");
	});
}

//Search JSON Array for Matching Attribute, return index
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i][attr] === value)
            return i;
    }
}