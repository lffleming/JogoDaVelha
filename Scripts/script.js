function Player () {
	var self = this;
	self.Name = ko.observable('');
	self.Wins = ko.observable(0);
}
function Row () {
	var self = this;
	self.Columns = ko.observableArray([
			new Column(), new Column(), new Column()
	]);
}

function Column () {
	var self = this;
	self.Place = new Options();
}

function Board () {
	var self = this;
	self.Places = ko.observableArray([
			new Row(), new Row(), new Row()
	]);

}

function Options () {
	var self = this;
	self.IsMarked = ko.observable(false);
	self.WhoMarked = ko.observable(0);
	self.MyClass = ko.computed(function() {
		var myClass =  'player-' + self.WhoMarked();
		if (self.IsMarked()) {
			myClass += ' marked';
		}
		return myClass;
	});
}

var StartGame = function () {
	var self = this;
	self.PlayerOne = new Player();
	self.PlayerTwo = new Player();
	self.Board = new Board();
	self.CurrentPlayer = ko.observable(1);

};

$(document).ready(function() {
	MyGame = new StartGame();
	ko.applyBindings(MyGame);
	var playerOne = prompt("Entre com o nome do Jogador 1 : ", "Nome");
	MyGame.PlayerOne.Name(playerOne);
	var playerTwo = prompt("Entre com o nome do Jogador 2 : ", "Nome");
	MyGame.PlayerTwo.Name(playerTwo);
});
