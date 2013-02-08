var lT = new Date().getTime();
var dT;

//Player Animations
var walkAnim = new Animation("walkAnim", 1, 20);
var idleAnim = new Animation("idleAnim", 38, 58);

//Boss Animations
var bossIdleAnim = new Animation("bossIdleAnim", 0, 57);
var bossFireballAnim = new Animation("bossFireballAnim", 58, 122);
var bossFireballFinishAnim = new Animation("bossFireballFinishAnim", 122, 156);
var bossFirestormAnim = new Animation("bossFirestormAnim", 157, 267);
var bossFirecrushAnim = new Animation("bossFirecrushAnim", 268, 361);

function PhysicsLoop() {
	var cT = new Date().getTime();
	dT = cT - lT;

	//Move Player
	HandleInput();
	
	//Update Server
	socket.emit('RESPOND', players[apIndex].loc.get(), players[apIndex].rot.get());
	
	//Update Other Players
	UpdatePlayers();
	
	//Update Render
	webglRenderer.render( scene, camera );

	lT = cT;
	requestAnimationFrame(PhysicsLoop);
}

function UpdatePlayers() {
	for (var i = 0; i < players.length; i++)
	{
		if (players[i].readyState == true && players[i].onScreen == false)
		{
			console.log("Loading new Player to Screen");
			scene.add(players[i].model);
			players[i].onScreen = true;
		}
		else if (players[i].onScreen)
		{
			if ((players[i].model.position.x != players[i].loc.x) || (players[i].model.position.y != players[i].loc.y) || (players[i].model.position.z != players[i].loc.z))
				players[i].update(walkAnim);
			else
				players[i].update(idleAnim);
		}
	}
	
	if (boss.readyState == true && boss.onScreen == false)
	{
		scene.add(boss.model);
		boss.onScreen = true;
	}
	else if (boss.onScreen)
	{
		if (boss.justCast == true)
		{
			boss.update(bossFireballFinishAnim);
		}
		else if (boss.isCasting == 0)
			boss.update(bossIdleAnim);
		else if (boss.isCasting == 1)
			boss.update(bossFireballAnim);
		else if (boss.isCasting == 2)
			boss.update(bossFirestormAnim);
		else if (boss.isCasting == 3)
			boss.update(bossFirecrushAnim);
	}
}

function HandleInput()
{
	players[apIndex].loc = new Vector3(players[apIndex].loc.x + ((joystick.deltaX()/500)*dT), 0, players[apIndex].loc.z + ((joystick.deltaY()/500)*dT));
	camera.position = new Vector3(players[apIndex].loc.x, players[apIndex].loc.y + 90, players[apIndex].loc.z + 90);
	players[apIndex].rot.y = joystick.rotation();
}