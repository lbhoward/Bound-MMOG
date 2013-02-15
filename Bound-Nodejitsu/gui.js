var playerBars = new Array();
var paper; var rectangle;

function InitGUI() {
	paper = Raphael(document.getElementById("GUI-DIV"), SCREEN_WIDTH, SCREEN_HEIGHT);
	
	//playerBars.push(new paper.rect(0,0, 100, 10));
	//playerBars[0].attr("fill", "#FF0011");
	rectangle = paper.rect(10,10,100,10);
	rectangle.attr("fill", "#223fa3");
	rectangle.toFront();
};