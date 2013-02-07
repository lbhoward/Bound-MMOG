function Boss(modelPath)
{
	this.loc = new Vector3();
	this.rot = new Vector3();
	
	this.model = 0;
	this.readyState = false; this.onScreen = false;
	
	this.HP = 0;
	
	//Animation Stuff
	this.clock = new THREE.Clock();
	this.t = 0;
	this.currentFrame = 0; this.lastFrame = 0;
	
	var currentPlayer = this; //this. accessor for callback

	new THREE.JSONLoader().load( modelPath, function( geometry, materials ) {
	
		var material = materials[0];
		material.morphTargets = true;
		
		var faceMaterial = new THREE.MeshFaceMaterial( materials );
		
		currentPlayer.model = new THREE.SkinnedMesh( geometry, faceMaterial );
		currentPlayer.model.position.set(currentPlayer.loc.x, currentPlayer.loc.y, currentPlayer.loc.z);
		currentPlayer.model.scale.set(70,70,70);
		console.log("MODEL LOADED");
		currentPlayer.readyState = true;
	});
	
	
	this.update = function(animation) {
		this.model.rotation.y = this.rot.y;
		
		animType = animation.animType;
		
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
		
		previousAnim = animation.animType;
	};
};