function Player(modelPath, setLoc, setRot, setName){
	//Location and rotation vectors
	this.loc = new Vector3(setLoc.x, setLoc.y, setLoc.z) || new Vector3();
	this.rot = new Vector3(setRot.x, setRot.y, setRot.z) || new Vector3();
	//3D graphical model
	this.model = 0;	//Initialise variable to 0 due to callback nature
	this.readyState = false; this.onScreen = false;
	//Identifier
	this.name = setName;
	
	//Animation Stuff
	this.clock = new THREE.Clock();
	this.t = 0;
	this.currentFrame = 0; this.lastFrame = 0; this.previousAnim = 0;
	
	var currentPlayer = this; //this. accessor for callback
		
	new THREE.JSONLoader().load( modelPath, function( geometry, materials ) {
	
		var material = materials[0];
		material.morphTargets = true;
		
		var faceMaterial = new THREE.MeshFaceMaterial( materials );
		
		currentPlayer.model = new THREE.SkinnedMesh( geometry, faceMaterial );
		currentPlayer.model.position.set(currentPlayer.loc.x, currentPlayer.loc.y, currentPlayer.loc.z);
		currentPlayer.model.scale.set(10,10,10);
		console.log("MODEL LOADED");
		currentPlayer.readyState = true;
	});
		
	this.update = function(animation) {
		this.model.position.set(this.loc.x, this.loc.y, this.loc.z);
		this.model.rotation.y = this.rot.y;
		
		if (animation.animType != this.previousAnim)
			this.currentFrame = animation.startFrame;
		
		var delta = this.clock.getDelta();
		
		var time = Date.now() * 0.001;
		
			this.model.morphTargetInfluences[this.lastFrame] = 0;
			this.model.morphTargetInfluences[this.currentFrame] = 1;
			//var currentFrame = animation.startFrame + Math.floor(time*animation.totalFrames);
			//this.model.morphTargetInfluences[currentFrame] = 1;
			this.lastFrame = this.currentFrame;
			this.currentFrame++;
			
			if (this.currentFrame >= animation.endFrame)
				this.currentFrame = animation.startFrame;
		
		this.previousAnim = animation.animType;
	};
};