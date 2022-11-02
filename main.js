var isPause = null;
var audio = null;
var interval = null;
var canvas = document.getElementById("canvas");

var currentBlock = null;
var currentShape = null;

const ctx = canvas.getContext("2d");
const canvasWidthInput = document.getElementById("canvasWidthInput");
const canvaHeightInput = document.getElementById("canvaHeightInput");
const blockSizeInput = document.getElementById("blockSizeInput");
var rows = canvasHeightInput.valueAsNumber;
var cols = canvasWidthInput.valueAsNumber;
var blockSize = blockSizeInput.valueAsNumber;

var speedMultiplier = 10;//lesser - faster
var intervalTime = 0;

var startX = 3 * blockSize;
var startY = 0;

var score = 0;

function startGame(background)
{
    if (isPause != null) 
    {
        if (isPause == true)  
        { 
            resumeGame(); 
            return;
        }
    }

    intervalTime = 100 * speedMultiplier;//begin with second

    initMusic();

    debugInfo(arguments.callee.name, null, null, arguments.callee.caller.name);

    rows = canvasHeightInput.valueAsNumber;
    cols = canvasWidthInput.valueAsNumber;
    blockSize = blockSizeInput.valueAsNumber;

    initCanvas(background, false, rows, cols, blockSize) 
    this.currentBlock = new Block(startX, startY, blockSize, "red");
    createShape();

    if (!interval)//if interval is not running (defined)
    {
        interval = window.setInterval(fallRoutine, intervalTime, background);
    }

    isPause = false;
}

function loadBody(background)
{
    initCanvas(background, true, rows, cols, blockSize);
}

function initMusic()
{
    var songs = [
                "Guns And Roses - Paradise City",
                "Guns And Roses - Sweet Child o'Mine",
                "Guns And Roses - Welcome To The Jungle"
                ]; 

    var randomSong = getRandomInt(0, songs.length);
    var currentSong = songs[randomSong];

    if (audio)
    {
        audio.pause();
        audio = null;//delete reference?
    }

    audio = new Audio("music/" + currentSong + ".mp3");
    audio.play();

    const songLabel = document.getElementById("songLabel");
          songLabel.innerHTML = currentSong; 

    focusCanvas();
}

function focusCanvas()
{
    canvas.tabIndex = -1;
    canvas.focus();
}

function resumeGame()
{
    isPause = false;
    if (!audio.paused) playMusic();

    focusCanvas();
}

function pauseGame()
{
    isPause = true;

    pauseMusic();
}

function playMusic()
{
    if (audio && audio.paused)
    {
        audio.play();
    }

    focusCanvas();
}

function pauseMusic()
{
    if (audio && !audio.paused)
    {
        audio.pause();
    }

    focusCanvas();
}

function createBlock()
{
    this.currentBlock = new Block(startX, startY, blockSize, "red");
    this.currentBlock.draw(ctx);

    debugInfo(arguments.callee.name, this.currentBlock.x + ", " + this.currentBlock.y, null,  arguments.callee.caller.name);
}

function createShape()
{
    var randomShape = getRandomInt(2, 12);
    //choosing random shape class
    switch (randomShape)
    {
        case 1: { this.currentShape = new Shape(startX, startY, blockSize, "green");} break;
        case 2: { this.currentShape = new shapeRod(startX, startY, blockSize, "#01579B".toLowerCase());} break;
        case 3: { this.currentShape = new shapeBox(startX, startY, blockSize, "#33691E".toLowerCase());} break;
        case 4: { this.currentShape = new shapeSup(startX, startY, blockSize, "#C2185B".toLowerCase());} break;
        case 5: { this.currentShape = new shapeSupMir(startX, startY, blockSize, "#FB8C00".toLowerCase());} break;
        case 6: { this.currentShape = new shapeRussianG(startX, startY, blockSize, "#455A64".toLowerCase());} break;
        case 7: { this.currentShape = new shapeMirL(startX, startY, blockSize, "#2E4053".toLowerCase());} break;
        case 8: { this.currentShape = new shapeTeaUp(startX, startY, blockSize, "#996600".toLowerCase());} break;
        case 9: { this.currentShape = new shapeTeaDown(startX, startY, blockSize, "#999900".toLowerCase());} break;
        case 10: { this.currentShape = new shapeRussianMirG(startX, startY, blockSize, "#CC00FF".toLowerCase());} break;
        case 11: { this.currentShape = new shapeL(startX, startY, blockSize, "#B03A2E".toLowerCase());} break;
    }
    
    debugInfo(arguments.callee.name, this.currentShape.x + ", " + this.currentShape.y, null,  arguments.callee.caller.name);
}

function fallRoutine(backgroundColor, direction)
{  
    if (!isPause)
    {
        if (this.moveShape(backgroundColor, direction))//shape fell
        {
            scanRows(canvas.height, canvas.width, blockSize, backgroundColor); 
        }
    }
}

function moveShape(backgroundColor, direction)
{
    if (isPause) return;//forbid any moving

    if (this.currentShape.move(ctx, backgroundColor, direction, true) == true)
    {
        this.createShape();
        return true;
    }
}

function moveBlock(backgroundColor, direction, createNewBlock, block = this.currentBlock)
{
    debugInfo("moveBlock", direction, null, "fallRoutine");

    deltaCoords = block.setDirection(direction);

    if (block.checkCollision(backgroundColor, deltaCoords[0], deltaCoords[1], direction))
    {
        if (direction == "ArrowDown")
        {//if collision was detected whilst falling (moving down)  
            if (createNewBlock) 
            { 
                this.createBlock();//by default block is red. So here it recreates red block 
            }
        }            
        return;
    }

    previousCoords = block.moveByKey(direction);

    block.transition(ctx, backgroundColor, previousCoords[0], previousCoords[1]);// note that coords are already altered, so delete at previous coords
}

function scanRows(bucketHeight, bucketWidth, blockSize, backgroundColor)
{   
    debugInfo("start " + "scanRows", bucketHeight + ", " + bucketWidth, null, "fallBlockRoutine");

    //here we scan filled rows of bucket in order to clean them
    var rows = bucketHeight / blockSize;
    var cols = bucketWidth / blockSize;

    var blocksInRow = 0;
    var rowToClear = 0;

    for (let r = 0; r < rows; r++)//y, loop through rows
    {//in every row
        rowToClear = r;//remember current row number in case it will be filled

        for (let c = 0; c < cols; c++)//x, loop through cols
        {//check every column     
            var currentColor = getColor((c * blockSize) + blockSize / 2,
                                        (r * blockSize) + blockSize / 2,
                                        ctx);

            if (currentColor != backgroundColor)
            {
            //if pixel color is not as background 
                blocksInRow += 1;//increase blocks in a row qty               
            }
        }

        if (blocksInRow == cols)
        {//clearing filled rows and bring upper rows down
            debugInfo("return rowToClear = ", rowToClear, null, "scanRows");
            clearFilledRow(rowToClear, bucketWidth, blockSize, backgroundColor);
            bringRowsDown(backgroundColor, bucketWidth, rowToClear);      
        }

        blocksInRow = 0;//reset qty of blocks in next row   
    }

    return 0;
}

function clearFilledRow(rowToClear, bucketWidth, blockSize, backgroundColor)
{
    debugInfo("start clearFilledRow", rowToClear, null, "fallBlockRoutine");

    var cols = bucketWidth / blockSize;//calculate how many columns are in the bucket
    
    paintRow(0, 0, cols, rowToClear, "yellow")

    //delete row
    delay(100).then(() =>
    {   
        debugInfo("init deleteRow", rowToClear, null, "clearFilledRow");
        deleteRow(0, 0, cols, rowToClear, backgroundColor);
    }
    );
}

function bringRowsDown(backgroundColor, bucketWidth, initRow, direction = "ArrowDown")
{
    delay(100).then(() =>
    {
        debugInfo("start bringRowsDown", null, null, "fallBlockRoutine");

        var cols = bucketWidth / blockSize;
        //init row - first row to bring down
        for (let r = initRow; r > 0; r--)//y, loop through rows from bottom to top 
        {   
            debugInfo("row = ", r, null, "bringRowsDown");

            for (let c = 0; c < cols; c++)//x, loop through cols
            {//check every column    
                debugInfo("col = ", c, null, "bringRowsDown");
                
                //assign current block coords
                this.currentBlock.x = c * blockSize;//column
                this.currentBlock.y = r * blockSize;//row

                //move current block down
                var currentColor = getColor((c * blockSize) + blockSize / 2,
                                            (r * blockSize) + blockSize / 2,
                                            ctx);
                this.currentBlock.color = currentColor;//setting color in order to retain color of block that is being dragged down
                if (currentColor != backgroundColor)
                {
                    this.moveBlock(backgroundColor, direction, false);            
                }  
            }
        }

        this.currentBlock.x = this.startX;
        this.currentBlock.y = this.startY; 
    }
    );
}

function deleteRow(x, y, cols, rowToClear, backgroundColor)
{
    debugInfo("start deleteRow", rowToClear, null, "clearFilledRow");
    for (let c = 0; c < cols; c++)
    { 
        x = c * blockSize;
        y = rowToClear * blockSize;
        //delete row
        this.deleteBlock(ctx, backgroundColor, x, y, blockSize);
        this.setScores(); //called for every block  
    }  
}

function deleteBlock(ctx, backgroundColor, x, y, size)
{
    ctx.lineWidth = 2;
    ctx.fillStyle = backgroundColor;
    ctx.strokeStyle = backgroundColor;
    ctx.fillRect(x, y, size, size);
    ctx.strokeRect(x, y, size, size);
}

function paintBlock(ctx, color, x, y, size)
{
    ctx.lineWidth = 2;
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.strokeRect(x, y, size, size);
}

function paintRow(x, y, cols, rowToClear, color)
{
    debugInfo("start paintRow", rowToClear, null, "clearFilledRow");
    for (let c = 0; c < cols; c++)
    { 
        x = c * blockSize;
        y = rowToClear * blockSize;
        //paint row
        this.paintBlock(ctx, color, x, y, blockSize);
    }  
}

function setScores()
{
    score += 50;

    const lblScores = document.getElementById("scoresLabel");
          lblScores.innerHTML = score;

    intervalTime += -((0.001*score));//function of interval from scores. Change current interval. 20000 scores is 100 rows. At 20000 interval will be reduced to 0ms

    if (interval) 
    {
         window.clearInterval(interval); 
         interval = window.setInterval(fallRoutine, intervalTime, '#7fffd4');

    }

    const lblLevel = document.getElementById("levelLabel");
          lblLevel.innerHTML = intervalTime;
}