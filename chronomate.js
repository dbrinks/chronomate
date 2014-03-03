
(function(){
    "use strict";


    var Chronomate = function($el, options){
        this.$el = $el;
        this.op = options;

        this.matrix = null;
        this.bounds = {
            rows: null,
            cols: null
        };

        this.setupMatrix();

        return {
            animate: $.proxy(this.animate, this),
            refresh: $.proxy(this.setupMatrix, this)
        }
    }

    Chronomate.prototype = {
        setupMatrix: function(){
            var $rows = this.$el.children(),
                bounds = this.bounds;

            bounds.rows = $rows.length;
            bounds.cols = 0;

            this.matrix = new Array(bounds.rows);

            for(var r = 0; r < bounds.rows; r++){
                var $row = $($rows[r]),
                    $cells = $row.children();

                if(bounds.cols < $cells.length){
                    bounds.cols = $cells.length;
                }

                this.matrix[r] = new Array(bounds.cols);

                for(var c = 0; c < bounds.cols; c++){
                    this.matrix[r][c] = $($cells[c]);
                }
            }
        },

        animate: function(pattern, animation){
            this.setUpTimeouts(pattern, this.getAnimationParameters(animation));
        },

        setUpTimeouts: function(pattern, params){
            var delayFunction = $.chronomate.delayFunctions[pattern],
                animationParameters = [params.delay, params.bounds.rows, params.bounds.cols],
                matrix = params.matrix;

            for(var r = 0, rlen = matrix.length; r < rlen; r++){
                var row = matrix[r];

                for(var c = 0, clen = row.length; c < clen; c++){
                    var animate = params.callback.bind(row[c]);

                    setTimeout(animate, delayFunction.apply({row: r, col: c}, animationParameters));
                }
            }
        },

        getAnimationParameters: function(animation){
            return {
                matrix: this.matrix,
                bounds: this.bounds,
                delay: this.op.delay,
                callback: animation || this.op.jsAnimation
            }
        }
    };


    $.fn.chronomate = function(options){
        return this.each(function(){
            var $this = $(this),
                anim = new Chronomate($this, options);

            $this.data("CellAnimation", anim);
        });
    }

    $.chronomate = {

        delayFunctions: {
            instant: function(){
                return 0;
            },
            random: function(delay, rowCount, colCount){
                return delay * (Math.random() * rowCount * colCount);
            },
            // left to right, top to bottom
            l2rt2b: function(delay, rowCount, colCount){
                return delay * (this.row * colCount + this.col);
            },
            // left to right, bottom to top
            l2rb2t: function(delay, rowCount, colCount){
                return delay * ((rowCount - 1 - this.row) * colCount + this.col);
            },
            // right to left, top to bottom
            r2lt2b: function(delay, rowCount, colCount){
                return delay * (this.row * colCount + colCount - this.col - 1);
            },
            // right to left, bottom to top
            r2lb2t: function(delay, rowCount, colCount){
                return delay * ((rowCount - 1 - this.row) * colCount + colCount - this.col - 1);
            },
            // top to bottom, left to right
            t2bl2r: function(delay, rowCount, colCount){
                return delay * (this.col * rowCount + this.row);
            },
            // top to bottom, right to left
            t2br2l: function(delay, rowCount, colCount){
                return delay * ((colCount - 1 - this.col) * rowCount + this.row);
            },
            // bottom to top, left to right
            b2tl2r: function(delay, rowCount, colCount){
                return delay * (this.col * rowCount + rowCount - this.row);
            },
            // bottom to top, right to left
            b2tr2l: function(delay, rowCount, colCount){
                return delay * ((colCount - 1 - this.col) * rowCount + rowCount - this.row);
            },
            tl2brCorner: function(delay, rowCount, colCount){
                return delay * (this.col + this.row);
            },
            tr2blCorner: function(delay, rowCount, colCount){
                return delay * (colCount - this.col + this.row);
            },
            bl2trCorner: function(delay, rowCount, colCount){
                return delay * (this.col + rowCount - this.row);
            },
            br2tlCorner: function(delay, rowCount, colCount){
                return delay * (colCount - this.col +  rowCount - this.row);
            },
            t2bRows: function(delay, rowCount, colCount){
                return delay * this.row;
            },
            b2tRows: function(delay, rowCount, colCount){
                return delay * (rowCount - this.row);
            },
            l2rColumns: function(delay, rowCount, colCount){
                return delay * this.col;
            },
            r2lColumns: function(delay, rowCount, colCount){
                return delay * (colCount - this.col);
            },
            expandRows: function(delay, rowCount, colCount){
                return delay * Math.abs(this.row - Math.floor(rowCount/2));
            },
            collapseRows: function(delay, rowCount, colCount){
                var halfRows = Math.floor(rowCount/2)
                return delay * (halfRows - Math.abs(this.row - halfRows));
            },
            expandColumns: function(delay, rowCount, colCount){
                return delay * Math.abs(this.col - Math.floor(colCount/2));
            },
            collapseColumns: function(delay, rowCount, colCount){
                var halfCols = Math.floor(colCount/2);
                return delay * (halfCols - Math.abs(this.col - halfCols));
            }
        }
    };

})();