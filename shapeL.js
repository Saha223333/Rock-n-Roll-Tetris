class shapeL extends Shape
{
    constructor(startX, startY, blockSize, color = "green")
    {
        super(startX, startY, blockSize, color, -2 * blockSize, 0 * blockSize);//call ancestor constructor
        this.color = color;

        //initialize head block
        this.blocks[0].x = startX;
        this.blocks[0].y = startY + blockSize * 2;
        //initial form is vertical (0)
        var block = new Block(this.blocks[0].x - blockSize, this.blocks[0].y, blockSize, this.color, -1 * blockSize, -1 * blockSize);
        this.blocks.push(block);//[1]

        block = new Block(this.blocks[1].x, this.blocks[1].y - blockSize, blockSize, this.color, 0 * blockSize, 0 * blockSize);    
        this.blocks.push(block);//[2]

        block = new Block(this.blocks[2].x, this.blocks[2].y - blockSize, blockSize, this.color, 1 * blockSize, 1 * blockSize);    
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
                blocksToCheck.push(this.blocks[1]);
                blocksToCheck.push(this.blocks[2]);
                blocksToCheck.push(this.blocks[3]);
                super.moveSideways(backgroundColor, direction, this.blocks.length - 1, -1 , -1, blocksToCheck);
            } break;

            case 1: //horizontal
            {
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[1]);
                super.moveSideways(backgroundColor, direction, 0, this.blocks.length, 1, blocksToCheck);
            } break;
        } 

        return false;
    }

    moveRight(backgroundColor, direction = "ArrowRight")
    {
        var blocksToCheck = [];

        switch(this.currentForm)
        {
            case 0: //vertical
            {        
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[2]);
                blocksToCheck.push(this.blocks[3]);
                super.moveSideways(backgroundColor, direction, 0, this.blocks.length, 1, blocksToCheck);

            } break;

            case 1: //horizontal
            {
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[3]);
                super.moveSideways(backgroundColor, direction, this.blocks.length - 1, -1, -1, blocksToCheck);
            } break;
        }

        
        return false;
    }

    moveDown(backgroundColor, direction = "ArrowDown", createShapeBool = true)
    {   
        var blocksToCheck = [];

        switch (this.currentForm)
        {
            case 0: //vertical
            {        
                blocksToCheck.push(this.blocks[0]);
                blocksToCheck.push(this.blocks[1]);
    
                if (super.checkBlocksCollisionByDirection(blocksToCheck, backgroundColor, direction))
                { 
                    if (createShapeBool) 
                    {
                        return true;//shape fell
                    } 
                }

                for (let s = 0; s <= this.blocks.length - 1; s++)
                {        
                    var block = null;
                    block = this.blocks[s];
    
                    var previousCoords = block.moveByKey(direction);
                    block.transition(ctx, backgroundColor, previousCoords[0], previousCoords[1]);
                }
               
                return false;
            }

            case 1: //horizontal
            {
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

                for (let s = 0; s <= this.blocks.length - 1; s++)
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

    rotate(ctx, backgroundColor)
    { 
        super.rotate(ctx, backgroundColor, 0, 0);
    }

    checkCurrentForm()
    {
        if (this.blocks[3].x - this.blocks[0].x == this.blocks[0].size * 2)//current form is horizontal
        {
            this.currentForm = 1;//current form is horizontal
        }

        if (this.blocks[0].y - this.blocks[3].y == this.blocks[0].size * 2) //current form is vertical
        {
            this.currentForm = 0;//current form is vertical    
        }
    }

}