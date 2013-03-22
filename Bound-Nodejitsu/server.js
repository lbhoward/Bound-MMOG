var fs = require('fs'),
	express = require('express'),
	http = require('http'),
	mysql = require('mysql'),
	crypto = require('crypto');
	//'./' is very important for own made modules!
//var app = express();
//var server = http.createServer(app);
//var io = require('socket.io').listen(server, { log: false});
//server.listen(8888);
var app = express();
var server = http.createServer(app);
var io = require('socket.io').listen(server, { log: false });
server.listen(25000);

//Connect to MySQL Database
var login_mysql = mysql.createConnection({
  host     : 'lawrence-howard.co.uk',
  user     : 'lawrence_login',
  password : 'Bound424'
});
login_mysql.connect();
handleDisconnect(login_mysql);

  setInterval(function(){
		login_mysql.destroy();
		login_mysql = mysql.createConnection(login_mysql.config);
		handleDisconnect(login_mysql);
		login_mysql.connect();
		console.log("45 Minute Interval: Restarting MySQL Connection");
  }, 1800000);

//Init players Array
var getPlayers = new Array();
var getCouplings = new Array();

//Boss variables
var bossBaseHP = 100;
var bossCurHP = bossBaseHP;
var bossActive = false;

//Logging System
var personalLog = new Array();
var time = new Date();

//App Get Initialisation (Request/Response Handling)
require('./app_gets').app_gets(app, express, fs, login_mysql, crypto, getCouplings, getPlayers, findWithAttr);

// Define a message handler
io.sockets.on('connection', function (socket) {
  socket.emit('CON_ACCEPT', getPlayers, bossCurHP); //Emit the list of players to the client that just connected
  
  socket.on('REGISTER', function(NAME) {
		var index = findWithAttr(getPlayers, 'USERNAME', NAME);
		getCouplings.push({ "PID":getPlayers[index].PID,"SID":socket.id });
		console.log(getCouplings);
		console.log(getPlayers);
  });
  
  socket.on('ACTIVATE_BOSS', function() {
		if (!bossActive)
		{
			fs.appendFile('log.txt', "BOSS_ACTIVE\n");
			bossActive = true;
			bossCurHP = 100;
		}
  });
  socket.on('DEACTIVATE_BOSS', function() {
		if (bossActive)
		{
			fs.appendFile('log.txt', "BOSS_DEACTIVE\n");
			bossActive = false;
			bossCurHP = 0;
			
			for (var i = 0; i < getPlayers.length; i++)
				getPlayers[i].HP = 100;
		}
  });

  socket.on('RESPOND', function(loc, rot, hT, aS, d) {
		var indexC = findWithAttr(getCouplings, 'SID', socket.id);
		var indexP = findWithAttr(getPlayers, 'PID', getCouplings[indexC].PID);
		getPlayers[indexP].X = loc.x;
		getPlayers[indexP].Z = loc.z;
		getPlayers[indexP].R = rot.y;
		
		switch (aS)
		{
			case 0:
				break;
			case 1:
				healPlayer(socket.id, hT);
				break;
			case 2:
				rezPlayer(hT);
				break;
			case 3:
				hitBoss(socket.id);
				break;
		}
		
		if (d)
			takeDamage(socket.id);
  });
  
  function healPlayer(socketid, name) {
		var indexC = findWithAttr(getCouplings, 'SID', socketid);
		var indexPP = findWithAttr(getPlayers, 'PID', getCouplings[indexC].PID);
		
		getPlayers[indexPP].justHealed = true;
		getPlayers[indexPP].justAttacked = false;
		getPlayers[indexPP].justRezzed = false;
  
		var indexP = findWithAttr(getPlayers, 'USERNAME', name);
		var preHP = getPlayers[indexP].HP;
		getPlayers[indexP].HP += 10;
		
		if (getPlayers[indexP].HP > 100)
			getPlayers[indexP].HP = 100;
			
		//HEALER:RECIEVER:REC_HEALTH_PRE:REC_HEALTH_POST:HOUR:SEC:MIN
		fs.appendFile("log.txt", getPlayers[indexPP].USERNAME + ":" + getPlayers[indexP].USERNAME + ":HEAL:" + preHP + ":" + getPlayers[indexP].HP + ":" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "\n");
  }
  
  function rezPlayer(name) {
		var indexP = findWithAttr(getPlayers, 'USERNAME', name);
		getPlayers[indexP].HP += 50;
		
		if (getPlayers[indexP].HP > 50)
			getPlayers[indexP].HP = 50;
			
		//RECIEVER:REC_HP
		fs.appendFile("log.txt", getPlayers[indexP].USERNAME + ":REZ:" + getPlayers[indexP].HP + ":" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "\n");
  }
  
  function takeDamage(socketid) {
		var indexC = findWithAttr(getCouplings, 'SID', socketid);
		var indexP = findWithAttr(getPlayers, 'PID', getCouplings[indexC].PID);
		
		var preHP = getPlayers[indexP].HP;
		getPlayers[indexP].HP -= 15;
		
		if (getPlayers[indexP].HP < 0)
			getPlayers[indexP].HP = 0;
			
		//RECIEVER:REC_HP_PRE:REC_HP_POST
		fs.appendFile("log.txt", getPlayers[indexP].USERNAME + ":DAMAGE:" + preHP + ":" + getPlayers[indexP].HP + ":" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "\n");
  }
  
  function hitBoss(socketid) {
		if (bossActive)
		{
			var indexC = findWithAttr(getCouplings, 'SID', socketid);
			var indexP = findWithAttr(getPlayers, 'PID', getCouplings[indexC].PID);
			
			var damageToBoss = 5*(getPlayers.length/50);
  
			bossCurHP -= damageToBoss;
		
			if (bossCurHP <= 0)
			{
				bossCurHP = 0;
				bossActive = false;
			}
			
			//RECIEVER:REC_HP
			fs.appendFile("log.txt", getPlayers[indexP].USERNAME + ":HIT_BOSS:" + bossCurHP + ":" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "\n");
		}
  }
  
  socket.on('END_ANIM', function(name, animType) {
		var indexP = findWithAttr(getPlayers, 'USERNAME', name);
		
		switch (animType)
		{
			case 1:
				getPlayers[indexP].justHealed = false;
				break;
			case 2:
				getPlayers[indexP].justAttacked = false;
				break;
			case 3:
				getPlayers[indexP].justRezzed = false;
				break;
		}
  });
  
  socket.on('disconnect', function() {
		var indexC = findWithAttr(getCouplings, 'SID', socket.id);
		var indexP = findWithAttr(getPlayers, 'PID', getCouplings[indexC].PID);
		login_mysql.query('UPDATE lawrence_bound.logins SET X=\'' + getPlayers[indexP].X + '\' WHERE PID=\'' + getPlayers[indexP].PID + '\';');
		login_mysql.query('UPDATE lawrence_bound.logins SET Z=\'' + getPlayers[indexP].Z + '\' WHERE PID=\'' + getPlayers[indexP].PID + '\';');
		login_mysql.query('UPDATE lawrence_bound.logins SET R=\'' + getPlayers[indexP].R + '\' WHERE PID=\'' + getPlayers[indexP].PID + '\';');
		login_mysql.query('UPDATE lawrence_bound.logins SET HP=\'' + getPlayers[indexP].HP + '\' WHERE PID=\'' + getPlayers[indexP].PID + '\';');
		getCouplings.splice(indexC,1);
		getPlayers.splice(indexP,1);
		
		console.log(getPlayers);
		
		io.sockets.emit('PLAYER_LEFT', indexP);
  });
});

//Controller for Boss Abilities
setInterval(function() {
		if (bossActive && getPlayers.length > 0)
		{
			var castAbility = Math.floor((Math.random()*2)+1);
			//var castAbility = 2;
			var fireBallTarget;
			var castLocations = new Array();
			
			switch (castAbility)
			{
				case 1:
					fireBallTarget = Math.floor((Math.random()*getPlayers.length));
					io.sockets.emit('BOSS_CAST', castAbility, fireBallTarget);
					var preHP = getPlayers[fireBallTarget].HP;
					getPlayers[fireBallTarget].HP -= 15;
					//RECIEVER:REC_HP_PRE:REC_HP_POST
					fs.appendFile("log.txt", getPlayers[fireBallTarget].USERNAME + ":DAMAGE:" + preHP + ":" + getPlayers[fireBallTarget].HP + ":" + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds() + "\n");
				break;
				
				case 2:
					var theta = 0; var radius = Math.floor(Math.random()*300)+60; var count = 0;
					var thetaOffset = Math.floor(Math.random()*180);
				
					for (var i = 0; i < 360; i+=30)
					{					
						var x = radius*Math.cos(theta+thetaOffset);
						var z = radius*Math.sin(theta+thetaOffset);
						var y = 0.05;
						
						theta+= 30;
						
						castLocations.push({ "x":x, "y":y, "z":z});
					}
					io.sockets.emit('BOSS_CAST', castAbility, castLocations);
				break;
			}
		}
}, 3000);
  
  setInterval(function() {
		io.sockets.emit('UPDATE', getPlayers, bossCurHP); 
		time = new Date();
  }, 45);

//MySQL disconnects
function handleDisconnect(connection) {
  connection.on('error', function(err) {
	console.log('**** MySQL Connection ERROR: ****');
	
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
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