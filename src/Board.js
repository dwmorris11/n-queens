// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var row = this.attributes[rowIndex];
      var reducer = (accumulator,currentValue) => accumulator + currentValue;
      var conflictCounter = row.reduce(reducer);

      if(conflictCounter > 1){
        return true;
      }

      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      return _.some(this.attributes, (row, index) => {
        if(Array.isArray(row)){
          if(this.hasRowConflictAt(index)) {
            return true;
          }
        }
      });

      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var board = this.attributes;
      var column = [];
        //Loop through every row
        for(var key in board){
          var row = board[key];
          //verify row is an array
          if(Array.isArray(row)){
            //push the value to the column array
            column.push(row[colIndex]);
          }
        }
        //check the column array for conflicts
        var reducer = (accumulator,currentValue) => accumulator + currentValue;
        var conflictCounter = column.reduce(reducer);

        if (conflictCounter > 1) {
          return true;
        }

      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var board = this.attributes;
      //Loop through every column
      for(var i=0; i < board.n; i++){
        if(this.hasColConflictAt(i)){
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      var size = this.get('n');
      var count = 0;
      var rowIdx = 0;
      var colIdx = majorDiagonalColumnIndexAtFirstRow;

      for ( ; rowIdx < size && colIdx < size; rowIdx++, colIdx++ ) {
        if ( colIdx >= 0 ) {
          var row = this.get(rowIdx);
          count += row[colIdx];
        }
      }

      return count > 1;
          },
    //   var board = this.attributes;
    //   console.log("board:", board);
    //   var index = majorDiagonalColumnIndexAtFirstRow;
    //   console.log("index: ", index);
    //   var total = 0;
    //   if(board[0][index] === 1) {
    //     total = 1;
    //   } else if (board[index][0] === 1) {
    //     total = 1;
    //   }
    //   for(var i=0; i < board.n-1; i++) {
    //     var row = board[i+1];
    //     if(Array.isArray(row)) {
    //       var column = index + 1;
    //       console.log("(" + row + ", " + column + ")");
    //       if(row[column] !== 0) {
    //         total++;
    //         if(total > 1) {
    //           console.log("true");
    //           return true;
    //         }
    //       }
    //     }
    //   }
    //   console.log("false");
    //   return false;
    // },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //  var size = this.get('n');

      // for ( var i = 1 - size; i < size; i++ ) {
      //   if ( this.hasMajorDiagonalConflictAt(i) ) {
      //     return true;
      //   }
      // }

      // return false;
      //     },

          var size = this.get('n');

          for ( var i = 1 - size; i < size; i++ ) {
            if ( this.hasMajorDiagonalConflictAt(i) ) {
              return true;
            }
          }

          return false;
              },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

      var size = this.get('n');
      var count = 0;
      var rowIdx = 0;
      var colIdx = minorDiagonalColumnIndexAtFirstRow;

      for ( ; rowIdx < size && colIdx >= 0; rowIdx++, colIdx-- ) {
        if ( colIdx < size ) {
          var row = this.get(rowIdx);
          count += row[colIdx];
        }
      }

      return count > 1;

    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {

      var size = this.get('n');

      for ( var i = (size * 2) - 1; i >= 0; i-- ) {
        if ( this.hasMinorDiagonalConflictAt(i) ) {
          return true;
        }
      }

      return false;
    }

    // hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {

    //   var board = this.attributes;
    //   var index = minorDiagonalColumnIndexAtFirstRow;
    //   var total = 0;
    //   var n = board.n - 1;
    //   var column = -1;
    //   // iterate from n to 0
    //   if(index >= 0) {
    //   for( var i = index; i >= 0; i--){
    //     var row = board[i];
    //     if(Array.isArray(row)){
    //       column++;
    //       if(row[column] !== 0){
    //         total++;
    //         if (total > 1){
    //           return true;
    //         }
    //       }
    //     }
    //   }
    // }
    // column = Math.abs(index)-1;
    // if(index < 0) {
    //   for( var i = n; i > 1; i--){
    //     var row = board[i];
    //     if(Array.isArray(row)){
    //       column++;
    //       if(row[column] !== 0){
    //         total++;
    //         if (total > 1){
    //           return true;
    //         }
    //       }
    //     }
    //   }
    // }
    //   return false;
    // },

    // // test if any minor diagonals on this board contain conflicts
    // hasAnyMinorDiagonalConflicts: function() {
    //   var board = this.attributes;
    //   var n = board.n-1;
    //   for(var i=n; i >= -n; i--){
    //     if(this.hasMinorDiagonalConflictAt(i)){
    //       return true;
    //     }
    //   }
    //   return false;
    // }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
