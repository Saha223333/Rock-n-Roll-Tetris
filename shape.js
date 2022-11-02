class Shape//single-block shape, an ancestor of complex shapes
{
    constructor(startX, startY, blockSize, color = "green", rdx = 0, rdy = 0)
    {
        this.blocks = [];
        var block = new Block(startX, startY, blockSize, color, rdx, rdy); 
        this.blocks.push(block);//adding new block to array
        this.currentForm = 0;
    }

    delete(backgroundColor = "#7fffd4")
    {
        for (let s = 0; s < this.blocks.length; s++)
        {
            var block = this.blocks[s];
            block.delete(ctx, backgroundColor);
        }
    }

    move(ctx, backgroundColor, direction = "ArrowDown", createShapeBool = true)
    {//consider direction and implement specific scenario for every direction
        var collision = false;

        switch(direction)
        {
            case "ArrowUp": { this.rotate(ctx, backgroundColor); } break;
            case "ArrowLeft": { collision = this.moveLeft(backgroundColor, direction, createShapeBool); } break; 
            case "ArrowRight": { collision = this.moveRight(backgroundColor, direction, createShapeBool); }  break;
            default: { collision = this.moveDown(backgroundColor, direction, createShapeBool); } //default direction is down
        }

        return collision;
    }
    
    mv(block, s, backgroundColor, direction)
    {
        block = this.blocks[s];
        
        var deltaCoords = block.setDirection(direction);
        
        if (block.checkCollision(backgroundColor, deltaCoords[0], deltaCoords[1], s, direction))
        {          
            return true;//else check next block's state in shape
        }      
                    
        var previousCoords = block.moveByKey(direction);
        block.transition(ctx, backgroundColor, previousCoords[0], previousCoords[1]);

        return false;
    }

    moveSideways(backgroundColor, direction, s, f, i, blocksToCheck = [])
    {
        if (blocksToCheck.length > 0)
        {
            if (this.checkBlocksCollisionByDirection(blocksToCheck, backgroundColor, direction))
            { 
                return false;
            }
        }

        var block = null;

        while (s != f)
        {
            if (this.mv(block, s, backgroundColor, direction))
            {
                continue;
            }

            s += i;
        }
        return false;
    }

    moveDown(backgroundColor, direction = "ArrowDown", createShapeBool = true)
    {
        var block = null;
        //!!!this algorithm suits for horizontal rod ONLY!
        for (let s = 0; s < this.blocks.length; s++)
        {//shape looping from leftmost to rightmost block
            block = this.blocks[s];

            var deltaCoords = block.setDirection(direction);   
            //---------is this kostyl???---------------
            var cycleBreaker = false;//flag if inner loop must be left
            for (let q = 1; q < this.blocks.length; q++)
            {//checking state of blocks to the right of current block in order to verify if they fell and therefore shape stopped falling
                var adjacentRightBlock = this.blocks[s + q];//current block plus next to him and next and next etc.
                var deltaCoordsRight = [];
                var rightBlockCollisionBool = false;

                if (adjacentRightBlock != null)
                {//checking of right block can fall down
                    deltaCoordsRight = adjacentRightBlock.setDirection(direction);
                    rightBlockCollisionBool = adjacentRightBlock.checkCollision(backgroundColor, deltaCoordsRight[0], deltaCoordsRight[1], direction);
                    if (rightBlockCollisionBool)//right adjacent block stopped         
                    {//then
                        cycleBreaker = true;
                        break;
                    }
                }
            }

            if (cycleBreaker == true) { continue; }//skip current block if adjacent right block had fell and shape stopped
            //---------end of kostyl???----------------
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

    checkBlocksCollisionByDirection(blocks, backgroundColor, direction = "ArrowDown")
    {
        var deltaCoords = [];

        for (let b = 0; b <= blocks.length - 1; b++)
        {
            deltaCoords = blocks[b].setDirection(direction);

            if (blocks[b].checkCollision(backgroundColor, deltaCoords[0], deltaCoords[1]))
            {
                return true;
            }
        }

    }

    rotate(ctx, backgroundColor, shiftX = 0, shiftY = 0)
    {
        this.createBlindSpots(ctx, false, shiftX, shiftY)
        if (!this.checkBlindSpots(this.blindSpots)) { return false; }//checking possibility of rotating

        //rotating
        for (let s = 0; s <= this.blocks.length - 1; s++)
        {
            var previousCoords = [];
            var dx = this.blocks[s].rdx;
            var dy = this.blocks[s].rdy;

            if (this.currentForm == 1)//current from is vertical
            {//then turn to horizontal
                dx *= -1;
                dy *= -1;

                dx += shiftX;
                dy += shiftY;
            }
            
            previousCoords = this.blocks[s].moveByCoords(this.blocks[s].x + dx//x
                                                        ,this.blocks[s].y + dy//y
                                                        );
            
            this.blocks[s].transition(ctx, backgroundColor
                                                        , previousCoords[0]//x
                                                        , previousCoords[1]//y
                                                        );
        }

        this.checkCurrentForm();
    }

    createBlindSpots(ctx, show = false, shiftX = 0, shiftY = 0)
    {
        this.blindSpots = [];
        this.checkCurrentForm();

        for (let s = 0; s <= this.blocks.length - 1; s++)
        {
            var block = null;
            var dx = this.blocks[s].rdx;
            var dy = this.blocks[s].rdy;

            if (this.currentForm == 1)//current from is vertical
            {//then turn to horizontal
                dx *= -1;
                dy *= -1;

                dx += shiftX;
                dy += shiftY;
            }

            block = new Block(this.blocks[s].x + dx + this.blocks[s].size / 2,
                              this.blocks[s].y + dy + this.blocks[s].size / 2, 7, "magenta");

            var currentColor = getColor(block.x, block.y, ctx);

            if (currentColor == this.color)
            {//can't place blind spots on shape itself !!!BUT CAN BLEND WITH SHAPES WITH SAME COLOR!!!
                continue; 
            }

            if (show) block.draw(ctx);
            this.blindSpots.push(block); 
        }
    }

    checkBlindSpots(blindSpots)
    {
        var block = null;

        for (let i = 0; i <= blindSpots.length - 1; i++)
        {
            block = blindSpots[i];
            if (block.checkCollisionByCoords(block.x, block.y) == true) { return false; }//rotation cannot be performed
        }

        return true;
    }
}