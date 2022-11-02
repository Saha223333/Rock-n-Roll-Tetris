class shapeTeaDown extends Shape
{
    constructor(startX, startY, blockSize, color = "green")
    {
        super(startX, startY, blockSize, color, -1 * blockSize, -1 * blockSize);//call ancestor constructor
        this.color = color;//[0]

        var block = new Block(this.blocks[0].x - blockSize, this.blocks[0].y, blockSize, this.color, 0 * blockSize, 0 * blockSize);
        this.blocks.push(block);//[1]

        block = new Block(this.blocks[1].x - blockSize, this.blocks[1].y, blockSize, this.color, 0 * blockSize, 0 * blockSize);    
        this.blocks.push(block);//[2]

        block = new Block(this.blocks[2].x + blockSize, this.blocks[2].y + blockSize, blockSize, this.color, 0 * blockSize, 0 * blockSize);//nose
        this.blocks.push(block);//[3]

        this.blindSpots = [];//declare
    }

    moveDown(backgroundColor, direction = "ArrowDown", createShapeBool = true)
    {   
        switch (this.currentForm)
        {
            case 0: //horizontal
            {
                var blocksToCheck = [];
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[2]);
                blocksToCheck.push(this.blocks[3]);
    
                if (super.checkBlocksCollisionByDirection(blocksToCheck, backgroundColor, direction))
                { 
                    if (createShapeBool) 
                    {
                        return true;//shape fell
                    } 
                }

                for (let s = this.blocks.length - 1; s >= 0; s--)
                {        
                    var block = null;
                    block = this.blocks[s];
    
                    var previousCoords = block.moveByKey(direction);
                    block.transition(ctx, backgroundColor, previousCoords[0], previousCoords[1]);
                }
               
                return false;
            }

            case 1: //vertical
            {
                var blocksToCheck = [];
                blocksToCheck.push(this.blocks[2]);
                blocksToCheck.push(this.blocks[3]);
    
                if (super.checkBlocksCollisionByDirection(blocksToCheck, backgroundColor, direction))
                { 
                    if (createShapeBool) 
                    {
                        return true;//shape fell
                    } 
                }

                for (let s = this.blocks.length - 1; s >= 0; s--)
                {        
                    var block = null;
                    block = this.blocks[s];
    
                    var previousCoords = block.moveByKey(direction);
                    block.transition(ctx, backgroundColor, previousCoords[0], previousCoords[1]);
                }
               
                return false;
            }
        }
    }

    moveLeft(backgroundColor, direction = "ArrowLeft", createShapeBool = true)
    {
        var blocksToCheck = [];

        switch(this.currentForm)
        {
            case 0: //horizontal
            { 
                blocksToCheck.push(this.blocks[2]);
                blocksToCheck.push(this.blocks[3]);

            } break;

            case 1: //vertical
            {
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[2]);
                blocksToCheck.push(this.blocks[3]);

            } break;
        }

        super.moveSideways(backgroundColor, direction, this.blocks.length - 1, -1, -1, blocksToCheck);

        return false;
    }

    moveRight(backgroundColor, direction = "ArrowRight", createShapeBool = true)
    {
        var blocksToCheck = [];

        switch(this.currentForm)
        {
            case 0: //horizontal
            {         
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[3]);

            } break;

            case 1: //vertical
            {
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[1]);
                blocksToCheck.push(this.blocks[3]);
                
            } break;
        }
        
        super.moveSideways(backgroundColor, direction, 0, this.blocks.length, 1, blocksToCheck);

        return false;
    }

    rotate(ctx, backgroundColor)
    { 
        super.rotate(ctx, backgroundColor, 0, 0);
    }

    checkCurrentForm()
    {
        if (this.blocks[0].y == this.blocks[2].y)//current form is horizontal
        {
            this.currentForm = 0;//current form is horizontal
        }

        if (this.blocks[0].x == this.blocks[3].x) //current form is vertical
        {
            this.currentForm = 1;//current form is vertical    
        }
    }
}