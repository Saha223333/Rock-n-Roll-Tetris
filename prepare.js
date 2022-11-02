

function initCanvas(background, addEventListenerBool, rows = 15, cols = 8, blockSize = 40) 
{
    //need to paint background color manually on order to analize pixels colors while checking blocks collisions
    const canvasWidth = cols * blockSize;
    const canvasHeight = rows * blockSize;
    const canvas = document.getElementById("canvas");
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    canvas.tabIndex = -1;
    canvas.focus();
    //add onkeydown event listener to canvas in order not to capture keyboard events by body
    if (addEventListenerBool) canvas.addEventListener("keydown", function(event){ 
                                                                                moveShape('#7fffd4', event.key) 
                                                                                }
                                                                                , false);
}

function getColor(x, y, ctx)
{
    var adjacentBlockPixel = ctx.getImageData(x, y, 1, 1).data;//get adjacent block pixel

    var red = adjacentBlockPixel[0].toString(16).padStart(2, '0');//string hex representation
    var green = adjacentBlockPixel[1].toString(16).padStart(2, '0');
    var blue = adjacentBlockPixel[2].toString(16).padStart(2, '0');

    return pixelColor = "#" + (red + green + blue)
}

function delay(ms) 
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

function debugInfo(funcName, params = "''", level = "''", funcCaller = "none")
{
    console.log(funcName + "(" + params + "), level=" + level + ", caller=" + funcCaller);
}

function getRandomInt(min, max) 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //the maximum is exclusive and the minimum is inclusive
}