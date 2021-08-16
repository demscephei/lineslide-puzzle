function setup() {
	let canvas = createCanvas(480, 480);
	canvas.parent('game-container');
	// put setup code here
}
// Starting Map (where the tokens are positioned at the start)
let startingMap = [
	[2, 0, 0],
	[2, 2, 1],
	[1, 0, 0],
	[0, 1, 1],
	[0, 0, 1]
]

// Goal Map (where the tokens should be to win the game)
let goalMap = [
	[1, 0, 1],
	[1, 0, 0],
	[0, 2, 1],
	[0, 2, 0],
	[1, 2, 0]
]


// TileMap gets assigned Starting Map (for future game resetting)
let tileMap = new Array()
tileMap = startingMap

// Command history for when you press "UP" on the input field
let cmdHistory = []


// Gets input field and status ("You win!") elements
const input = document.getElementById("input-field")
const status = document.getElementById("status");

// Dictionary with all the commands you can call
const funcDict = {
  up: function (val) { moveUp(val) },
	down: function (val) { moveDown(val) },
	left: function (val) { moveLeft(val) },
	right: function (val) { moveRight(val) },
	undo: function (val) { console.log("undoed") }
}

input.addEventListener("keyup", (event) => {
	if (event.keyCode === 13){
		event.preventDefault();

	  const [direction, val] = input.value.split(' ');
	  const fn = funcDict[direction.toLowerCase()];


	  if (fn) {
	    fn(val);
			cmdHistory.push(input.value)
	  }

		input.value = ''

	} else if (event.keyCode === 38){
		if (cmdHistory.length > 0){
				input.value = cmdHistory[cmdHistory.length - 1]
		}
	}
});

function getColumn(col){
    newColumn = new Array()
    for (let i = 0; i < tileMap.length; i++){
        for(let j = 0; j < tileMap[i].length; j++){
            if (tileMap[j] == tileMap[col]) {
                newColumn.push(tileMap[i][j])
            }
        }
    }
    return newColumn
}

function getRow(row){
    newRow = new Array()
    for (let i = 0; i < tileMap.length; i++){
        if (tileMap[i] == tileMap[row]){
            tileMap[i].forEach(element => newRow.push(element));
        }
    }
    return newRow
}

function moveLeft(row){
    if (tileMap[row][0] === 0){
        let item = tileMap[row].shift()
        tileMap[row].push(item)
    }
    // console.log(tileMap)
		return checkArrays(tileMap,goalMap)
}

function moveRight(row){
    if (tileMap[row][tileMap[row].length - 1] === 0){
        let item = tileMap[row].pop()
        tileMap[row].unshift(item)
    }
    // console.log(tileMap)
		return checkArrays(tileMap,goalMap)
}

function moveUp(col){
	if (col < tileMap.length){
	    let column = getColumn(col)

	    if (column[0] === 0){
	        let item = column.shift()
	        column.push(item)
	    }

	    for (i = 0; i < tileMap.length; i++){
	        tileMap[i][col] = column[i]
	        // console.log(tileMap[i])

	    }
	}
	return checkArrays(tileMap,goalMap)
}

function moveDown(col){
	if (col < tileMap.length){
	    let column = getColumn(col)

	    if (column[column.length - 1] === 0){
	        let item = column.pop()
	        column.unshift(item)
	    }

	    for (i = 0; i < tileMap.length; i++){
	        tileMap[i][col] = column[i]
	        // console.log(tileMap[i])

	    }
	}
	return checkArrays(tileMap,goalMap)
}

const checkArrays = function(arr1, arr2) {
  if (arr1.toString() === arr2.toString()){
		status.textContent = "You win!"
		return true;
	}
}

/// DRAW STUFF ////////////////////////////////////////////////////
function draw() {
	background(23, 19, 42)
	// put drawing code here
	width = 72

///// Board ///////////////////////////////////////////////
	for (let i = 0; i < goalMap.length; i++){
			for(let j = 0; j < goalMap[i].length; j++){
				let x = j * width
				let y = i *width
				tile = goalMap[i][j]
//////////////////////////////////////////////////////////
				stroke(253, 252, 220,255)
				strokeWeight(1)

				// Tile blue
				if (tile === 1){
					strokeWeight(1)
					fill(66, 83, 159,150)
					rect(x+width/2,y+width/2,width,width)

				}
				//Tile red
				else if (tile === 2){
					strokeWeight(1)
					fill(135, 13, 72,150)
					rect(x+width/2,y+width/2,width,width)

				}
				//Tile yellow
				else if (tile === 3){
					strokeWeight(1)
					fill(204, 164, 59,150)
					rect(x+width/2,y+width/2,width,width)

				}
				//Tile empty
				 else if (tile == 0) {
					fill(23, 19, 42)
					strokeWeight(1)
					stroke(253, 252, 220,255)
					rect(x+width/2,y+width/2,width,width)

					strokeWeight(4)
					stroke(253, 252, 220,40)
					rect(x+width/2,y+width/2,width,width)

				}

				// ellipse(x+width,y+width,width)
			}
		}

	///// Tokens ////////////////////////////////////////////
	for (let i = 0; i < tileMap.length; i++){
			for(let j = 0; j < tileMap[i].length; j++){
				let x = j * width
				let y = i *width
				let token = tileMap[i][j]
//////////////////////////////////////////////////////////

				// strokeWeight(4)
				fill(255,0)

				// Token blue
				if (token === 1){
					strokeWeight(2)
					stroke(100, 189, 251,255)
					ellipse(x+width,y+width,width-8)

					strokeWeight(6)
					stroke(100, 189, 251,40)
					ellipse(x+width,y+width,width-8)
				}
				// Token red
				else if (token === 2) {
					strokeWeight(2)
					stroke(257, 47, 143,255)
					ellipse(x+width,y+width,width-8)

					strokeWeight(6)
					stroke(257, 47, 143,40)
					ellipse(x+width,y+width,width-8)
				}
				// Token yellow
				else if (token === 3) {
					strokeWeight(2)
					stroke(249, 251, 61,255)
					ellipse(x+width,y+width,width-8)

					strokeWeight(6)
					stroke(249, 251, 61,40)
					ellipse(x+width,y+width,width-8)
				}

				// rect(x,y,width,width)


		}
	}
}
