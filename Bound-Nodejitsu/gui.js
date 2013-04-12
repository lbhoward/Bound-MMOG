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
var calcRadius = radius;

//0: Bars   1: Circles   2: Squares
var GUIState = 0;

function SetupTouch() {
	var el = document.getElementById('container');
	
	el.addEventListener("mousedown", HandleMouseDown, false);
	el.addEventListener("touchstart", HandleTouchDown, false);
};

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
				if (i < 10)
				{
					var xPos = 5;
					var yOff = 0;
				}
			else
			{
				xPos = 10 + (SCREEN_WIDTH/8);
				yOff = SCREEN_HEIGHT;
			}
				//Bars
				if (GUIState == 0)
					if (x > xPos && x < (SCREEN_WIDTH/8)+xPos)
						if (y > (((SCREEN_HEIGHT/10)*i)+5)-yOff && y < ( ((((SCREEN_HEIGHT/10)*i)+5) + (SCREEN_HEIGHT/20))-yOff ))
					{
						if (players[i].health > 0 && players[i].health < 100)
						{	
							var pHP = players[i].health;
							players[i].health += 5;
							//HEAL:PreviousHP:NewHP:TIME
							var time = new Date();
							socket.emit('LOG', "HEAL:"+players[i].name+":"+pHP+":"+players[i].health + ":" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "\n");
							players[apIndex].justHealed = true;
						}
						else if (players[apIndex].justRezzed == false && players[i].health == 0)
						{
							players[i].health = 40;
							
							players[apIndex].justRezzed = true;
						}
					}
					
				//Circles
				if (GUIState == 1)
				{
				if (i < 10)
				{
					var distanceX = x-calcRadius; var distanceY = y-(calcRadius+((calcRadius*2)*i));
				}
				else
				{
					var distanceX = x-(calcRadius*3); var distanceY = y-(calcRadius+((calcRadius*2)*(i-10)));
				}

				var distance = Math.sqrt((distanceX*distanceX) + (distanceY*distanceY));
				if (distance <= calcRadius)
					{
						if (players[i].health > 0 && players[i].health < 100)
						{	
							var pHP = players[i].health;
							players[i].health += 15;
							//HEAL:PreviousHP:NewHP
							socket.emit('LOG', "HEAL:"+pHP+":"+players[i].health+"\n");
							players[apIndex].justHealed = true;
						}
						else if (players[apIndex].justRezzed == false && players[i].health == 0)
						{
							players[i].health = 40;
							
							players[apIndex].justRezzed = true;
						}
					}
				}
				
				//Squares
				if (GUIState == 2)
				{
					if (i < 10)
					{
						var xPos = 0;
						var yOff = 0;
					}
					else
					{
						xPos = calcRadius*2;
						yOff = SCREEN_HEIGHT;
					}
					
					ctx.rect(xPos, ((calcRadius*2)*i)-yOff,
					calcRadius*2, calcRadius*2);
					if (x > xPos && x < (calcRadius*2)+xPos)
						if (y > ((calcRadius*2)*i)-yOff && y < (calcRadius*2)+((calcRadius*2)*i)-yOff)
					{
						if (players[i].health > 0 && players[i].health < 100)
						{	
							var pHP = players[i].health;
							players[i].health += 10;
							//HEAL:PreviousHP:NewHP
							socket.emit('LOG', "HEAL:"+pHP+":"+players[i].health+"\n");
							players[apIndex].justHealed = true;
						}
						else if (players[apIndex].justRezzed == false && players[i].health == 0)
						{
							players[i].health = 40;
							
							players[apIndex].justRezzed = true;
						}
					}					
				}
			}
		}
	}
};

var HandleTouchDown = function(event) {
	event.preventDefault();
	var x	= event.touches[0].pageX;
	var y	= event.touches[0].pageY;
	
		if (players[apIndex].health > 0)
	{
		if (players[apIndex].justHealed == false)
		{
			for (var i = 0; i < players.length; i++)
			{
				if (i < 10)
				{
					var xPos = 5;
					var yOff = 0;
				}
			else
			{
				xPos = 10 + (SCREEN_WIDTH/8);
				yOff = SCREEN_HEIGHT;
			}
				//Bars
				if (GUIState == 0)
					if (x > xPos && x < (SCREEN_WIDTH/8)+xPos)
						if (y > (((SCREEN_HEIGHT/10)*i)+5)-yOff && y < ( ((((SCREEN_HEIGHT/10)*i)+5) + (SCREEN_HEIGHT/20))-yOff ))
					{
						if (players[i].health > 0 && players[i].health < 100)
						{	
							var pHP = players[i].health;
							players[i].health += 15;
							//HEAL:PreviousHP:NewHP:TIME
							var time = new Date();
							socket.emit('LOG', "HEAL:"+players[i].name+":"+pHP+":"+players[i].health + ":" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "\n");
							players[apIndex].justHealed = true;
						}
						else if (players[apIndex].justRezzed == false && players[i].health == 0)
						{
							players[i].health = 40;
							
							players[apIndex].justRezzed = true;
						}
					}
					
				//Circles
				if (GUIState == 1)
				{
				if (i < 10)
				{
					var distanceX = x-calcRadius; var distanceY = y-(calcRadius+((calcRadius*2)*i));
				}
				else
				{
					var distanceX = x-(calcRadius*3); var distanceY = y-(calcRadius+((calcRadius*2)*(i-10)));
				}

				var distance = Math.sqrt((distanceX*distanceX) + (distanceY*distanceY));
				if (distance <= calcRadius)
					{
						if (players[i].health > 0 && players[i].health < 100)
						{	
							var pHP = players[i].health;
							players[i].health += 15;
							//HEAL:PreviousHP:NewHP
							socket.emit('LOG', "HEAL:"+pHP+":"+players[i].health+"\n");
							players[apIndex].justHealed = true;
						}
						else if (players[apIndex].justRezzed == false && players[i].health == 0)
						{
							players[i].health = 40;
							
							players[apIndex].justRezzed = true;
						}
					}
				}
				
				//Squares
				if (GUIState == 2)
				{
					if (i < 10)
					{
						var xPos = 0;
						var yOff = 0;
					}
					else
					{
						xPos = calcRadius*2;
						yOff = SCREEN_HEIGHT;
					}
					
					ctx.rect(xPos, ((calcRadius*2)*i)-yOff,
					calcRadius*2, calcRadius*2);
					if (x > xPos && x < (calcRadius*2)+xPos)
						if (y > ((calcRadius*2)*i)-yOff && y < (calcRadius*2)+((calcRadius*2)*i)-yOff)
					{
						if (players[i].health > 0 && players[i].health < 100)
						{	
							var pHP = players[i].health;
							players[i].health += 15;
							//HEAL:PreviousHP:NewHP
							socket.emit('LOG', "HEAL:"+pHP+":"+players[i].health+"\n");
							players[apIndex].justHealed = true;
						}
						else if (players[apIndex].justRezzed == false && players[i].health == 0)
						{
							players[i].health = 40;
							
							players[apIndex].justRezzed = true;
						}
					}					
				}
			}
		}
		
		if (players[apIndex].justAttacked == false)
					if (Math.sqrt(Math.pow((players[apIndex].loc.x-boss.loc.x),2)+Math.pow((players[apIndex].loc.y-boss.loc.y),2)+Math.pow((players[apIndex].loc.y-boss.loc.y),2)) < 55)
					{
						players[apIndex].actionState = 3;
							
						players[apIndex].justAttacked = true;
					}
	}
};

function DrawBars() {
	ctx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

	//Player Standard Rectangle
	if (GUIState == 0)
	for (var i = 0; i < players.length; i++)
	{
		if (players[i].health < 0)
			players[i].health = 0;
		if (i < 10)
		{
			var xPos = 5;
			var yOff = 0;
		}
		else
		{
			xPos = 10 + (SCREEN_WIDTH/8);
			yOff = SCREEN_HEIGHT;
		}
	
		//HP Bar (No Stroke + Fill)
		ctx.beginPath();
		ctx.rect(xPos, (((SCREEN_HEIGHT/10)*i)+5)-yOff,
				(SCREEN_WIDTH/8)*(players[i].health/100), SCREEN_HEIGHT/20);
		ctx.fillStyle = 'rgba(0,255,0,1)';
		ctx.fill();
		//HP Container (Stroke + Empty)
		ctx.beginPath();	
		ctx.rect(xPos, (((SCREEN_HEIGHT/10)*i)+5)-yOff,
				(SCREEN_WIDTH/8), SCREEN_HEIGHT/20);
		if (i == 0)
			ctx.strokeStyle	= 'rgba(255,0,0,1)';
		else
			ctx.strokeStyle = 'rgba(0,0,0,1)';
		ctx.lineWidth	= 2;
		ctx.fillStyle = 'rgba(0,255,0,0)';
		ctx.fill();
		ctx.stroke();
	}
	
	//Player Circle Arc  **LINEWIDTH MUST BE 2*RADIUS
	if (GUIState == 1)
	for (var i = 0; i < players.length; i++)
	{
		if (players[i].health < 0)
			players[i].health = 0;
			
		ctx.beginPath();
		ctx.strokeStyle	= 'rgba(0,255,0,1)'; 
		ctx.fillStyle = 'rgba(0,255,0,1)';
		ctx.lineWidth = 1;
		
		//context.arc(x, y, radius, startangle, endangle, anti-clockwise?);
		
		if (players[i].health > 0)
		{
		var endAngle = 6.28 * (players[i].health / 100);
		
		if (i < 10)
		{
			var centerX = calcRadius; var centerY = calcRadius+((calcRadius*2)*i);
		}
		else
		{
			var centerX = calcRadius*3; var centerY = calcRadius+((calcRadius*2)*(i-10));
		}

		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, calcRadius, 0, endAngle, false );
		ctx.lineTo(centerX, centerY);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
		}
	}
	
	//Player Square
	if (GUIState == 2)
	for (var i = 0; i < players.length; i++)
	{
		if (players[i].health < 0)
			players[i].health = 0;
			
		if (i < 10)
		{
			var xPos = 0;
			var yOff = 0;
		}
		else
		{
			xPos = calcRadius*2;
			yOff = SCREEN_HEIGHT;
		}
		//HP Bar (No Stroke + Fill)
		ctx.beginPath();	
		ctx.rect(xPos, (calcRadius*2)+((calcRadius*2)*i)-yOff,
				calcRadius*2, -((calcRadius*2)*(players[i].health/100)));
		ctx.fillStyle = 'rgba(0,255,0,1)';
		ctx.fill();
		//HP Container (Stroke + Empty)
		ctx.beginPath();
		ctx.rect(xPos, ((calcRadius*2)*i)-yOff,
				calcRadius*2, calcRadius*2);
		ctx.strokeStyle	= "#000000"; 
		ctx.lineWidth	= 1;
		ctx.fillStyle = 'rgba(0,255,0,0)';
		ctx.fill();
		ctx.stroke();
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