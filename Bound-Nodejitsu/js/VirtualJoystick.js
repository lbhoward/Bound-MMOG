var VirtualJoystick	= function(opts)
{
	opts			= opts			|| {};
	this._container		= opts.container	|| document.body;
	this._stickEl		= opts.stickElement	|| this._buildJoystickStick();
	this._baseEl		= opts.baseElement	|| this._buildJoystickBase();
	this._mouseSupport	= 'mouseSupport' in opts? opts.mouseSupport	: false;
	this._width			= opts.width || this._container.width;
	this._height		= opts.height || this._container.height;
	this._range			= opts.range		|| 20;
	this._lastRotation	= 0;

	this._container.style.position	= "static";

	this._container.appendChild(this._baseEl);
	this._baseEl.style.position	= "absolute"
	this._baseEl.style.display	= "";
	
	this._container.appendChild(this._stickEl);
	this._stickEl.style.position	= "absolute"
	this._stickEl.style.display	= "";
	
	this._pressed	= false;
	
	this._baseX = this._width - (this._baseEl.width/2);
	this._baseY = this._height - (this._baseEl.height/2);
	this._baseEl.style.left	= (this._baseX - this._baseEl.width/2) + "px";
	this._baseEl.style.top	= (this._baseY - this._baseEl.height/2) + "px";
	
	this._stickX = this._baseX;
	this._stickY = this._baseY;
	this._stickEl.style.left	= (this._stickX - this._stickEl.width /2)+"px";
	this._stickEl.style.top	= (this._stickY - this._stickEl.height/2)+"px";
	
	this._defStickX = this._stickX;
	this._defStickY = this._stickY;

	__bind		= function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
	this._$onTouchStart	= __bind(this._onTouchStart	, this);
	this._$onTouchEnd	= __bind(this._onTouchEnd	, this);
	this._$onTouchMove	= __bind(this._onTouchMove	, this);
	this._container.addEventListener( 'touchstart'	, this._$onTouchStart	, false );
	this._container.addEventListener( 'touchend'	, this._$onTouchEnd	, false );
	this._container.addEventListener( 'touchmove'	, this._$onTouchMove	, false );
	if( this._mouseSupport ){
		this._$onMouseDown	= __bind(this._onMouseDown	, this);
		this._$onMouseUp	= __bind(this._onMouseUp	, this);
		this._$onMouseMove	= __bind(this._onMouseMove	, this);
		this._container.addEventListener( 'mousedown'	, this._$onMouseDown	, false );
		this._container.addEventListener( 'mouseup'	, this._$onMouseUp	, false );
		this._container.addEventListener( 'mousemove'	, this._$onMouseMove	, false );
	}
}

VirtualJoystick.prototype.destroy	= function()
{
	this._container.removeChild(this._baseEl);
	this._container.removeChild(this._stickEl);

	this._container.removeEventListener( 'touchstart'	, this._$onTouchStart	, false );
	this._container.removeEventListener( 'touchend'		, this._$onTouchEnd	, false );
	this._container.removeEventListener( 'touchmove'	, this._$onTouchMove	, false );
	if( this._mouseSupport ){
		this._container.removeEventListener( 'mouseup'		, this._$onMouseUp	, false );
		this._container.removeEventListener( 'mousedown'	, this._$onMouseDown	, false );
		this._container.removeEventListener( 'mousemove'	, this._$onMouseMove	, false );
	}
}

/**
 * @returns {Boolean} true if touchscreen is currently available, false otherwise
*/
VirtualJoystick.touchScreenAvailable	= function()
{
	return 'createTouch' in document ? true : false;
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

VirtualJoystick.prototype.deltaX	= function(){ return this._stickX - (this._baseX);	}
VirtualJoystick.prototype.deltaY	= function(){ return this._stickY - (this._baseY);	}

VirtualJoystick.prototype.rotation = function() {
	if( this._pressed === false )	return this._lastRotation;
	var angle = -Math.atan2(this.deltaY(),this.deltaX()) + 1.57;
	if (angle < 0)
		angle = (6.28+angle);
	return this._lastRotation = angle;
};

VirtualJoystick.prototype.up	= function(){
	if( this._pressed === false )	return false;
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaY >= 0 )	return false;
	if( Math.abs(deltaY) < this._range && Math.abs(deltaY) < Math.abs(deltaX) ){
		return false;
	}
	return true;
}
VirtualJoystick.prototype.down	= function(){
	if( this._pressed === false )	return false;
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaY <= 0 )	return false;
	if( Math.abs(deltaY) < this._range && Math.abs(deltaY) < Math.abs(deltaX) ){
		return false;
	}
	return true;	
}
VirtualJoystick.prototype.right	= function(){
	if( this._pressed === false )	return false;
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaX <= 0 )	return false;
	if( Math.abs(deltaX) < this._range && Math.abs(deltaY) > Math.abs(deltaX) ){
		return false;
	}
	return true;	
}
VirtualJoystick.prototype.left	= function(){
	if( this._pressed === false )	return false;
	var deltaX	= this.deltaX();
	var deltaY	= this.deltaY();
	if( deltaX >= 0 )	return false;
	if( Math.abs(deltaX) < this._range && Math.abs(deltaY) > Math.abs(deltaX) ){
		return false;
	}
	return true;	
}

//////////////////////////////////////////////////////////////////////////////////
//										//
//////////////////////////////////////////////////////////////////////////////////

VirtualJoystick.prototype._onUp	= function()
{
	this._stickX = this._defStickX;
	this._stickY = this._defStickY
	this._stickEl.style.left	= (this._stickX - this._stickEl.width /2)+"px";
	this._stickEl.style.top	= (this._stickY - this._stickEl.height/2)+"px";
	
	this._pressed	= false; 
}

VirtualJoystick.prototype._onDown	= function(x, y)
{			
	x = this._checkXRange(x);
	y = this._checkYRange(y);
	
	this._pressed	= true; 
	this._stickX	= x;
	this._stickY	= y;

	this._stickEl.style.left	= (x - this._stickEl.width /2)+"px";
	this._stickEl.style.top		= (y - this._stickEl.height/2)+"px";
}

VirtualJoystick.prototype._onMove	= function(x, y)
{
	if( this._pressed === true ){
		x = this._checkXRange(x);
		y = this._checkYRange(y);
	
		this._stickX	= x;
		this._stickY	= y;
		this._stickEl.style.left	= (x - this._stickEl.width /2)+"px";
		this._stickEl.style.top		= (y - this._stickEl.height/2)+"px";
	}
}

VirtualJoystick.prototype._checkXRange = function(x)
{
	if (x > this._baseX + this._range)
		return this._baseX + this._range;
	else if (x < this._baseX - this._range)
		return this._baseX - this._range;
	else
		return x;
}
VirtualJoystick.prototype._checkYRange = function(y)
{
	if (y > this._baseY + this._range)
		return this._baseY + this._range;
	else if (y < this._baseY - this._range)
		return this._baseY - this._range;
	else
		return y;
}

//////////////////////////////////////////////////////////////////////////////////
//		bind touch events (and mouse events for debug)			//
//////////////////////////////////////////////////////////////////////////////////

VirtualJoystick.prototype._onMouseUp	= function(event)
{
	return this._onUp();
}

VirtualJoystick.prototype._onMouseDown	= function(event)
{
	var x	= event.clientX;
	var y	= event.clientY;
	
	if (x < this._baseX - (this._range * 3) || x > this._baseX + (this._range * 3))
		return;
	if (y < this._baseY - (this._range * 3) || y > this._baseY + (this._range * 3))
		return;
	
	return this._onDown(x, y);
}

VirtualJoystick.prototype._onMouseMove	= function(event)
{
	var x	= event.clientX;
	var y	= event.clientY;
	return this._onMove(x, y);
}

VirtualJoystick.prototype._onTouchStart	= function(event)
{
	if( event.touches.length != 1 )	return;

	event.preventDefault();

	var x	= event.touches[ 0 ].pageX;
	var y	= event.touches[ 0 ].pageY;
	
	if (x < this._baseX - (this._range * 3) || x > this._baseX + (this._range * 3))
		return;
	if (y < this._baseY - (this._range * 3) || y > this._baseY + (this._range * 3))
		return;
	
	return this._onDown(x, y)
}

VirtualJoystick.prototype._onTouchEnd	= function(event)
{
//??????
// no preventDefault to get click event on ios
event.preventDefault();

	return this._onUp()
}

VirtualJoystick.prototype._onTouchMove	= function(event)
{
	if( event.touches.length != 1 )	return;

	event.preventDefault();

	var x	= event.touches[ 0 ].pageX;
	var y	= event.touches[ 0 ].pageY;
	return this._onMove(x, y)
}


//////////////////////////////////////////////////////////////////////////////////
//		build default stickEl and baseEl				//
//////////////////////////////////////////////////////////////////////////////////

VirtualJoystick.prototype._buildJoystickBase	= function()
{
	var canvas	= document.createElement( 'canvas' );
	canvas.id = "joystick-base";
	canvas.width	= 126;
	canvas.height	= 126;
	
	var ctx		= canvas.getContext('2d');
	ctx.beginPath(); 
	ctx.strokeStyle = "#DBDBDB"; 
	ctx.lineWidth	= 6; 
	ctx.arc( canvas.width/2, canvas.width/2, 40, 0, Math.PI*2, true); 
	ctx.stroke();

	ctx.beginPath(); 
	ctx.strokeStyle	= "#DBDBDB"; 
	ctx.lineWidth	= 2; 
	ctx.arc( canvas.width/2, canvas.width/2, 60, 0, Math.PI*2, true); 
	ctx.stroke();
	
	return canvas;
}

VirtualJoystick.prototype._buildJoystickStick	= function()
{
	var canvas	= document.createElement( 'canvas' );
	canvas.id = "joystick-yoke";
	canvas.width	= 86;
	canvas.height	= 86;
	var ctx		= canvas.getContext('2d');
	ctx.beginPath(); 
	ctx.strokeStyle	= "#BDBDBD"; 
	ctx.lineWidth	= 6; 
	ctx.arc( canvas.width/2, canvas.width/2, 40, 0, Math.PI*2, true); 
	ctx.stroke();
	return canvas;
}

VirtualJoystick.prototype._buildJoystickButton	= function()
{
	var canvas	= document.createElement( 'canvas' );
	canvas.id = "joystick-button";
	canvas.width	= 86;
	canvas.height	= 86;
	var ctx		= canvas.getContext('2d');
	ctx.beginPath(); 
	ctx.strokeStyle	= "red"; 
	ctx.lineWidth	= 6; 
	ctx.arc( canvas.width/2, canvas.width/2, 40, 0, Math.PI*2, true); 
	ctx.stroke();
	return canvas;
}
