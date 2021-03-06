function Boss(modelPath, hp)
{
	this.loc = new Vector3();
	this.rot = new Vector3();
	
	this.model = 0;
	this.readyState = false; this.onScreen = false;
	
	//Game Variables
	this.health = hp;
	this.isCasting = 0; //0 not casting - 1 casting fireball - 2 casting firestorm - 3 casting firecrush
	this.justCast = false;
	
	//Ability Targets
	this.fireBallTarget = 0;
	this.castLocations = new Array();
	this.hazardZones = new Array();
	
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
		currentPlayer.model.scale.set(70,70,70);
		currentPlayer.readyState = true;
	});
	
	
	this.update = function(animation) {
		this.model.rotation.y = this.rot.y;
		
		if (animation.animType != this.previousAnim)
		{
			//Jump back to Start of newly request animation
			this.currentFrame = animation.startFrame;
			
			switch(animation.animType)
			{
				case "bossFireballFinishAnim":
					this.fireBall();
				break;
				
				case "bossFirestormAnim":
					this.fireStorm();
				break;
				
				case "bossFirecrushAnim":
					this.fireCrush();
				break;
			}
		}
		
		var delta = this.clock.getDelta();
		
			this.model.morphTargetInfluences[this.lastFrame] = 0;
			this.model.morphTargetInfluences[this.currentFrame] = 1;
			//var currentFrame = animation.startFrame + Math.floor(time*animation.totalFrames);
			//this.model.morphTargetInfluences[currentFrame] = 1;
			this.lastFrame = this.currentFrame;
			this.currentFrame++;
			
			//Idle Animation Loop
			if (this.isCasting == 0)
			{
				if (this.currentFrame >= animation.endFrame)
					this.currentFrame = animation.startFrame;
			}
			else
			{
				switch (this.isCasting)
				{
					case 1:
					{
						if (animation.animType == "bossFireballAnim" && this.currentFrame >= animation.endFrame)
						{
							this.justCast = true;
						}
						else if (animation.animType == "bossFireballFinishAnim" && this.currentFrame >= animation.endFrame)
						{
							console.log("The Fireball Animation has finished!");
							this.justCast = false;
							this.isCasting = 0;
						}
					}
					break;
					
					case 2:
					if (this.currentFrame >= animation.endFrame)
						this.isCasting = 0;
					break;
					
					case 3:
					if (this.currentFrame >= animation.endFrame)
						this.isCasting = 0;
					break;
				}
			}
		
		this.previousAnim = animation.animType;
	};
	
	this.fireBall = function() {
		console.log("The Boss casts Fireball at " + this.fireBallTarget.name + "!");
		socket.emit('TAKE_DAMAGE', this.fireBallTarget.name);
	};
	
	this.fireStorm = function() {
		console.log("The Boss casts Firestorm!");
	};
	
	this.fireCrush = function() {
		console.log("The Boss casts Firecrush!");
	};
};