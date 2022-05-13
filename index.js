//Load boards
const easy = [
    "1------8------9-2------3---912----78--56-----67--1-3-5-9---456---45----156-------",
    "123456789456789123789123456912345678345678912678912345891234567234567891567891234"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];


  var timer;
  var timeRemaining;
  var lives;
  var selectedNum;
  var selectedTile;
  var disableSelect;
  
  window.onload = function(){
      //Run startgame function when button is clicked
    id("start-btn").addEventListener("click", startGame);

    //Add event listener to each number in number container
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function() {
           if(!disableSelect) {
               if (this.classList.contains("selected")) {
                   this.classList.remove("selected");
                   selectedNum = null;
               }else{
                   for(let i = 0; i < 9; i++ ) {
                       id("number-container").children[i].classList.remove("selected");
                   }
                    this.classList.add("selected");
                    selectedNum =this;
                    updateMove();
               }
           }
        });
        
    }
  }
  function startGame(){
    //choose board difficulty
    let board;
    if(id("diff-1").checked) board = easy[0];
    else if (id("diff-2").checked) board = medium[0];
    else board = hard[0];

    //Set lives to 3 and enable selecting numbers and tiles
    lives = 5;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: 5";
    //Create bovard based on dificulty
    generateBoard(board);

    startTimer();

    if(id("theme-1").checked) {
        qs("body").classList.remove("dark");
    }else{
        qs("body").classList.add("dark");
    }

    id("number-container").classList.remove("hidden");
}

function startTimer() {
    //Set time remaining based on input
    if(id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked)timeRemaining= 600;
    else timeRemaining = 900;

    id("timer").textContent = timeConversion(timeRemaining);

    timer = setInterval(function() {
        timeRemaining --;

        if(timeRemaining === 0 ) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000)
}

function timeConversion(time){
    let minutes = Math.floor(time /60);
    if(minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10 ) seconds = "0" + seconds;

    return minutes + ":" + seconds; 
}

function generateBoard(board) {
    //Cleare previous board
     clearPrevious();
     //Let used to increment tile ids
     let idCount = 0; 
     //Create 81 tiles
     for(let i = 0; i < 81; i++){
         //Create a new p element
         let tile = document.createElement("p");
         if(board.charAt(i) !="-"){
             tile.textContent = board.charAt(i);
         }else{
             //Add click event listener to tile
             tile.addEventListener("click", function() {
                 if(!disableSelect){
                     if(tile.classList.contains("selected")) {
                         tile.classList.remove("selected");
                         selectedTile = null; 
                    }else{
                        for(let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                 }
             });

         }
         tile.id = idCount;
         idCount ++;
         tile.classList.add("tile");
         if((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id  < 54)){
             tile.classList.add("bottomBorder");
         }
         if ((tile.id + 1)% 9 == 3 || (tile.id + 1)% 9 == 6) {
             tile.classList.add("rightBorder");
         }
         id("board").appendChild(tile);
     }
}
 
function updateMove(){
      //If a tile and a number is selected
    if(selectedTile && selectedNum){
       //Set the tile to the correct number 
        selectedTile.textContent = selectedNum.textContent;
        //If the number matches the corresponding number in the solution key
        if(checkCorrect(selectedTile)){
            //Deselect the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //cleare the selected variables
            selectedNum = null;
            selectedTile = null;
            //Check if board is completed
            if (checkDone()) {
                endGame();
            }
            //if the number does not match the solution key
        }else{
            //disable selecting new numbers for one second
            disableSelect = true; 
            //Make the tile turn red
            selectedTile.classList.add("incorrect");
            //Run in one second
            setTimeout(function() {
                //Substract lives by one
                 lives --;
                 //if no lives left rnd the game 
                 if(lives === 0) {
                    endGame();
                 } else{
                     id("lives").textContent = "Lives Remaning: " + lives;
                     disableSelect = false;
                 }
                 selectedTile.classList.remove("incorrect");
                 selectedTile.classList.remove("selected");
                 selectedNum.classList.remove("selected");

                 selectedTile.textContent = "";
                 selectedTile= null;
                 selectedNum= null;
            }, 1000);
        }
    }
}

function checkDone(){
    let tiles = qsa(".tile");
    for (let i = 0 ; i < tiles.length; i++){
        if (tiles[i].textContent === "") return false;
    }
    return true;
}

function endGame(){

    disableSelect = true;
    clearTimeout(timer);

    if(lives === 0 || timeRemaining === 0){
        id("lives").textContent = "You Lost!"; 
    }else{
        id("lives").textContent = "You Won!";
    }   
}


function checkCorrect(tile){
    let solution;
    if(id("diff-1").checked) solution = easy[1];
    else if (id("diff-2").checked) solution = medium[1];
    else solution = hard[1];

    if(solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}

function clearPrevious(){
    //Access all of the tiles
    let tiles = qsa(".tile");
    //Remove each tile
    for (let i = 0; i < tiles.length; i++) {
         tiles[i].remove();
    }
    //If there is a timer clear it
    if(timer)clearTimeout(timer);
    //Deselect any number
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    //Clear selected variables
    selectedTile = null;
    selectedNum = null; 
}
//Helper functions
  function id(id) {
      return document.getElementById(id);
  }

  function qs(selector) {
      return document.querySelector(selector);
  }
  function qsa(selector) {
      return document.querySelectorAll(selector);
  }