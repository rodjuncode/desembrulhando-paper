// ###################################################################################
// your annotations go here!!!
// ###################################################################################

var annotations = [
  'DESEMBRULHANDO\nO PAPER.JS',
  '/ INTRO\n/ TOUR\n/ MÃO NA MASSA',
  '/ CODEJAM?\n/ CÂMERA',
  'QUEM É RODJUN?',
  '📷🌄🎣🏈🎸🍺📚 &\nPROGRAMADOR &\nDESIGNER',
  'COMO PROGRAMADOR\n/ desde o século XX\n/ back-end dev\n😒',
  'COMO DESIGNER\n/ ótimo programador\n/ tipografia\n😁',
  '/ SISTEMAS\n/ DESIGN GENERATIVO \n/ CRIAR FERRAMENTAS',
  'COMO ESSA\nAPRESENTAÇÃO😎\n#paperjs',
  '❌not\n(expert em paper.js)',
  'RODJUN.COM\n@RODJUNART\nRODJUNJUN',
  'QUEM É PAPER.JS?',
  '❌not\n(p5.js)',
  '/ JAVASCRIPT\n/ CANVAS\n/ SCRIPTOGRAPHER\n',
  '"The Swiss Army Knife\nof Vector Graphics\nScripting"',
  '✨',
  '/ LIVE CODING I (básico)\n/ LIVE CODING II (ferramenta)\n',
  '/ p5 EDITOR😏\n/ 36 DAYS OF TYPE "M"',
  '/ SKETCH💡\n/ JAM🎶',
]



// ###################################################################################
// config
// ###################################################################################
var mouseModifier = 0;
var boardsQty = annotations.length;
var boardColor = '#f3b61f';
var boardUsedColor = '#ffd168';
var bgColor = '#ccc';
var boardSize = {
  min: {
    w: 400,
    h: 400
  },
  max: {
    w: 700,
    h: 500
  } 
}
var usedBoardSize = boardSize.min.w/3;
var annotationColor = '#000';
var annotationSize = 45;
var annotatioFamily = 'forma-djr-banner';
var annotationAlign = 'left';


// ###################################################################################
// aux (don't mess with it)
// ###################################################################################
var annotationIndex = 0;
var frame = 0;
var selectedBoard;
var boards = [];


// ###################################################################################
// creating elements
// ###################################################################################

// a nice background
var bg = new Path.Rectangle({
  point: [0, 0],
  size: [view.size.width, view.size.height],
  fillColor: bgColor
});

// create all boards
for (var i = 0; i < boardsQty; i++) {
  boards[i] = createBoard();
}

// annotations
var annotation = new PointText();
annotation.fillColor = annotationColor;
annotation.fontFamily = annotatioFamily;
annotation.fontSize = annotationSize;
annotation.justification = annotationAlign;
annotation.leading = annotation.fontSize*1.1;
annotation.content = annotations[annotationIndex];
annotation.position = new Point(view.size.width/2, view.size.height/2)


// ###################################################################################
// events
// ###################################################################################

function onFrame(event) {
  frame++;
  mouseModifier -= 0.01;
  if (mouseModifier < 0) {
    mouseModifier = 0;
  }  
  for (var i = 0; i < boards.length; i++) {
      var b = boards[i];
      if (b !== selectedBoard && !b.data.used) {
        b.rotate(b.data.rotationDir*(b.data.rotationSpeed+mouseModifier));
      }
      if (b.data.used && b.bounds.width > usedBoardSize) {
        b.scale(0.9);
      }
  }
}

function onMouseMove(event) {
  if (selectedBoard !== undefined) {
    selectedBoard.position = event.point;  
  }
  mouseModifier += event.delta.length*0.0008;
}

function onMouseDown(event) {
  if (event.event.button == 2) { // right-click
    if (annotationIndex > 0) {
      annotationIndex--;
      annotation.content = annotations[annotationIndex];  
      annotation.position.x = view.size.width/2;
      annotation.position.y = view.size.height/2;
      boards.push(createBoard());
      annotation.bringToFront();
    }
  }
}



// ###################################################################################
// functions
// ###################################################################################

function createBoard() {
  var board = new Path();
  // random points on each quadrant
  var p1 = (new Point((boardSize.max.w-boardSize.min.w)/2, (boardSize.max.h-boardSize.min.h)/2) * Point.random()) 
            + (new Point(boardSize.min.w/2,boardSize.min.h/2));
  var p2 = (new Point(-(boardSize.max.w-boardSize.min.w)/2, (boardSize.max.h-boardSize.min.h)/2) * Point.random()) 
            + (new Point(-boardSize.min.w/2,boardSize.min.h/2));
  var p3 = (new Point(-(boardSize.max.w-boardSize.min.w)/2, -(boardSize.max.h-boardSize.min.h)/2) * Point.random()) 
            + (new Point(-boardSize.min.w/2,-boardSize.min.h/2));
  var p4 = (new Point((boardSize.max.w-boardSize.min.w)/2, -(boardSize.max.h-boardSize.min.h)/2) * Point.random()) 
            + (new Point(boardSize.min.w/2,-boardSize.min.h/2));
  board.add(view.center+p1);
  board.add(view.center+p2);
  board.add(view.center+p3);
  board.add(view.center+p4);
  // config
  board.fillColor = boardColor;
  board.closed = true; 
  // data
  board.data.rotationSpeed = Math.random();
  board.data.rotationDir = Math.random() > 0.5 ? 1 : -1;
  board.data.used = false;
  // onclick function  
  board.onClick = function(event) {
    selectBoard(this,event);
  }
  return board;
}

function selectBoard(thisBoard, event) {
  if (event.event.button == 0) { // left-click only
    if (selectedBoard == thisBoard) { // deselects board
      selectedBoard.fullySelected = false;
      selectedBoard.opacity = 1;
      selectedBoard.data.used = true;
      selectedBoard.tween(
        { fillColor: bgColor },
        {
          easing: 'easeInOutCubic',
          duration: 800
        }
      );      
      if (annotationIndex >= annotations.length) { // finishes presentation
        bg.tween(
          { fillColor: boardColor },
          {
            easing: 'easeOutCubic',
            duration: 10000
          }
        );
      }
      selectedBoard = undefined;
    } else {
      if (!thisBoard.data.used) { // selects board
        annotationIndex++;        
        if (annotationIndex < annotations.length) {
          updateAnnotation();
        } else {
          annotation.remove();
        }
        thisBoard.fullySelected = true;
        thisBoard.opacity = 0.3;      
        selectedBoard = thisBoard;      
      }
    }
  }
}

function updateAnnotation() {
  annotation.content = annotations[annotationIndex];  
  // update position to center it
  annotation.position.x = view.size.width/2;
  annotation.position.y = view.size.height/2;
}