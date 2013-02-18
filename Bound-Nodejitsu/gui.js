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
	console.log("Clicky");
	var x	= event.clientX;
	var y	= event.clientY;
	
	for (var i = 0; i < players.length; i++)
	{
		if (x > 5 && x < (SCREEN_WIDTH/8)+5)
			if (y > ((SCREEN_HEIGHT/10)*i)+5 && y < ( (((SCREEN_HEIGHT/10)*i)+5) + (SCREEN_HEIGHT/20) ))
			{
				if (players[apIndex].justHealed == false && players[i].health < 100)
				{
						socket.emit('HEAL_PLAYER', players[i].name);
						players[apIndex].justHealed = true;
				}
			}
	}
};

var HandleTouchDown = function(event) {
	event.preventDefault();
	console.log("Clicky");
	var x	= event.touches[0].pageX;
	var y	= event.touches[0].pageY;
	
	for (var i = 0; i < players.length; i++)
	{
		if (x > 5 && x < (SCREEN_WIDTH/8)+5)
			if (y > ((SCREEN_HEIGHT/10)*i)+5 && y < ( (((SCREEN_HEIGHT/10)*i)+5) + (SCREEN_HEIGHT/20) ))
			{
				if (players[apIndex].justHealed == false && (players[i].health < 100 && players[i].health > 0))
				{
						socket.emit('HEAL_PLAYER', players[i].name);
						players[apIndex].justHealed = true;
				}
				else if (players[i].health == 0 && players[apIndex].justRezzed == false)
				{
					socket.emit ('REZ_PLAYER', players[i].name);
					players[apIndex].justRezzed = true;
				}
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