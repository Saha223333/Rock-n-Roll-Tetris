class shapeBox extends Shape
{
    constructor(startX, startY, blockSize, color = "green")
    {
        super(startX, startY, blockSize, color);//call ancestor constructor
        this.color = color;

        var block = new Block(this.blocks[0].x + blockSize, this.blocks[0].y, blockSize, this.color);//second block, right next to head
        this.blocks.push(block);//[1]

        block = new Block(this.blocks[0].x, this.blocks[0].y - blockSize, blockSize, this.color);    
        this.blocks.push(block);//[2]

        block = new Block(this.blocks[0].x + blockSize, this.blocks[0].y - blockSize, blockSize, this.color);    
        this.blocks.push(block);//[3]
    }

    moveDown(backgroundColor, direction = "ArrowDown", createShapeBool = true)
    {
        var blocksToCheck = [];
        blocksToCheck.push(this.blocks[0]);
        blocksToCheck.push(this.blocks[1]);

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

    moveLeft(backgroundColor, direction = "ArrowLeft")
    {
        var blocksToCheck = [];

        blocksToCheck.push(this.blocks[0]);
        blocksToCheck.push(this.blocks[2]);

        super.moveSideways(backgroundColor, direction, 0, this.blocks.length, 1, blocksToCheck);
    }

    moveRight(backgroundColor, direction = "ArrowRight")
    {
        var blocksToCheck = [];

        blocksToCheck.push(this.blocks[1]);
        blocksToCheck.push(this.blocks[3]);

        super.moveSideways(backgroundColor, direction, this.blocks.length - 1, -1, -1, blocksToCheck);
    }
}