var lT = new Date().getTime();
var dT;

//Player Animations
var deadAnim = new Animation("deadAnim", 1, 2);
var walkAnim = new Animation("walkAnim", 1, 20);
var idleAnim = new Animation("idleAnim", 38, 58);
var healAnim = new Animation("healAnim", 59, 70);
var attackAnim = new Animation("attackAnim", 100, 120);


//Boss Animations
var bossIdleAnim = new Animation("bossIdleAnim", 0, 57);
var bossFireballAnim = new Animation("bossFireballAnim", 58, 122);
var bossFireballFinishAnim = new Animation("bossFireballFinishAnim", 123, 156);
var bossFirestormAnim = new Animation("bossFirestormAnim", 157, 267);
var bossFirecrushAnim = new Animation("bossFirecrushAnim", 268, 361);
var bossDead = new Animation("bossDead", 360, 361);

//Delta
var clock = new THREE.Clock();
var delta;

var hazardGeo, hazardMat;
var playerGeo, playerMat;

function StoreHazardMeshes() {
	new THREE.JSONLoader().load( "Models/HazardZone/hazardzone.js", function( geometry, materials ) {
	
		var material = materials[0];
		
		hazardMat = new THREE.MeshFaceMaterial( materials );
		
		hazardGeo = geometry;
	});
};
function StorePlayerMeshes() {
	new THREE.JSONLoader().load( "Models/PCs/male/male.js", function( geometry, materials ) {
	
		var material = materials[0];
		material.morphTargets = true;
		
		playerMat = new THREE.MeshFaceMaterial( materials );
		
		playerGeo = geometry;
		
		console.log("Loaded Player Model, ready to connect...");
		ReadyToConnect();
	});
};

function PhysicsLoop() {
	var cT = new Date().getTime();
	dT = cT - lT;

	//Move Player
	HandleInput();
	
	//Collisions
	HandleCollisions();
	
	//Update Server
	socket.emit('RESPOND', players[apIndex].loc.get(), players[apIndex].rot.get() );
	
	//Update Other Players
	UpdatePlayers();
	
	//Update Render
	DrawBars();
	webglRenderer.render( scene, camera );
	
	lT = cT;
	requestAnimationFrame(PhysicsLoop);
}

function UpdatePlayers() {
	delta = clock.getDelta();
	
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
				players[i].update(walkAnim, delta);
			else if (players[i].justHealed)
				players[i].update(healAnim, delta);
			else if (players[i].justAttacked)
				players[i].update(attackAnim, delta);
			else
				players[i].update(idleAnim, delta);
				
			if (players[i].health == 0)
				players[i].update(deadAnim, delta);
		}
	}
	
	if (boss.readyState == true && boss.onScreen == false)
	{
		scene.add(boss.model);
		boss.onScreen = true;
	}
	else if (boss.onScreen)
	{
		if (boss.health == 0)
			boss.update(bossDead);
		else if (boss.justCast == true)
			boss.update(bossFireballFinishAnim);
		else if (boss.isCasting == 0)
			boss.update(bossIdleAnim);
		else if (boss.isCasting == 1)
			boss.update(bossFireballAnim);
		else if (boss.isCasting == 2)
			boss.update(bossFirestormAnim);
		else if (boss.isCasting == 3)
			boss.update(bossFirecrushAnim);
	}
	
	for (var i = 0; i < hazards.length; i++)
	{
		if (hazards[i].readyState == true)
		{
			hazards[i].update(delta);
			
			if (hazards[i].aliveTime <= 0)
			{
				scene.remove(hazards[i].model);
				hazards.splice(i,1);
			}
		}
	}
}

function HandleInput()
{
	if (players[apIndex].health > 0)
	{
		players[apIndex].loc = new Vector3(players[apIndex].loc.x + ((joystick.deltaX()/500)*dT), 0, players[apIndex].loc.z + ((joystick.deltaY()/500)*dT));
		camera.position = new Vector3(players[apIndex].loc.x, players[apIndex].loc.y + 90, players[apIndex].loc.z + 90);
		players[apIndex].rot.y = joystick.rotation();
	}
}

function HandleCollisions()
{
		for (var j = 0; j < hazards.length; j++)
		{
			if ( Math.pow(players[apIndex].loc.x - hazards[j].loc.x,2) + Math.pow(hazards[j].loc.z - players[apIndex].loc.z,2) <= Math.pow(hazards[j].rad + players[apIndex].rad,2) )
			{
				players[apIndex].inAOE = true;
				break;
			}
			else
				players[apIndex].inAOE = false;
		}
}