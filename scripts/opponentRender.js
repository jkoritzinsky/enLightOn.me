var override = [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "rightZag", "rightZag", null, null, null, null, null, null, null, "rightZag", "rightZag", null, null, null, null, null, null, null, null, "line", null, null, null, null, null, null, null, null, null, "line", null, null, null, null, null, null, null, null, null, "line", null, null, null, null, null, null, null, null, null, "line", null, null, null, null, null, null, null, null, null, "square", "square", null, null, null, null, null, null, null, null, "square", "square", null, null, null, null];

function OpponentCanvas() {
	var cvs = document.querySelector('#opponent');
	var ctx = cvs.getContext('2d');

	var totalLoaded = 0;
	var images = [];
	var imageSources = [
		'images/blue.png',
		'images/green.png',
		'images/orange.png',
		'images/purple.png',
		'images/red.png',
		'images/yellow.png'
	];

	var dict = {
		line: 'blue',
		square: 'green',
		arrow: 'orange',
		rightHook: 'purple',
		leftHook: 'red',
		leftZag: 'yellow',
		rightZag: 'blue'
	};

	for (var i = 0; i < imageSources.length; i++) {
		images[i] = new Image();
		images[i].onload = function () {
			totalLoaded++;
		};
		images[i].src = imageSources[i];
	}

	var cols = 10;
	var cellSize = 20;

	this.render = function (data) {
		if (totalLoaded === imageSources.length) {
			ctx.clearRect(0, 0, cvs.width, cvs.height);

			var x = 0,
				y = 0;
			for (var i = 0; i < data.length; i++) {
				x++;

				if (x >= cols) {
					x = 0;
					y++;
				}

				if (data[i] != null) {
					ctx.fillStyle = dict[data[i]];
					ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
				}
			}
		}
	}
}
