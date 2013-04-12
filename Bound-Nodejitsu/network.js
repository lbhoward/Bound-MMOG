var players = new Array();
var boss;
var hazards = new Array();
var apIndex;
var socket;

//Socket.IO
function ReadyToConnect() {
socket = io.connect();

socket.on('connect', function () {
	socket.on('CON_ACCEPT', function(getPlayers, bossHP) {
		
		players.push(new Player(playerGeo, playerMat, new Vector3(getPlayers[0].X,getPlayers[0].Y,getPlayers[0].Z), new Vector3(0,getPlayers[0].R,0), getPlayers[0].USERNAME, 100, false));

		apIndex = 0;
		
		if (playerName != "lbhoward")
		for (var i = 0; i < 19; i++)
		{
			players.push(new Player(playerGeo, playerMat, new Vector3(getPlayers[0].X,getPlayers[0].Y,getPlayers[0].Z), new Vector3(0,getPlayers[0].R,0), "botNo" + i, 100, true));
		}
		
		boss = new Boss("Models/Boss/boss.js", bossHP);
		
		socket.emit('REGISTER', playerName);
		socket.emit('DETAILS', playerName, SCREEN_WIDTH, SCREEN_HEIGHT);
		init();
	});
});

socket.on('PLAYER_LEFT' , function(plIndex) {
	scene.remove(players[plIndex].model);
	players.splice(plIndex,1);
	
	apIndex = findWithAttr(players, 'name', playerName);
	console.log("Player left: New apIndex is: " + apIndex);
});

socket.on('DEACT', function() {
	for (var i = 0; i < players.length; ++i)
		players[i].health = 100;
});

socket.on('SWITCH_BARS', function() {
	GUIState = 0;
});
socket.on('SWITCH_CIRCS', function() {
	GUIState = 1;
});
socket.on('SWITCH_SQUARES', function() {
	GUIState = 2;
});

socket.on('UPDATE', function(getPlayers, bossHP) {
	for (var i = 0; i < getPlayers.length; i++)
	{	
	}
	boss.health = bossHP;
});

socket.on('BOSS_CAST', function(castAbility, targetData) {	
	switch(castAbility)
	{
		case 1:
			for (var i = 0; i < 3; ++i)
			{
				pHP = players[targetData[i]].health;
				players[targetData[i]].health -= Math.floor((Math.random()*30));
				var time = new Date();
				socket.emit('LOG', "DAM:"+players[targetData[i]].name+":"+pHP+":"+players[targetData[i]].health + ":" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "\n");
			}
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
}

//Search JSON Array for Matching Attribute, return index
function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
	return -1;
}