class shapeSupMir extends Shape
{
    constructor(startX, startY, blockSize, color = "green")
    {
        //head
        super(startX, startY - blockSize, blockSize, color, 0 * blockSize, 2 * blockSize);//call ancestor constructor
        this.color = color;

        var block = new Block(this.blocks[0].x + blockSize, this.blocks[0].y, blockSize, this.color, -1 * blockSize, 1 * blockSize);
        this.blocks.push(block);//[1]

        block = new Block(this.blocks[1].x, this.blocks[1].y + blockSize, blockSize, this.color, 0 * blockSize, 0 * blockSize);    
        this.blocks.push(block);//[2]

        block = new Block(this.blocks[2].x + blockSize, this.blocks[2].y, blockSize, this.color, -1 * blockSize, -1 * blockSize);    
        this.blocks.push(block);//[3]

        this.blindSpots = [];//declare
    }

    moveDown(backgroundColor, direction = "ArrowDown", createShapeBool = true)
    {   
        switch(this.currentForm)
        {
            case 0://horizontal form
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
                //for (let s = 0; s < this.blocks.length; s++)
                {        
                    var block = null;
                    block = this.blocks[s];
    
                    var previousCoords = block.moveByKey(direction);
                    block.transition(ctx, backgroundColor, previousCoords[0], previousCoords[1]);
                }
               
                return false;
            }

            case 1: //vertical form
            {
                var blocksToCheck = [];
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[2]);

                if (super.checkBlocksCollisionByDirection(blocksToCheck, backgroundColor, direction))
                { 
                    if (createShapeBool) 
                    {
                        return true;//shape fell
                    }  
                }

                for (let s = 0; s < this.blocks.length; s++)
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
                
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[2]);

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

    moveRight(backgroundColor, direction = "ArrowRight", createShapeBool = true)
    {
        switch(this.currentForm)
        {
            case 0: //horizontal
            {        
                var blocksToCheck = [];
                blocksToCheck.push(this.blocks[1]);
                blocksToCheck.push(this.blocks[3]);

                if (super.checkBlocksCollisionByDirection(blocksToCheck, backgroundColor, direction))
                { 
                    return false;
                }

                for (let s = this.blocks.length - 1; s >= 0; s--)
                {
                    var block = null;

                    if (super.mv(block, s, backgroundColor, direction, createShapeBool))//collided
                    {
                        continue;
                    }
                }
            } break;

            case 1: //vertical
            {
                var blocksToCheck = [];
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[2]);
                blocksToCheck.push(this.blocks[3]);

                if (super.checkBlocksCollisionByDirection(blocksToCheck, backgroundColor, direction))
                { 
                    return false;
                }

                for (let s = this.blocks.length - 1; s >= 0; s--)
                {
                    var block = null;

                    if (super.mv(block, s, backgroundColor, direction, createShapeBool))//collided
                    {
                        continue;
                    }
                }
            } break;
        }

        return false;
    }

    rotate(ctx, backgroundColor)
    { 
        super.rotate(ctx, backgroundColor, -(this.blocks[0].size), 0);
    }

    checkCurrentForm()
    {
        if (this.blocks[3].x - this.blocks[0].x == this.blocks[0].size * 2)//current form is horizontal
        {
            this.currentForm = 0;//current form is horizontal
        }

        if (this.blocks[0].y - this.blocks[3].y == this.blocks[0].size * 2) //current form is vertical
        {
            this.currentForm = 1;//current form is vertical    
        }
    }
}