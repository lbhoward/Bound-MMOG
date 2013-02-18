function HazardZone (setLoc, setRad) {
	this.loc = new Vector3(setLoc.x, setLoc.y, setLoc.z);
	this.rad = setRad;
	
	this.model = 0;
	
	this.readyState = false;
	
	var currentPlayer = this;
	
	this.aliveTime = 6;
	
	new THREE.JSONLoader().load( "Models/HazardZone/hazardzone.js", function( geometry, materials ) {
	
		var material = materials[0];
		
		var faceMaterial = new THREE.MeshFaceMaterial( materials );
		
		currentPlayer.model = new THREE.Mesh( geometry, faceMaterial );
		currentPlayer.model.position.set(currentPlayer.loc.x, currentPlayer.loc.y, currentPlayer.loc.z);
		currentPlayer.model.scale.set(40,40,40);
		
		scene.add(currentPlayer.model);
		
		currentPlayer.readyState = true;
	});
	
	this.update = function(delta) {
		this.aliveTime -= delta;
	};
}