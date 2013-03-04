var players = new Array();
var boss;
var hazards = new Array();
var apIndex;

//Socket.IO
var socket = io.connect();

socket.on('connect', function () {
	socket.on('CON_ACCEPT', function(getPlayers, bossHP) {
		
		for (var i = 0; i < getPlayers.length; i++)
		{
			players.push(new Player("Models/PCs/male/male.js", new Vector3(getPlayers[i].X,getPlayers[i].Y,getPlayers[i].Z), new Vector3(0,getPlayers[i].R,0), getPlayers[i].USERNAME, getPlayers[i].HP));
			if (getPlayers[i].USERNAME == playerName)
			{
				apIndex = i;
			}
		}
		
		boss = new Boss("Models/Boss/boss.js", bossHP);
		
		socket.emit('REGISTER', playerName);
		init();
	});
});

socket.on('PLAYER_LEFT' , function(plIndex) {
	scene.remove(players[plIndex].model);
	players.splice(plIndex,1);
	
	apIndex = findWithAttr(players, 'name', playerName);
	console.log("Player left: New apIndex is: " + apIndex);
});

socket.on('UPDATE', function(getPlayers, bossHP) {
	for (var i = 0; i < getPlayers.length; i++)
	{	
		if (players[i] == undefined)
		{
			players.push(new Player("Models/PCs/male/male.js", new Vector3(getPlayers[i].X,getPlayers[i].Y,getPlayers[i].Z), new Vector3(0,getPlayers[i].R,0), getPlayers[i].USERNAME, getPlayers[i].HP));
		}
			
		if (i != apIndex)
		{
			players[i].loc = new Vector3(getPlayers[i].X, getPlayers[i].Y, getPlayers[i].Z);
			players[i].rot.y = getPlayers[i].R;
			players[i].justAttacked = getPlayers[i].justAttacked;
			players[i].justHealed = getPlayers[i].justHealed;
			players[i].justRezzed = getPlayers[i].justRezzed;
		}
		players[i].health = getPlayers[i].HP;
	}
	boss.health = bossHP;
});

socket.on('BOSS_CAST', function(castAbility, targetData) {	
	switch(castAbility)
	{
		case 1:
			boss.fireBallTarget = players[targetData];
		break;
		
		case 2:
			boss.castLocations = targetData;
			for (var i = 0; i < targetData.length; i++)
			{
				hazards.push(new HazardZone(targetData[i], 25, hazardGeo, hazardMat));
			}
		break;
		
		case 3:
			boss.castLocations = targetData;
		break;
	}
	
	boss.isCasting = castAbility;
});

socket.on('disconnect', function() {
	console.log("Lost connection to server: You may have logged in from another location, or the server has terminated.");
	window.history.back(-1);
});

//Search JSON Array for Matching Attribute, return index
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
	return -1;
}