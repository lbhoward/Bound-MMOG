function Vector3(setx, sety, setz){
	this.x = setx || 0;
	this.y = sety || 0;
	this.z = setz || 0;
	
	this.get = function(){
		return {x:this.x,y:this.y,z:this.z};
	};
	
	this.set = function(setx, sety, setz){
		this.x = setx;
		this.y = sety;
		this.z = setz;
	};
	
	this.Cross = function(B) {
		return new Vector3((this.y*B.z)-(this.z*B.y),(this.z*B.x)-(this.x*B.z),(this.x*B.y)-(this.y*B.x));
	};
	
	this.Dot = function(B) {
		console.log((this.x*B.x) + (this.y*B.y) + (this.z*B.z));
		return (this.x*B.x) + (this.y*B.y) + (this.z*B.z);
	};
	
	this.Length = function() {
		//console.log(Math.sqrt((this.x*this.x)+(this.y*this.y)+(this.z*this.z)));
		return Math.sqrt((this.x*this.x)+(this.y*this.y)+(this.z*this.z));
	};
};