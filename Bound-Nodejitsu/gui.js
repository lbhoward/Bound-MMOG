var healIcon = new Image(); healIcon.src = '/Icons/Heal.png';
var attackIcon = new Image(); attackIcon.src = '/Icons/Attack.png';
var rezIcon = new Image(); rezIcon.src = '/Icons/Rez.png';

var iconSize = SCREEN_HEIGHT/6;
var iconX = SCREEN_WIDTH-iconSize;

var healTimeFill = iconSize;
var attackTimeFill = iconSize;
var rezTimeFull = iconSize;

var lineWidth = 10;
var radius = SCREEN_HEIGHT / 20;
var calcRadius = radius+(lineWidth*2);

//0: Bars   1: Circles
var GUIState = 1;

function SetupTouch() {
	var el = document.getElementById('container');
	
	el.addEventListener("mousedown", HandleMouseDown, false);
	el.addEventListener("touchstart", HandleTouchDown, false);
};

document.onkeypress=function(e) {
	if (e.charCode == 52) //Radius Increase 4 
		radius += 1;
	if (e.charCode == 49) //Radius Decrease 1
		radius -= 1;
		
	if (e.charCode == 54) //Width Increase 6
		lineWidth += 1;
	if (e.charCode == 51) //Width Decrease 3
		lineWidth -= 1;
		
	if (e.charCode == 53) //Print Values 5
		console.log("Radius: " + radius + " - Width: " + lineWidth);
}

var HandleMouseDown = function(event) {
	event.preventDefault();
	var x	= event.clientX;
	var y	= event.clientY;
	
	if (players[apIndex].health > 0)
	{
		if (players[apIndex].justHealed == false)
		{
			for (var i = 0; i < players.length; i++)
			{
				//Bars
				if (GUIState == 0)
				if (x > 5 && x < (SCREEN_WIDTH/8)+5)
					if (y > ((SCREEN_HEIGHT/10)*i)+5 && y < ( (((SCREEN_HEIGHT/10)*i)+5) + (SCREEN_HEIGHT/20) ))
					{
						if (players[i].health > 0 && players[i].health < 100)
						{	
							players[apIndex].target = players[i].name;
							players[apIndex].actionState = 1;
							
							players[apIndex].justHealed = true;
						}
						else if (players[apIndex].justRezzed == false && players[i].health == 0)
						{
							players[apIndex].target = players[i].name;
							players[apIndex].actionState = 2;
							
							players[apIndex].justRezzed = true;
						}
					}
					
				//Circles
				if (GUIState == 1)
				{
				var distanceX = x-calcRadius; var distanceY = y-(calcRadius+((calcRadius*2)*i));
				var distance = Math.sqrt((distanceX*distanceX) + (distanceY*distanceY));
				if (distance <= calcRadius)
					{
						if (players[i].health > 0 && players[i].health < 100)
						{	
							players[apIndex].target = players[i].name;
							players[apIndex].actionState = 1;
							
							players[apIndex].justHealed = true;
							
							personalLog.push(new Date().getHours(), new Date().getMinutes(), new Date().getSeconds(), players[i].name, players[i].health);
						}
						else if (players[apIndex].justRezzed == false && players[i].health == 0)
						{
							players[apIndex].target = players[i].name;
							players[apIndex].actionState = 2;
							
							players[apIndex].justRezzed = true;
						}
					}
				}
			}
		}
		
		if (players[apIndex].justAttacked == false)
			if (x > iconX && x < SCREEN_WIDTH)
				if (y > iconSize && y < iconSize*2)
					if (Math.sqrt(Math.pow((players[apIndex].loc.x-boss.loc.x),2)+Math.pow((players[apIndex].loc.y-boss.loc.y),2)+Math.pow((players[apIndex].loc.y-boss.loc.y),2)) < 55)
					{
						players[apIndex].actionState = 3;
							
						players[apIndex].justAttacked = true;
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
	
		if (players[apIndex].justAttacked == false)
		if (x > iconX && x < SCREEN_WIDTH)
			if (y > iconSize && y < iconSize*2)
			{
				socket.emit('HIT_BOSS');
				players[apIndex].justAttacked = true;
			}
};

function DrawBars() {
	ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

	//Player Standard Rectangle
	for (var i = 0; i < players.length; i++)
	{
		//HP Container (Stroke + Empty)
		ctx.beginPath();					
		ctx.rect(5, ((SCREEN_HEIGHT/10)*i)+5,
						SCREEN_WIDTH/8, SCREEN_HEIGHT/20);
		ctx.strokeStyle	= "#000000"; 
		ctx.lineWidth	= 1;
		ctx.fillStyle = 'rgba(0,255,0,0)';
		//ctx.fill();
		//ctx.stroke();
		
		//HP Bar (No Stroke + Fill)
		ctx.beginPath();					
		ctx.rect(5, ((SCREEN_HEIGHT/10)*i)+5,
						(SCREEN_WIDTH/8)*(players[i].health/100), SCREEN_HEIGHT/20);
		ctx.fillStyle = 'rgba(0,255,0,1)';
		//ctx.fill();
	}
	
	//Player Circle Arc  **LINEWIDTH MUST BE 2*RADIUS
	for (var i = 0; i < players.length; i++)
	{
		ctx.beginPath();
		ctx.strokeStyle	= 'rgba(0,255,0,1)'; 
		ctx.lineWidth = lineWidth;
		//context.arc(x, y, radius, startangle, endangle, anti-clockwise?);
		
		var endAngle = 6.28 * (players[i].health / 100);
		
		var centerX = calcRadius; var centerY = calcRadius+((calcRadius*2)*i);
		ctx.moveTo(centerX, centerY);
		ctx.arc(calcRadius, calcRadius+((calcRadius*2)*i), calcRadius, 0, endAngle, false );
		ctx.lineTo(centerX, centerY);
		//ctx.arc((SCREEN_HEIGHT/20)+(SCREEN_HEIGHT/40), SCREEN_HEIGHT/20+((SCREEN_HEIGHT/40)*i), SCREEN_HEIGHT/40, 0, endAngle, false);
		//ctx.arc(SCREEN_WIDTH/2, SCREEN_HEIGHT/2, radius, 0, endAngle, false);
		//ctx.stroke();
		//ctx.fill();
		ctx.closePath();
	}
	
	//Player Square
	for (var i = 0; i < players.length; i++)
	{
		//HP Container (Stroke + Empty)
		ctx.beginPath();					
		ctx.rect(5, ((calcRadius*2)*i)+5,
						calcRadius*2, calcRadius*2);
		ctx.strokeStyle	= "#000000"; 
		ctx.lineWidth	= 1;
		ctx.fillStyle = 'rgba(0,255,0,0)';
		ctx.fill();
		ctx.stroke();
		
		//HP Bar (No Stroke + Fill)
		ctx.beginPath();					
		ctx.rect(5, (calcRadius*2)+((calcRadius*2)*i)+5,
						calcRadius*2, -((calcRadius*2)*(players[i].health/100)));
		ctx.fillStyle = 'rgba(0,255,0,1)';
		ctx.fill();
	}
	
	//Boss Bar (Stroke + Empty)
	ctx.beginPath();
	ctx.rect( ((SCREEN_WIDTH/2) - (SCREEN_WIDTH/8)), 5,
				SCREEN_WIDTH/4, SCREEN_HEIGHT/16 );
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;
	ctx.fillStyle = 'rgba(255,0,0,0)';
	ctx.fill();
	ctx.stroke();
	
	//Boss Bar (No Stroke + Fill)
	ctx.beginPath()
	ctx.rect( ((SCREEN_WIDTH/2) - (SCREEN_WIDTH/8)), 5,
				(SCREEN_WIDTH/4)*(boss.health/100), SCREEN_HEIGHT/16 );
	ctx.fillStyle = 'rgba(255,0,0,1)';
	ctx.fill();
	
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