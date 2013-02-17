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
				socket.emit('HEAL_PLAYER', players[i].name);
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
				socket.emit('HEAL_PLAYER', players[i].name);
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
};