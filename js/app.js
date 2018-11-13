// 这是我们的玩家要躲避的敌人 
var Enemy = function(originx,originy,speed) {
    // 要应用到每个敌人的实例的变量写在这里
    // 我们已经提供了一个来帮助你实现更多

    //类实例化的时候的 初始位置
    this.x = originx;
    this.y = originy;
    this.speed = speed;

    //移动到窗体之外后，不再 调用update
    this.outofWindow = false;

    // 敌人的图片，用一个我们提供的工具函数来轻松的加载文件
    this.sprite = 'images/enemy-bug.png';
};

//窗口大小，用于判断是否出界
const windowHeight = 606;
const windowWidth = 505;

//玩家每次移动的距离
const player_move_distance_x = 101;
const player_move_distance_y = 81;

//玩家每次初始化时y 值
const player_init_y = 405;

console.log(windowHeight);
console.log(windowWidth);

// 此为游戏必须的函数，用来更新敌人的位置
// 参数: dt ，表示时间间隙
Enemy.prototype.update = function(dt) {
    // 你应该给每一次的移动都乘以 dt 参数，以此来保证游戏在所有的电脑上
    // 都是以同样的速度运行的

    //一个敌人移除窗体之外后，往数组中添加一个，形成川流不息的bug 部队。
    if(this.x > 505 && !this.outofWindow){
        this.outofWindow = true;
        let speed = getEnemyRandomSpeed();

        allEnemies.push(new Enemy(0,getEnemyRandomy(),speed));

        return;
    }
    //只做水平方向的移动
    this.x =  (this.x+dt*this.speed) ;

    //检测碰撞
    if(checkImpact(this,player)){
        let x = getPlayerinitXRandom();
        alert("我去！你的角色被虫子吃掉了.");
        player.resetpostion(x*player_move_distance_x,player_init_y);
    }

};

function getPlayerinitXRandom(){
    return Math.round(Math.random()*4);
}

// 此为游戏必须的函数，用来在屏幕上画出敌人，
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

class Player{
    constructor(x,y){

        //初始位置为 (1/2width,height)
        this.x = x;
        this.y = y;

        //玩家图片
        this.playerImg = 'images/char-boy.png';
    }

    update(){
        if(this.x < 0){
            this.x = 0;
        }
        if(this.x > 404){
            this.x = 404;
        }

        if(this.y > player_init_y){
            this.y = player_init_y;
        }
        if(this.y < 81){
            alert("哇塞，你赢了，好腻害~");
            player.resetpostion(getPlayerinitXRandom()*player_move_distance_x,player_init_y);
        }
    }

    resetpostion(x,y){
        this.x = x;
        this.y = y;
    }

    render(){
      ctx.drawImage(Resources.get(this.playerImg),this.x,this.y);
    }

    handleInput(keycode){

        switch (keycode) {
            case 'left':
                this.x -= player_move_distance_x;

                break;
            case 'right':
                this.x += player_move_distance_x;
                break;
            case 'up':
                this.y -= player_move_distance_y;
                break;
            case 'down':
                this.y += player_move_distance_y;
                break;
        }

        this.update();


    }

}
// 现在实现你自己的玩家类
// 这个类需要一个 update() 函数， render() 函数和一个 handleInput()函数


// 现在实例化你的所有对象
// 把所有敌人的对象都放进一个叫 allEnemies 的数组里面
// 把玩家对象放进一个叫 player 的变量里面

const allEnemies =[new Enemy(0,56,15*4),new Enemy(0,140,20*3),new Enemy(0,224,25*6)];
const enemy_y_options = [56,140,224];
const  player = new Player(202,player_init_y);
const img_object_width = 101;


function getEnemyRandomy(){
    return enemy_y_options[Math.round(Math.random()*2)];
}

function getEnemyRandomSpeed() {
    return 20 * Math.round(Math.random()*4 + 1);
}


function checkImpact(enemy,player){
    //找到碰撞物体的中心点
    let enemy_center_x = enemy.x + img_object_width/2;
    let enemy_center_y = enemy.y + img_object_width;

    let player_center_x = player.x + img_object_width/2;
    let player_center_y = player.y +img_object_width;

    //测量两个中心点间的距离，如果距离小于图片宽度的一半，则说明，相撞了。

    let xdiff = Math.abs(enemy_center_x-player_center_x);
    let ydiff = Math.abs(enemy_center_y-player_center_y);

    let object_distance = Math.sqrt( Math.pow(xdiff,2)+ Math.pow(ydiff,2));

    if(object_distance < img_object_width * 0.7){
        return true;
    }else{
        return false;
    }

}


// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Player.handleInput()
// 方法里面。你不需要再更改这段代码了。
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
