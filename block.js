class Block
{
    constructor(x, y, size = 40, color = "red", rdx = 0, rdy = 0)
    {
        this.x = x;
        this.y = y;
        this.rdx = rdx;
        this.rdy = rdy;
        this.size = size;
        this.color = color;
    }

    checkCollision(backgroundColor, dx = 0, dy = 0)
    { //the best is to return not boolean, but color!
        var x = this.x + dx;
        var y = this.y + dy;

        var currentColor = getColor(x, y, ctx);

        if (currentColor != backgroundColor)//if pixel color is not as background, then place is occupied by an other block
        {
            return true;//collision detected                                 
        }

        return false;//collision is not detected
    }

    checkCollisionByCoords(x = 0, y = 0, backgroundColor = "#7fffd4")
    { 
        var currentColor = getColor(x, y, ctx);

        if (currentColor != backgroundColor)//if pixel color is not as background, then place is occupied by an other block
        {
            return true;//collision detected                                 
        }

        return false;//collision is not detected
    }

    draw(ctx, x = this.x, y = this.y, txt = 0) 
    { 
        ctx.lineWidth = 2;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "#7fffd4";
        ctx.fillRect(x, y, this.size, this.size, 2);
        ctx.strokeRect(x, y, this.size, this.size);
    }

    delete(ctx, backgroundColor, x = this.x, y = this.y)
    {
        ctx.lineWidth = 2;
        ctx.fillStyle = backgroundColor;
        ctx.strokeStyle = "#7fffd4";
        ctx.fillRect(x, y, this.size, this.size);
        ctx.strokeRect(x, y, this.size, this.size);
    }

    transition(ctx, backgroundColor, x, y, del = true)
    {   
        if (del == true)
        {
            this.delete(ctx, backgroundColor, x, y);
        }
        this.draw(ctx); 
    }

    setDirection(key)
    {
        var dx = 0;
        var dy = 0;

        switch (key) 
        {
            case "ArrowRight":  //move right
                dx = this.size + this.size / 2;
                dy = this.size / 2;
            break;
                
            case "ArrowLeft": //move left
                dx = -(this.size / 2);
                dy =   this.size / 2;
            break;

            case "ArrowDown": //move down
                dx = this.size / 2;
                dy = this.size + this.size / 2;
            break;

            case "ArrowUp": //move up
                dy = -(this.size / 2);
            break;
        }

        debugInfo("setDirection", key + ", dx=" + dx + ", dy=" + dy, "''",  "fallBlockRoutine");
        return [dx, dy];
    }

    moveByKey(key) 
    {      
        var prevX = this.x;
        var prevY = this.y;

        //change coordinates
        switch (key) 
        {
            case "ArrowRight":  //move right
                this.x += this.size;
            break;
                
            case "ArrowLeft": //move left
                this.x -= this.size;
            break;

            case "ArrowDown": //move down
                this.y += this.size;
            break;

            case "ArrowUp": //move up
                this.y -= this.size;
            break;
        }
        return [prevX, prevY];//return previous coordinates in array [0=x, 1=y]
    }

    moveByCoords(x, y)
    {
        var prevX = this.x;
        var prevY = this.y;

        this.x = x;
        this.y = y;

        return [prevX, prevY];
    }
}