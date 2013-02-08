function Boss() {
	var healthPoints = 1000;
	var isCasting = 0; //0 not casting - 1 casting fireball - 2 casting firestorm - 3 casting firecrush
	var justCast = false;
	
	var CastAbility = function() {
		return Math.floor((Math.random()*3)+1);
	}
}

module.exports.Boss = Boss;