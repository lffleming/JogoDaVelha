function Player () {
	var self = this;
	self.Name = ko.observable('');
	self.Wins = ko.observable(0);
	self.AddWin = function () {
		var wins = self.Wins() + 1;
		self.Wins(wins);
	};
}
function Row (r) {
	var self = this;
	self.Columns = ko.observableArray([
			new Column(r, 0), new Column(r, 1), new Column(r, 2)
	]);
}

function Column (r, c) {
	var self = this;
	self.Place = new Options(r, c);
}

function Board () {
	var self = this;
	self.Rows = ko.observableArray([
			new Row(0), new Row(1), new Row(2)
	]);

}

function Options (r, c) {
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
	self.Row = r;
	self.Column = c;
}

var StartGame = function () {
	var self = this;
	self.Players = [new Player(), new Player()];
	self.Board = new Board();
	self.CurrentPlayer = ko.observable(1);
	self.Moves = 0;
	self.Mark = function(place) {
		if (place.Place.IsMarked() || self.EndGame()) return;

		self.Moves++;
		var player = self.CurrentPlayer();
		place.Place.WhoMarked(player);
		place.Place.IsMarked(true);
		CheckPlayerWon(place.Place, player);
		self.CurrentPlayer(player%2 + 1);
		if (self.AgainstComputer() && player == 1)
		{
			MarkComputer(self.CurrentPlayer());
		}
	};

	self.IncreaseWins = function (player) {
		self.Players[player - 1].AddWin();
	};

	self.StartNewGame = function() {
		self.Moves = 0;
		self.EndGame(false);
		self.CurrentPlayer(1);
		self.Board.Rows.removeAll();
		self.Board.Rows([new Row(0), new Row(1), new Row(2)]);
	};

	self.AgainstComputer = ko.observable(false);

	self.EndGame = ko.observable(false);

	self.ChangePlayer = function() {
		var playerTwo = "Computador";
		if (self.AgainstComputer()) {
			playerTwo = prompt("Entre com o nome do Jogador 2 : ", "Nome");
			self.AgainstComputer(false);
		}
		else {
			MyGame.AgainstComputer(true);
		}
		MyGame.Players[1].Name(playerTwo);
		alert('Jogador 2 agora é '+ playerTwo +'.');
		self.StartNewGame();
	};

};

function MarkComputer  (player) {
	var place = TryMarkVertical(player) || TryMarkVertical(1) || TryMarkCenterOrCorner(player) || TryMarkEmpty(player);
	MyGame.Mark(place);
	
}

function TryMarkVertical (player) {
	var place = null;
	for (var i = 0 ; i < 3; i++) {

		if (MyGame.Board.Rows()[i].Columns()[0].Place.WhoMarked() == player &&
		MyGame.Board.Rows()[i].Columns()[1].Place.WhoMarked() == player &&
		!MyGame.Board.Rows()[i].Columns()[2].Place.IsMarked()) {
			place = MyGame.Board.Rows()[i].Columns()[2];
			break;
		}
		else if (MyGame.Board.Rows()[i].Columns()[0].Place.WhoMarked() == player &&
		MyGame.Board.Rows()[i].Columns()[2].Place.WhoMarked() == player &&
		!MyGame.Board.Rows()[i].Columns()[1].Place.IsMarked()) {
			place = MyGame.Board.Rows()[i].Columns()[1];
			break;
		}
		else if (MyGame.Board.Rows()[i].Columns()[2].Place.WhoMarked() == player &&
		MyGame.Board.Rows()[i].Columns()[1].Place.WhoMarked() == player &&
		!MyGame.Board.Rows()[i].Columns()[0].Place.IsMarked()) {
			place = MyGame.Board.Rows()[i].Columns()[0];
			break;
		}

	}

	if (place === null) {
		place = TryMarkHorizontal(player);
	}
	return place;

}

function TryMarkHorizontal (player) {
	var place = null;
	for (var i = 0 ; i < 3; i++) {

		if (MyGame.Board.Rows()[0].Columns()[i].Place.WhoMarked() == player &&
		MyGame.Board.Rows()[1].Columns()[i].Place.WhoMarked() == player &&
		!MyGame.Board.Rows()[2].Columns()[i].Place.IsMarked()) {
			place = MyGame.Board.Rows()[2].Columns()[i];
			break;
		}
		else if (MyGame.Board.Rows()[0].Columns()[i].Place.WhoMarked() == player &&
		MyGame.Board.Rows()[2].Columns()[i].Place.WhoMarked() == player &&
		!MyGame.Board.Rows()[1].Columns()[i].Place.IsMarked()) {
			place = MyGame.Board.Rows()[1].Columns()[i];
			break;
		}
		else if (MyGame.Board.Rows()[1].Columns()[i].Place.WhoMarked() == player &&
		MyGame.Board.Rows()[2].Columns()[i].Place.WhoMarked() == player &&
		!MyGame.Board.Rows()[0].Columns()[i].Place.IsMarked()) {
			place = MyGame.Board.Rows()[0].Columns()[i];
			break;
		}
	}

	if (place === null) {
		place = TryMarkDiagonal(player);
	}
	return place;
}

function TryMarkDiagonal(player) {
	var place = null;

	if (MyGame.Board.Rows()[0].Columns()[0].Place.WhoMarked() == player &&
	MyGame.Board.Rows()[1].Columns()[1].Place.WhoMarked() == player &&
	!MyGame.Board.Rows()[2].Columns()[2].Place.IsMarked()) {
		place = MyGame.Board.Rows()[2].Columns()[2];
	}
	else if (MyGame.Board.Rows()[0].Columns()[0].Place.WhoMarked() == player &&
	MyGame.Board.Rows()[2].Columns()[2].Place.WhoMarked() == player &&
	!MyGame.Board.Rows()[1].Columns()[1].Place.IsMarked()) {
		place = MyGame.Board.Rows()[1].Columns()[1];
	}
	else if (MyGame.Board.Rows()[1].Columns()[1].Place.WhoMarked() == player &&
	MyGame.Board.Rows()[2].Columns()[2].Place.WhoMarked() == player &&
	!MyGame.Board.Rows()[0].Columns()[0].Place.IsMarked()) {
		place = MyGame.Board.Rows()[0].Columns()[0];
	}

	if (place === null) {
		place = TryMarkReverseDiagonal(player);
	}
	return place;
}

function TryMarkReverseDiagonal(player) {
	var place = null;

	if (MyGame.Board.Rows()[0].Columns()[2].Place.WhoMarked() == player &&
	MyGame.Board.Rows()[1].Columns()[1].Place.WhoMarked() == player &&
	!MyGame.Board.Rows()[2].Columns()[0].Place.IsMarked()) {
		place = MyGame.Board.Rows()[2].Columns()[0];
	}
	else if (MyGame.Board.Rows()[0].Columns()[2].Place.WhoMarked() == player &&
	MyGame.Board.Rows()[2].Columns()[0].Place.WhoMarked() == player &&
	!MyGame.Board.Rows()[1].Columns()[1].Place.IsMarked()) {
		place = MyGame.Board.Rows()[1].Columns()[1];
	}
	else if (MyGame.Board.Rows()[1].Columns()[1].Place.WhoMarked() == player &&
	MyGame.Board.Rows()[2].Columns()[0].Place.WhoMarked() == player &&
	!MyGame.Board.Rows()[0].Columns()[2].Place.IsMarked()) {
		place = MyGame.Board.Rows()[0].Columns()[2];
	}

	return place;
}

function TryMarkCenterOrCorner (player) {
	var place = null;
	if (!MyGame.Board.Rows()[1].Columns()[1].Place.IsMarked()) {
		place = MyGame.Board.Rows()[1].Columns()[1];
	} 
	else {
		for (var i = 0 ; i < 3; i++) {

			if (!MyGame.Board.Rows()[i].Columns()[i].Place.IsMarked()) {
				place = MyGame.Board.Rows()[i].Columns()[i];
				break;
			}
			else if (!MyGame.Board.Rows()[i].Columns()[2-i].Place.IsMarked()) {
				place = MyGame.Board.Rows()[i].Columns()[2-i];
				break;
			}
		}
	}
	return place;
}

function TryMarkEmpty (player) {
	var place = null;
	end_for:
	for (var i = 0 ; i < 3; i++) {
		for (var x = 0 ; x < 3; x++) {
			if (!MyGame.Board.Rows()[i].Columns()[x].Place.IsMarked()) {
				place = MyGame.Board.Rows()[i].Columns()[x];
				break end_for;
			}
		}
	}
	return place;	
}

function CheckPlayerWon(place, player) {
	CheckVertical(place.Column, player);
	CheckHorizontal(place.Row, player);
	if (place.Column == place.Row) {
		CheckDiagonal(player);
	}
	if (place.Column + place.Row == 2) {
		CheckReverseDiagonal(player);
	}
	if (MyGame.Moves == 9)
	{
		Draw();
	}
}

function CheckVertical(c, player) {
	for(var i = 0; i < 3; i++) {
		if(MyGame.Board.Rows()[i].Columns()[c].Place.WhoMarked() != player)
		break;
		if(i == 2){
			PlayerWon(player);
		}
	}
}

function CheckHorizontal(r, player) {
	for(var i = 0; i < 3; i++) {
		if(MyGame.Board.Rows()[r].Columns()[i].Place.WhoMarked() != player)
		break;
		if(i == 2){
			PlayerWon(player);
		}
	}
}

function CheckDiagonal(player) {
	for(var i = 0; i < 3; i++) {
		if(MyGame.Board.Rows()[i].Columns()[i].Place.WhoMarked() != player)
		break;
		if(i == 2){
			PlayerWon(player);
		}
	}
}

function CheckReverseDiagonal(player) {
	for(var i = 0; i < 3; i++) {
		if(MyGame.Board.Rows()[i].Columns()[2-i].Place.WhoMarked() != player)
		break;
		if(i == 2){
			PlayerWon(player);
		}
	}
}

function PlayerWon (player) {
	MyGame.IncreaseWins(player);
	MyGame.EndGame(true);
	MyGame.Moves = 0;
	var name = "";
	name = MyGame.Players[player -1].Name();
	if (confirm("Parabéns " + name + " você ganhou!\nDeseja jogar novamente?"))
	{
		MyGame.StartNewGame();
	}
}

function Draw () {
	MyGame.EndGame(true);
	if (confirm("Deu velha!\nDeseja jogar novamente?"))
	{
		MyGame.StartNewGame();
	}
}

$(document).ready(function() {
	MyGame = new StartGame();
	ko.applyBindings(MyGame);
	var playerOne = prompt("Entre com o nome do Jogador 1 : ", "Nome");
	MyGame.Players[0].Name(playerOne);
	var playerTwo = "Computador";
	if (confirm("Deseja adicionar um jogador 2?")) {
		playerTwo = prompt("Entre com o nome do Jogador 2 : ", "Nome");
	}
	else {
		MyGame.AgainstComputer(true);
	}
	MyGame.Players[1].Name(playerTwo);
});
