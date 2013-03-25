var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var camera, scene;
var webglRenderer;

var GUI = document.createElement('canvas');
var ctx = GUI.getContext('2d');

var arenaModel, maleModel, bossModel;

window.onload = function PreLoadAssets() {
	//Pre-load models
	StoreHazardMeshes();
	StorePlayerMeshes();
}

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
	webglRenderer.domElement.style.position = "static";
	webglRenderer.domElement.id = "webGL";
	container.appendChild( webglRenderer.domElement );
	
	//GUI
	container.appendChild(GUI);
	GUI.style.position = "absolute";
	GUI.style.display = "";
	
	GUI.id = "GUI";
	GUI.width = SCREEN_WIDTH;
	GUI.height = SCREEN_HEIGHT;
	GUI.style.left = "0px";
	GUI.style.position.top = "0px";
	
	// joystick
	joystick = new VirtualJoystick({
		container	: document.getElementById('container'),
		mouseSupport	: true,
		width		:	SCREEN_WIDTH,
		height		:	SCREEN_HEIGHT
	});
	joystick._lastRotation = players[apIndex].rot.y;
	
	loadDAEModel("Models/Arena/Arena.dae", 40);
	
	camera.position = new Vector3(players[apIndex].loc.x, players[apIndex].loc.y + 90, players[apIndex].loc.z + 90);
	
	SetupTouch();
	
	if (players[apIndex].name == 'lbhoward')
	document.addEventListener('keydown', function(event) {
	if (event.keyCode == 49) //1
	{
		socket.emit('ACTIVATE_BOSS');
		console.log("ACTIVATING");
	}
	if (event.keyCode == 50) //2
	{
		socket.emit('DEACTIVATE_BOSS');
		console.log("DE-ACTIVATING");
	}
	if (event.keyCode == 81) //Q
		GUIState = 0;
	if (event.keyCode == 87) //W
		GUIState = 1;
	if (event.keyCode == 69) //E
		GUIState = 2;
	});
	
	PhysicsLoop();
}
function loadDAEModel(modelPath, scale) {
new THREE.ColladaLoader().load(modelPath,
		function(collada) {
			var model = collada.scene;
			model.scale.set(scale, scale, scale);
			model.rotation.x = -Math.PI/2;
			scene.add(model);
	});
}

function loadJSONModel(modelPath, assign, scale) {
new THREE.JSONLoader().load( modelPath, function( geometry, materials ) {
	
		var material = materials[0];
		material.morphTargets = true;
		
		var faceMaterial = new THREE.MeshFaceMaterial( materials );
		
		var model = new THREE.SkinnedMesh( geometry, faceMaterial );
		model.scale.set(scale,scale,scale);
		
		assign = model;
	});
}

//Search JSON Array for Matching Attribute, return index
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i++) {
        if(array[i][attr] === value)
            return i;
    }
}