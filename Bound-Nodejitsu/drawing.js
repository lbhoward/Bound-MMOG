var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var camera, scene;
var webglRenderer;

var GUI = document.createElement('canvas');
var ctx = GUI.getContext('2d');

var arenaModel, maleModel, bossModel;

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
	
	//Pre-load models
	StoreHazardMeshes();
	
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
	//loadJSONModel("Models/HazardZone/hazardzone.js", hazardModel, 10);
	
	camera.position = new Vector3(players[apIndex].loc.x, players[apIndex].loc.y + 90, players[apIndex].loc.z + 90);
	
	SetupTouch();
	
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