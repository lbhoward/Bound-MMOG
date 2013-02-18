var healIcon = new Image(); healIcon.src = '/Icons/Heal.png';
var attackIcon = new Image(); attackIcon.src = '/Icons/Attack.png';
var rezIcon = new Image(); rezIcon.src = '/Icons/Rez.png';

var iconSize = SCREEN_HEIGHT/6;
var iconX = SCREEN_WIDTH-iconSize;

var healTimeFill = iconSize;
var attackTimeFill = iconSize;
var rezTimeFull = iconSize;

function SetupTouch() {
	var el = document.getElementById('container');
	
	el.addEventListener("mousedown", HandleMouseDown, false);
	el.addEventListener("touchstart", HandleTouchDown, false);
};

var HandleMouseDown = function(event) {
	event.preventDefault();
	var x	= event.clientX;
	var y	= event.clientY;
	
	if (players[apIndex].justHealed == false)
	{
		for (var i = 0; i < players.length; i++)
		{
			if (x > 5 && x < (SCREEN_WIDTH/8)+5)
				if (y > ((SCREEN_HEIGHT/10)*i)+5 && y < ( (((SCREEN_HEIGHT/10)*i)+5) + (SCREEN_HEIGHT/20) ))
				{
					if (players[i].health > 0 && players[i].health < 100)
					{	
						socket.emit('HEAL_PLAYER', players[i].name);
						players[apIndex].justHealed = true;
					}
					else if (players[apIndex].justRezzed == false && players[i].health == 0)
					{
						socket.emit ('REZ_PLAYER', players[i].name);
						players[apIndex].justRezzed = true;
					}
				}
		}
	}
	
	var vector = new THREE.Vector3( x, y, 1);
	projector.unprojectVector(vector, camera);
	
	var subbedVector = vector.sub( camera.position )
	
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( scene.children );
	
	if ( intersects.length > 0 ) {
		for (var i = 0; i < intersects.length; i++)
			console.log("Total Intersections: " + intersects.length + " - Intersected: " + intersects[i].object.id);
	
		if ( intersects[0].object.id == boss.model.id )
		{
			socket.emit('HIT_BOSS');
			console.log("Picked the Boss");
		}
	}
};

var HandleTouchDown = function(event) {
	event.preventDefault();
	var x	= event.touches[0].pageX;
	var y	= event.touches[0].pageY;
	
	if (players[apIndex].justHealed == false)
	{
		for (var i = 0; i < players.length; i++)
		{
			if (x > 5 && x < (SCREEN_WIDTH/8)+5)
				if (y > ((SCREEN_HEIGHT/10)*i)+5 && y < ( (((SCREEN_HEIGHT/10)*i)+5) + (SCREEN_HEIGHT/20) ))
				{
					if (players[i].health > 1)
					{
						console.log("Players Health was: " + players[i].health);	
						socket.emit('HEAL_PLAYER', players[i].name);
						players[apIndex].justHealed = true;
					}
					else if (players[apIndex].justRezzed == false)
					{
						console.log("REZZING!");
						socket.emit ('REZ_PLAYER', players[i].name);
						players[apIndex].justRezzed = true;
					}
				}
		}
	}
	
	var vector = new THREE.Vector3( x, y, 1);
	projector.unprojectVector(vector, camera);
	
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	var intersects = raycaster.intersectObjects( scene.children );
	
	if ( intersects.length > 0 ) {
		if ( intersects[0].object == boss.model )
		{
			socket.emit('HIT_BOSS');
			console.log("Picked the Boss");
		}
	}
};

function DrawBars() {
	ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

	for (var i = 0; i < players.length; i++)
	{
		//HP Container (Stroke + Empty)
		ctx.beginPath();					
		ctx.rect(5, ((SCREEN_HEIGHT/10)*i)+5,
						SCREEN_WIDTH/8, SCREEN_HEIGHT/20);
		ctx.strokeStyle	= "#000000"; 
		ctx.lineWidth	= 1;
		ctx.fillStyle = 'rgba(0,255,0,0)';
		ctx.fill();
		ctx.stroke();
		
		//HP Bar (No Stroke + Fill)
		ctx.beginPath();					
		ctx.rect(5, ((SCREEN_HEIGHT/10)*i)+5,
						(SCREEN_WIDTH/8)*(players[i].health/100), SCREEN_HEIGHT/20);
		ctx.fillStyle = 'rgba(0,255,0,1)';
		ctx.fill();
	}
	
	DrawIcons();
};

function DrawIcons() {
	//Healing Icon
	ctx.drawImage(healIcon, iconX, 0, iconSize, iconSize);
	
	healTimeFill = iconSize * (players[apIndex].healTimer/1.5);
	
	ctx.beginPath();
	ctx.rect(iconX, 0, iconSize, healTimeFill);
	ctx.fillStyle = 'rgba(50,50,50,0.5)';
	ctx.fill();
	
	//Attacking Icon
	ctx.drawImage(attackIcon, iconX, iconSize, iconSize, iconSize);
	
	attackTimeFill = iconSize * (players[apIndex].attackTimer/1.0);
	
	ctx.beginPath();
	ctx.rect(iconX, iconSize, iconSize, attackTimeFill);
	ctx.fillStyle = 'rgba(50,50,50,0.5)';
	ctx.fill();
	
	//Rezzing Icons
	ctx.drawImage(rezIcon, iconX, iconSize*2, iconSize, iconSize);
	
	rezTimeFill = iconSize * (players[apIndex].rezTimer/120);
	
	ctx.beginPath();
	ctx.rect(iconX, iconSize*2, iconSize, rezTimeFill);
	ctx.fillStyle = 'rgba(50,50,50,0.5)';
	ctx.fill();
};