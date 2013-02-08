function app_gets(app, express, fs, login_mysql, crypto, getCouplings, getPlayers, findWithAttr) {

	//Setup BodyParser
	app.configure(function() {
	  app.use(express.bodyParser());
	});

	//Standard .HTML return
	app.get('/', function(req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
		res.end(fs.readFileSync('./login.html'));
	});
	app.get('/login', function(req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
		res.end(fs.readFileSync('./login.html'));
	});
	app.get('/register', function(req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
		res.end(fs.readFileSync('./register.html'));
	});
	app.post('/register_submit', function(req, res) {
		res.writeHead(200, { 'Content-type': 'text/html'});
		
		if(req.body.name == '' || req.body.pass == '' || req.body.gender == '')
		{
			res.write('Missing fields. Please enter all information.');
			res.end(fs.readFileSync('./register.html'));
			return;
		}

		login_mysql.query('SELECT * FROM lawrence_bound.logins WHERE USERNAME=' + '\''+req.body.name+'\'', function(err, rows, fields) {
			if(rows[0] == null)
			{
				login_mysql.query('INSERT INTO lawrence_bound.logins SET ?', {USERNAME: req.body.name, PASSWORD: crypto.createHash('md5').update(req.body.pass).digest("hex"), GENDER: req.body.gender}, function(err, result) {
					res.write('Successfully Registered.');
					res.end(fs.readFileSync('./login.html'));
				});
			}
			else
			{
				res.write('Username in use. Please try another.');
				res.end(fs.readFileSync('./register.html'));
			}
		});
	});
	app.post('/game', function(req, res) {	
		res.writeHead(200, { 'Content-type': 'text/html'});
		
		if(req.body.name == '' || req.body.pass == '')
		{
			res.write('Please enter both Username and Password.');
			res.end(fs.readFileSync('./login.html'));
			return;
		}

		login_mysql.query('SELECT * FROM lawrence_bound.logins WHERE USERNAME=' + '\''+req.body.name+'\'', function(err, rows, fields) {
			if (err) console.log(err);
		
			if(rows[0] == undefined)
				res.write('Incorrect Username');
			else if (rows[0].PASSWORD == crypto.createHash('md5').update(req.body.pass).digest("hex"))
			{
				res.write('<!doctype html><html lang="en"><script> var playerName = "' + rows[0].USERNAME + '"; console.log(playerName); </script>');
				rows[0].PASSWORD = 0;
				
				//Log out old instance of player
				var index = findWithAttr(getCouplings, 'PID', rows[0].PID);
				
				if (index == -1)
				{
					getPlayers.push(rows[0]);
				}
				else
				{
					//
					io.sockets.socket(getCouplings[index].SID).disconnect();
					getPlayers.push(rows[0]);
				}
				
				res.end(fs.readFileSync('./game.html'));
				return;
			}
			else
				res.write('Incorrect Password');
		
			res.end(fs.readFileSync('./login.html'));
		});
	});
	//Standard .JS return
	app.get('/js/Detector.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./js/Detector.js'));
	});
	app.get('/js/ColladaLoader.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./js/ColladaLoader.js'));
	});
	app.get('/js/RequestAnimationFrame.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./js/RequestAnimationFrame.js'));
	});
	app.get('/js/build/three.min.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./js/build/three.min.js'));
	});
	app.get('/js/VirtualJoystick.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./js/VirtualJoystick.js'));
	});
	app.get('/js/game/Player.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./js/game/Player.js'));
	});
	app.get('/js/game/Vector3.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./js/game/Vector3.js'));
	});
	app.get('/js/game/Animation.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./js/game/Animation.js'));
	});
	app.get('/js/game/Boss.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./js/game/Boss.js'));
	});
	app.get('/drawing.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./drawing.js'));
	});
	app.get('/network.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./network.js'));
	});
	app.get('/update.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/javascript'});
		res.end(fs.readFileSync('./update.js'));
	});
	//Models
	app.get('/Models/PCs/male/male.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/json'});
		res.end(fs.readFileSync('./Models/PCs/male/male.js'));
	});
	app.get('/Models/Arena/Arena.dae', function(req, res) {
		res.end(fs.readFileSync('./Models/Arena/Arena.dae'));
	});
	app.get('/Models/Skydome/Skydome.dae', function(req, res) {
		res.end(fs.readFileSync('./Models/Skydome/Skydome.dae'));
	});
	app.get('/Models/Boss/boss.js', function(req, res) {
		res.writeHead(200, { 'Content-type': 'application/json'});
		res.end(fs.readFileSync('./Models/Boss/boss.js'));
	});
	//Textures
	app.get('/Models/PCs/male//male_tex.png', function(req, res) {
		res.end(fs.readFileSync('./Models/PCs/male/male_tex.png'));
	});
	app.get('/Models/Arena/arena_tex.png', function(req, res) {
		res.end(fs.readFileSync('./Models/Arena/arena_tex.png'));
	});
	app.get('/Models/Skydome/skydome_tex.png', function(req, res) {
		res.end(fs.readFileSync('./Models/Skydome/skydome_tex.png'));
	});
	app.get('/Models/Boss//boss_tex.png', function(req, res) {
		res.end(fs.readFileSync('./Models/Boss/rock_tex.png'));
	});
}

module.exports.app_gets = app_gets;