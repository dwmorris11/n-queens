/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other


// make recursion function (row, n, board, validator, callback)
// if all the rows === n
  // return callbacl
// iterate over the possible moves
  // put a piece down
  // if the validator === false
    // recurse with row + 1
  // undone piece
window.findSolution = function(row, n, board, validator, cb) {
  if (row === n) {
    return cb();
  }

  for (var i = 0; i < n; i++) {
    board.togglePiece(row, i);

    if (!board[validator]()) {
      findSolution(row + 1, n, board, validator, cb);
    }

    board.togglePiece(row, i);
  }
};



window.findNRooksSolution = function(n) {
  var board = new Board({n: n});
  var solution = [];

  findSolution(0, n, board, 'hasAnyRooksConflicts', function() {
    solution = _.map(board.rows(), function(row) {
      return row.slice();
    });
  });

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n: n});

  findSolution(0, n, board, 'hasAnyRooksConflicts', function () {
    solutionCount++;
  });
  // call solution function (0, n, board, "hasAnyRookConflicts", function(){ solutionCount++}

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var board = new Board({n: n});
  var solution = board.rows();

  findSolution(0, n, board, 'hasAnyQueensConflicts', function() {
    solution = _.map(board.rows(), function(row) {
      return row.slice();
    });
  });

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var board = new Board({n: n});

  findSolution(0, n, board, 'hasAnyQueensConflicts', function() {
    return solutionCount++;
  });

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
