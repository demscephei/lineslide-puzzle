const levelList =[
	{
		"start": [
			[0, 0, 1],
			[0, 0, 0],
			[1, 0, 1],
		],
		"goal": [
			[1, 0, 0],
			[9, 1, 0],
			[0, 0, 1]
		]
	},
{
		"start": [
			[2, 0, 0],
			[2, 2, 1],
			[1, 0, 0],
			[0, 1, 1],
			[0, 0, 1]
		],
		"goal": [
			[1, 0, 1],
			[1, 0, 0],
			[0, 2, 1],
			[0, 2, 0],
			[1, 2, 0]
		]
	}
]

function setup() {
	frameRate(24)
	canvas = createCanvas(480, 480);
	canvas.parent('game-container');
}

// Gets input field and status ("You win!") elements
const input = document.getElementById("input-field")
const status = document.getElementById("status");
const btnList = document.getElementById("button-list");

let tileMap = new Array();
let startingMap;
let goalMap;

let levelButtons = [1,2]

function inside(x, y, w, h){
 if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
  return true;
 } else {
  return false;
 }
}

function createBtn(){
	for(let b = 0; b < levelButtons.length; b++){
		let btn = document.createElement("button")
		let txt = document.createTextNode("Level " + levelButtons[b])
		// btn.innerHTML = "Level "
		btn.appendChild(txt)
		btn.addEventListener("click",function(){
			loadLevel(b)
		})
		btnList.appendChild(btn)
		// console.log("Level " + levelButtons[b])
	}
}

createBtn()

function loadLevel(level) {
		// Starting Map (where the tokens are positioned at the start)
		startingMap = JSON.parse(JSON.stringify(levelList[level].start));

		// Goal Map (where the tokens should be to win the game)
		goalMap = JSON.parse(JSON.stringify(levelList[level].goal));

		// TileMap gets assigned Starting Map (for future game resetting)
		tileMap = JSON.parse(JSON.stringify(startingMap));
}

loadLevel(0)

function resetLevel(){
	tileMap = JSON.parse(JSON.stringify(startingMap));
}

// Command history for when you press "UP" on the input field
let cmdHistory = []

// Dictionary with all the commands you can call
const funcDict = {
  up: function (val) { moveUp(val) },
	down: function (val) { moveDown(val) },
	left: function (val) { moveLeft(val) },
	right: function (val) { moveRight(val) },
	reset: function () { resetLevel() },
	undo: function () { console.log("undoed") }
}

// Makes the "command line" work when you press the Enter key
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

// Checks if there's a wall on the right
function checkMoveRight(row){
	let canMove = true
	tileMap[row].forEach((item,index) => {
		if (item === 1 || item === 2 || item ===3) {
			if (goalMap[row][(index + 1)] === 9) {
					console.log("Blocked at index: " + (index + 1));
					canMove = false
			}
		}
	});
	return canMove
}

// Checks if there's a wall on the left
function checkMoveLeft(row){
	let canMove = true
	tileMap[row].forEach((item,index) => {
		if (item === 1 || item === 2 || item ===3) {
			if (goalMap[row][(index - 1)] === 9) {
					console.log("Blocked at index: " + (index - 1));
					canMove = false
			}
		}
	});
	return canMove
}

// Checks if there's a wall above
function checkMoveUp(col){
	let canMove = true
	tileMap.forEach((item,index) => {
		// console.log(item[col])
		if (item[col] === 1 || item[col] === 2 || item[col] ===3) {
			// console.log("Found token: " + item[col])
			// console.log("Above row: " + goalMap[index - 1][col])
			if (goalMap[index - 1][col] === 9) {
					// console.log("Blocked at index: " + (index[col]));
					canMove = false
			}
		}
	});
	return canMove
}

// Checks if there's a wall below
function checkMoveDown(col){
	let canMove = true
	tileMap.forEach((item,index) => {
		// console.log(item[col])
		if (item[col] === 1 || item[col] === 2 || item[col] ===3) {
			// console.log("Found token: " + item[col])
			// console.log("Above row: " + goalMap[index - 1][col])
			if (goalMap[index + 1][col] === 9) {
					// console.log("Blocked at index: " + (index[col]));
					canMove = false
			}
		}
	});
	return canMove
}

// Gets the current column
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

// Gets the current row (unused)
function getRow(row){
    newRow = new Array()
    for (let i = 0; i < tileMap.length; i++){
        if (tileMap[i] == tileMap[row]){
            tileMap[i].forEach(element => newRow.push(element));
        }
    }
    return newRow
}

// Moves the current row to the left once
function moveLeft(row){
    if (tileMap[row][0] === 0 && checkMoveLeft(row)){
      let item = tileMap[row].shift()
      tileMap[row].push(item)
    }
    // console.log(tileMap)
		return checkArrays(tileMap,goalMap)
}

// Moves the current row to the right once
function moveRight(row){
	    if (tileMap[row][tileMap[row].length - 1] === 0 && checkMoveRight(row)){
	        let item = tileMap[row].pop()
	        tileMap[row].unshift(item)
	    }
	    // console.log(tileMap)
			return checkArrays(tileMap,goalMap)
}

// Moves the current column up once
function moveUp(col){
	if (col < tileMap.length){
	    let column = getColumn(col)

	    if (column[0] === 0 && checkMoveUp(col)){
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

// Moves the current column down once
function moveDown(col){
	if (col < tileMap.length){
	    let column = getColumn(col)

	    if (column[column.length - 1] === 0 && checkMoveDown(col)){
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

// Checks both map arrays to see if the player won
const checkArrays = function(arr1, arr2) {
  if (arr1.toString() === arr2.toString()){
		status.textContent = "You win!"
		return true;
	}
}

/// DRAW STUFF ////////////////////////////////////////////////////
function draw() {

	tilePadding = 8
	tileWidth = width / tileMap[0].length - tilePadding
	tileHeight = height / tileMap.length - tilePadding

	aspectRatio = 0

	if (tileWidth > tileHeight) {
		aspectRatio = tileHeight / tileWidth
		tileWidth = tileWidth * aspectRatio

	} else if (tileHeight > tileWidth) {

		aspectRatio = tileWidth / tileHeight
		tileHeight = tileHeight * aspectRatio
	}

	background(23, 19, 42)

	push()
	stroke(255)
	strokeWeight(1)
	fill(255)
	textFont('Helvetica');
	textSize(24)
	let mX = floor(mouseX/tileWidth)
	let mY = floor(mouseY/tileHeight)
	let pmX = floor(pmouseX/tileWidth)
	let pmY = floor(pmouseY/tileHeight)
	// text("X: "+ mX, 16, width/4);
	// text("Y: "+ mY, 16, width/5);
	pop()

///// Board ///////////////////////////////////////////////
	for (let i = 0; i < goalMap.length; i++){
			for(let j = 0; j < goalMap[i].length; j++){
				let x = j * tileWidth + tilePadding
				let y = i *tileHeight + tilePadding
				tile = goalMap[i][j]
//////////////////////////////////////////////////////////
				stroke(253, 252, 220,255)
				strokeWeight(1)

				// Tile blue
				if (tile === 1){
					strokeWeight(1)
					fill(66, 83, 159,150)
					rect(x,y,tileWidth,tileHeight)

				}
				//Tile red
				else if (tile === 2){
					strokeWeight(1)
					fill(135, 13, 72,150)
					rect(x,y,tileWidth,tileHeight)

				}
				//Tile yellow
				else if (tile === 3){
					strokeWeight(1)
					fill(204, 164, 59,150)
					rect(x,y,tileWidth,tileHeight)

				}
				//Tile empty
				 else if (tile == 0) {
					fill(23, 19, 42)
					strokeWeight(1)
					stroke(253, 252, 220,255)
					rect(x,y,tileWidth,tileHeight)

					strokeWeight(4)
					stroke(253, 252, 220,40)
					rect(x,y,tileWidth,tileHeight)

				}

				else if (tile == 9) {
					fill(253, 252, 220,255)
					rect(x,y,tileWidth,tileHeight)
				}

				push()
				if( inside(x, y, tileWidth,tileHeight) ){
					noFill()
					stroke(0, 252, 0,255)
					strokeWeight(5)
					rect(x,y,tileWidth,tileHeight)
					if (mouseIsPressed){
						fill(0,250,0,50)
						rect(x,y,tileWidth,tileHeight)
						// console.log(mX,mY,pmX,pmY)
						if (mX - pmX < 0){
							// console.log("left")
							moveLeft(mY)
						} else if (mX - pmX > 0){
							// console.log("right")
							moveRight(mY)
						} else if (mY - pmY < 0){
							moveUp(mX)
							// console.log("up")
						} else if (mY - pmY > 0){
							moveDown(mX)
							// console.log("down")
						}
					}
				} else {
						noStroke()
					}
				pop()
			}
		}

	///// Tokens ////////////////////////////////////////////
	for (let i = 0; i < tileMap.length; i++){
			for(let j = 0; j < tileMap[i].length; j++){
				let x = j * tileWidth + tilePadding
				let y = i * tileHeight + tilePadding
				let token = tileMap[i][j]

//////////////////////////////////////////////////////////
				// strokeWeight(4)
				fill(255,0)
				// ellipseMode(CORNER);
				// Token blue
				if (token === 1){
					strokeWeight(2)
					stroke(100, 189, 251,255)
					ellipse(x+tileWidth/2,y+tileHeight/2,tileHeight-8)

					strokeWeight(6)
					stroke(100, 189, 251,40)
					ellipse(x+tileWidth/2,y+tileHeight/2,tileHeight-8)

				}
				// Token red
				else if (token === 2) {
					strokeWeight(2)
					stroke(257, 47, 143,255)
					ellipse(x+tileWidth/2,y+tileHeight/2,tileHeight-8)

					strokeWeight(6)
					stroke(257, 47, 143,40)
					ellipse(x+tileWidth/2,y+tileHeight/2,tileHeight-8)
				}
				// Token yellow
				else if (token === 3) {
					strokeWeight(2)
					stroke(249, 251, 61,255)
					ellipse(x+tileWidth/2,y+tileHeight/2,tileHeight-8)

					strokeWeight(6)
					stroke(249, 251, 61,40)
					ellipse(x+tileWidth/2,y+tileHeight/2,tileHeight-8)
				}
		}
	}
}
