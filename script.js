const board = document.querySelector(".board");
const startBtn = document.querySelector(".btn-start");
const restartBtn = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const restartGameModal = document.querySelector(".restart-game");


const highScoreElement = document.querySelector("#high-score")
const scoreElement = document.querySelector("#score")
const timeElement = document.querySelector("#time")


const blockHeight = 50;
const blockWidth = 50;

let highScore = localStorage.getItem("highScore") || 0;
let score = 0;
let time = `00-00`

highScoreElement.innerHTML=highScore;
const cols = Math.floor(board.clientWidth/blockWidth);
const rows = Math.floor(board.clientHeight/blockHeight);

const blocks = [];
let snake = [{
    x:1 , y:3
}]

let food = {x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};

let direction = "down";
let intervalId = null;
let timeInterval = null;

for (let row = 0 ; row < rows; row++){
    for(let col = 0 ; col < cols ; col++){
        const block = document.createElement("div");
        block.classList.add("block");
        board.appendChild(block);
        //block.innerHTML = `${row}-${col}`
        blocks[`${row}-${col}`] = block;
    }
}


function render(){
    let head = null;
    
    blocks[`${food.x}-${food.y}`].classList.add("food");
    if(direction==="left"){
        head = { x: snake[0].x , y: snake[0].y-1}
    }
    else if(direction==="right"){
        head = { x: snake[0].x , y: snake[0].y+1}
    }
    else if(direction==="down"){
        head = { x: snake[0].x+1 , y: snake[0].y}
    }
    else if(direction==="up"){
        head = { x: snake[0].x-1 , y: snake[0].y}
    }

    //wall collision logic
    if(head.x < 0 || head.x >=rows || head.y < 0 || head.y >= cols ){
        
        startGameModal.style.display="none";
        restartGameModal.style.display="flex";
        modal.style.display="flex";

        clearInterval(intervalId)
        intervalId = null;
        return;
    }

    //food consume logic
    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        food = {
            x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)
        };
        blocks[`${food.x}-${food.y}`].classList.add("food");
        snake.unshift(head);

        score +=10;
        scoreElement.innerHTML=score;
        if(score > highScore){
            highScore = score;
            localStorage.setItem("highScore",highScore.toString())
        }
    }
    
    clearSnake();
    snake.unshift(head)
    snake.pop()

    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    });
}

function clearSnake() {
    snake.forEach(segment => {
        blocks[`${segment.x}-${segment.y}`]?.classList.remove("fill");
    });
}

function restartGame(){
    score = 0;
    time=`00-00`
    direction="down"
    scoreElement.innerHTML= score;
    timeElement.innerHTML=time;
    highScoreElement.innerHTML= highScore;


    blocks[`${food.x}-${food.y}`].classList.remove("food");
    clearSnake();
    direction="down";
    modal.style.display="none";
    snake = [{x:1 , y:3}]
    food = {
        x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)
    };
    intervalId = setInterval(()=>{render();},200);

}

restartBtn.addEventListener("click",restartGame)


startBtn.addEventListener("click",()=>{
    clearInterval(intervalId);  
    intervalId = null;
    modal.style.display = "none";
    intervalId = setInterval(()=>{render();},200);
    timeInterval = setInterval(()=>{
        let[min,sec] = time.split("-").map(Number);

        if(sec==59){
            min +=1;
            sec = 0;
        }
        else{
            sec +=1;
        }

        time = `${min}-${sec}`
        timeElement.innerText = time;
    },1000)
})

addEventListener("keydown",(event)=>{
    
    if (event.key === "ArrowUp" && direction !== "down") direction = "up";
    else if (event.key === "ArrowDown" && direction !== "up") direction = "down";
    else if (event.key === "ArrowLeft" && direction !== "right") direction = "left";
    else if (event.key === "ArrowRight" && direction !== "left") direction = "right";
});