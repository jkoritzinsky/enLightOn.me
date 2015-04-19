// scripts/events.js

function GameEvents(events) {
	var dict = {};

	this.on = function (type, fn) {
		if (dict[type] == undefined) {
			dict[type] = [];
		}

		dict[type].push(fn);
	};

	this.run = function (type, obj) {
		var fns = dict[type] || [];

		for (var i = 0; i < fns.length; i++) {
			fns[i](obj);
		}
	};
}

var gameEvents = new GameEvents([
	'gameStart',
	'gameEnd',
	'gameOver',
	'gamePaused',
	'gameResume',
	'gameRestart',
	'scoreUpdate',
	'loadNewBlock'
]);
