function Player(setGeo, setMat, setLoc, setRot, setName, setHP, setBot){
	//Location and rotation vectors
	this.loc = new Vector3(setLoc.x, setLoc.y, setLoc.z) || new Vector3();
	this.rot = new Vector3(setRot.x, setRot.y, setRot.z) || new Vector3();
	//3D graphical model
	this.model = new THREE.SkinnedMesh( setGeo, setMat );
	this.model.scale.set(10,10,10);
	this.pistol = 0;
	this.readyState = false; this.onScreen = false;
	//Identifier
	this.name = setName;
	this.health = setHP; this.damageTimer = 0; this.inAOE = false;
	this.healTimer = 1; this.justHealed = false;
	this.attackTimer = 1.0; this.justAttacked = false;
	this.rezTimer = 120; this.justRezzed = false;
	this.rad = 15;
	this.target = "";
	this.actionState = 0;
	this.damaged = false;
	this.Bot = setBot;
	
	//Animation Stuff
	this.clock = new THREE.Clock();
	this.t = 0;
	this.currentFrame = 0; this.lastFrame = 0; this.previousAnim = 0;
	
	this.readyState = true;
		
	this.update = function(animation, delta) {
		this.model.position.set(this.loc.x, this.loc.y, this.loc.z);
		this.model.rotation.y = this.rot.y;

		this.damageTimer -= delta;
		
		if (this.justHealed)
		{
			this.healTimer -= delta;
			
			if (this.healTimer <= 0)
			{
				this.healTimer = 1;
				this.justHealed = false;
				socket.emit('END_ANIM', this.name, 1);
			}
		}
		if (this.justAttacked)
		{
			this.attackTimer -= delta;
			
			if (this.attackTimer <= 0)
			{
				this.attackTimer = 1.0;
				this.justAttacked = false;
				socket.emit('END_ANIM', this.name, 2);
			}
		}
		if (this.justRezzed)
		{
			this.rezTimer -= delta;
			
			if (this.rezTimer <= 0)
			{
				this.rezTimer = 20;
				this.justRezzed = false;
				socket.emit('END_ANIM', this.name, 3);
			}
		}
			
		if (this.damageTimer <= 0)
		{
			if (this.inAOE == true)
			{
				this.damaged = true;
				this.health -= 10;
				this.damageTimer = 1.25;
			}
			else
				this.damageTimer = 0;
		}
		
		if (animation.animType != this.previousAnim)
			this.currentFrame = animation.startFrame;
		
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