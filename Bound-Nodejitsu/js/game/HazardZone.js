function HazardZone (setLoc, setRad) {
	this.loc = new Vector3(setLoc.x, setLoc.y, setLoc.z);
	this.rad = setRad;
	
	this.model = 0;
	this.readyState = false; this.onScreen = false;
	
	var currentPlayer = this;
	
	new THREE.JSONLoader().load( modelPath, function( geometry, materials ) {
	
		var material = materials[0];
		
		var faceMaterial = new THREE.MeshFaceMaterial( materials );
		
		currentPlayer.model = new THREE.Mesh( geometry, faceMaterial );
		currentPlayer.model.position.set(currentPlayer.loc.x, currentPlayer.loc.y, currentPlayer.loc.z);
		currentPlayer.model.scale.set(10,10,10);
		console.log("MODEL LOADED");
		currentPlayer.readyState = true;
	});
	
	this.alive = true;
}