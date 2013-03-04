function HazardZone (setLoc, setRad, setGeo, setMat) {
	this.loc = new Vector3(setLoc.x, setLoc.y, setLoc.z);
	this.rad = setRad;
	
	this.model = new THREE.Mesh( setGeo, setMat );
	
	this.readyState = false;
	
	this.aliveTime = 6;

	this.model.position.set(this.loc.x, this.loc.y, this.loc.z);
	this.model.scale.set(40,40,40);
		
	scene.add(this.model);
		
	this.readyState = true;
	
	this.update = function(delta) {
		this.aliveTime -= delta;
	};
}