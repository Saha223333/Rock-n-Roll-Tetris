class shapeRod extends Shape
{
    constructor(startX, startY, blockSize, color = "green")
    {   
        super(startX, startY, blockSize, color, -2 * blockSize, -2 * blockSize);//call ancestor constructor
        this.color = color;//[0]
        //initialize head block
        this.blocks[0].x = startX;
        this.blocks[0].y = startY + blockSize * 2;
        //initial form is vertical
        var block = new Block(this.blocks[0].x, this.blocks[0].y - blockSize, blockSize, this.color, -1 * blockSize, -1 * blockSize);
        this.blocks.push(block);//[1]

        block = new Block(this.blocks[0].x, this.blocks[1].y - blockSize, blockSize, this.color, 0 * blockSize, 0 * blockSize);    
        this.blocks.push(block);//[2]

        block = new Block(this.blocks[0].x, this.blocks[2].y - blockSize, blockSize, this.color, 1 * blockSize, 1 * blockSize);    
        this.blocks.push(block);//[3]
 
        this.blindSpots = [];//declare
    }

    moveLeft(backgroundColor, direction = "ArrowLeft")
    {
        var blocksToCheck = [];

        switch(this.currentForm)
        {
            case 0: //vertical
            {
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[1]);
                blocksToCheck.push(this.blocks[2]);
                blocksToCheck.push(this.blocks[3]);
            } break;

            case 1: //horizontal
            {
                blocksToCheck.push(this.blocks[0]);  
            } break;
        }

        super.moveSideways(backgroundColor, direction, 0, this.blocks.length, 1, blocksToCheck);
    }

    moveRight(backgroundColor, direction = "ArrowRight")
    {
        var blocksToCheck = [];

        switch(this.currentForm)
        {
            case 0: //vertical
            {
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[1]);
                blocksToCheck.push(this.blocks[2]);
                blocksToCheck.push(this.blocks[3]);

            } break;

            case 1: //horizontal
            {
                blocksToCheck.push(this.blocks[3]);
            }
        }

        super.moveSideways(backgroundColor, direction, this.blocks.length - 1, -1, -1, blocksToCheck);
    }

    rotate(ctx, backgroundColor)
    {
        super.rotate(ctx, backgroundColor, 0, 0);
    }

    checkCurrentForm()
    {
        if (this.blocks[0].x == this.blocks[1].x) //current form is vertical
        {
            this.currentForm = 0;//current form is vertical
        }

        if (this.blocks[0].y == this.blocks[1].y) //current form is horizontal
        {
            this.currentForm = 1;//current form is horizontal    
        }
    }

    moveDown(backgroundColor, direction = "ArrowDown", createShapeBool = true)
    {   
        switch (this.currentForm)
        {
            case 0: //vertical
            {
                //use custom move algorithm
                var block = null;

                for (let s = 0; s < this.blocks.length; s++)
                {
                    block = this.blocks[s];

                    var deltaCoords = block.setDirection(direction);   

                    if (block.checkCollision(backgroundColor, deltaCoords[0], deltaCoords[1], direction))
                    {   
                        if (createShapeBool) 
                        {
                            return true;//shape fell
                        }  
                    }
        
                    var previousCoords = block.moveByKey(direction);
                    block.transition(ctx, backgroundColor, previousCoords[0], previousCoords[1]);
                }
                return false;
            }

            case 1: //horizontal
            {
                return super.moveDown(backgroundColor);//use generic move algorithm
            }
        }
    }
}
