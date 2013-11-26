$(function() {

// >50k
var code = "32301032310243113033224225502501232221321105101005421120400501101540434424043444444014444440044440544244444411440114403440440411"
// 48k
code = "35332105012310110103231331302111432341321013331025331320200343524444331423440442444444044434444134324444344434440442445534324304"

// 52k
code = "52332202011313220003031331002111121221321313322211311122200033224442444444405443444444442144444334442444444434444442424534223542"

// 35k
//code = "23352153202303510105211531332000353321235355531005320211030052110444341153441443444454044444424344331441344434444142442444423444"

// 42k
//code = "10332153312305353505531331042202350221212042351503525211550142411444222553042442444444444444444345032441344434444142442444425404"

//99%
code = "02311512232002311311022532322233151113220230031550200451530500254444452424444224434442434444444424414444434444245434325444453423"

// author G
code = "12301022303332411111222032322233311111150035452150335010111052414444434434441244434434434434434441444243443013455434325443443405"
// author M
code = "55355322353532311311311354322344234441130030032230303231131131134444444444444444444444444544445344113444444444444444444444444444"

var decisions = []
for (var i = 0; i < code.length; i++)
	decisions.push(parseInt(code[i]))


var game = new Game();
$('.field').html(game.render());

$('#next').click(function() {
    game.act(code)
    $('.field').html(game.render());
})

function Game()
{
    var reverseMapping = [ 0,-1,64,1,-1,65,2,-1,66,3,-1,67,4,-1,68,5,-1,69,6,-1,70,7,-1,71,8,-1,72,9,-1,73,-1,-1,-1,10,-1,74,11,-1,75,-1,-1,-1,12,-1,76,13,-1,77,-1,-1,-1,14,-1,78,15,-1,79,16,-1,80,17,-1,81,18,-1,82,19,-1,83,20,-1,84,21,-1,85,22,-1,86,23,-1,87,24,-1,88,25,-1,89,26,-1,90,-1,-1,-1,-1,-1,-1,-1,-1,-1,27,-1,91,28,-1,92,29,-1,93,30,-1,94,-1,-1,-1,31,-1,95,-1,-1,-1,-1,-1,-1,-1,-1,-1,32,-1,96,-1,-1,-1,33,-1,97,34,-1,98,35,-1,99,36,-1,100,-1,-1,-1,-1,-1,-1,-1,-1,-1,37,-1,101,38,-1,102,39,-1,103,40,-1,104,41,-1,105,42,-1,106,43,-1,107,44,-1,108,45,-1,109,46,-1,110,47,-1,111,48,-1,112,49,-1,113,-1,-1,-1,50,-1,114,51,-1,115,-1,-1,-1,52,-1,116,53,-1,117,-1,-1,-1,54,-1,118,55,-1,119,56,-1,120,57,-1,121,58,-1,122,59,-1,123,60,-1,124,61,-1,125,62,-1,126,63,-1,127 ]

	// create field
	this.fieldSize = 10
	this.itemCount = 50
	this.field = []
	for (var x = 0; x < this.fieldSize; x++)
		for (var y = 0; y < this.fieldSize; y++)
			this.field.push(false);
	
	// place items
	var placed = 0;
	while(placed < this.itemCount) {
		var loc = Math.floor(Math.random() * this.field.length);
		if (this.field[loc]) continue;
		this.field[loc] = true;
		placed++;
	}

	// robot location
	this.x = 0;
	this.y = 0;
	this.moves = 0;

	this.getIndex = function(x,y) { return y * this.fieldSize + x }

	// return cell info (0 = empty, 1= wall, 2=item)
	this.getCell = function(x,y) {
	    if (x < 0 || y < 0 || x >= this.fieldSize || y >= this.fieldSize)
	        return 1; // wall
	    else if(this.field[this.getIndex(x,y)])
	        return 2; // object
	    else
	        return 0; // empty
	}

	// act
	this.points = 0;
	this.act = function(code) {

	    if (this.moves >= 200) return;
        this.moves++;

	    // get situation
	    var sit = 0;
	    sit += this.getCell(this.x, this.y - 1) * 3 * 3 * 3 * 3
	    sit += this.getCell(this.x + 1, this.y) * 3 * 3 * 3
	    sit += this.getCell(this.x, this.y + 1) * 3 * 3
	    sit += this.getCell(this.x - 1, this.y) * 3
	    sit += this.getCell(this.x, this.y)

	    // get decision
	    var mapped = reverseMapping[sit]
		var decision = parseInt(code[mapped])

		// random move
		if (decision == 5) decision = Math.floor(Math.random() * 4);

		if (decision <= 3) {
			// move
			var delta;
			if (decision == 0) delta = [ 0, -1 ]
			else if (decision == 1) delta = [ 1, 0 ]
            else if (decision == 2) delta = [ 0, 1 ]
			else delta = [ -1, 0 ]
			var nextX = this.x + delta[0];
			var nextY = this.y + delta[1];

            // test move location
			if (this.getCell(nextX, nextY) == 1) {
			    this.points -= 5;  // move against wall
			} else {
			    // successful move
                this.x = nextX;
                this.y = nextY;
			}
		}
		else if(decision == 4) {
			// pick up
			var index = this.getIndex(this.x, this.y)
			if (this.field[index]) {
                this.points += 10;
                this.field[index] = false;
			}
			else
			    this.points -= 1;
		}
		else
			console.log("error")
	}

	// get html
	this.render = function() {
	    var robotIndex = this.getIndex(this.x, this.y)
	    var result = $.map(this.field, function(f, i) {
	        var fieldClass = f ? "item" : "empty"
	        var result = $('<span class="' + fieldClass + '">')
	        if (i == robotIndex) result.append($('<span class="robot">'))
	        return result;
	    })
	    return result;
	}

	console.log(this.field);
}



});
	

