var cPKeys = {}; //Initialise array to track all key presses
document.onkeydown = getKeyboard; //Register Key Press Event
document.onkeyup = resKeyboard; //Register Key Release Event
function handleInput() { 	//Function where Input logic handling occurs
	if (cPKeys[65])
		socket.emit('A');
	if (cPKeys[68])
		socket.emit('D');
	if (cPKeys[87])
		socket.emit('W');
	if (cPKeys[83])
		socket.emit('S');
}
function getKeyboard(event) {	//Keyboard Press Event
	cPKeys[event.keyCode] = true;
}
function resKeyboard(event) {	//Keyboard Release Event
	cPKeys[event.keyCode] = false;
}
