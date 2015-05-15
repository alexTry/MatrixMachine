(function() {
	// Хак убирающий выделение нужного элемента см. (*) ниже
		$.fn.extend({ 
            disableSelection: function() { 
                this.each(function() { 
                    if (typeof this.onselectstart != 'undefined') {
                        this.onselectstart = function() { return false; };
                    } else if (typeof this.style.MozUserSelect != 'undefined') {
                        this.style.MozUserSelect = 'none';
                    } else {
                        this.onmousedown = function() { return false; };
                    }
                }); 
            } 
		});
		$('*').disableSelection(); 
	//! Конструктор матрицы
	function Matrix(obj) {
		this.col = obj.column ;
		this.row = obj.row;
		this.par = obj.parentM;
		this.disable = obj.enable || false;
		this.sum = obj.odd || false;
		this.matrix;
		this.def; 
		this.a = obj.a;
		this.b = obj.b;
		if (!this.sum) {
			this.dat = obj.dataM;
			this.matrix = this.start();
		} else {
		this.dat = this.odd(this.a, this.b);
		this.matrix = this.start();
		}
		this.def = this.matrix;
	}
	//! Prototype матрицы
	Matrix.prototype = {
		 // Очистка матрицы от ячеек
		clear: function(){
			$( this.par).children('.center').empty();
			return this;
		},
		// построение матриц
		start: function() { 
			var arr = [],
				k = 0,
				oneArray = [],
				key;
			// проверка на двумерность массива dataM	
			for (key in this.dat){ 
				if (this.dat.hasOwnProperty(key)){
				    if(this.dat[key].length){
					    for (var i = 0; i< this.dat[key].length ; i +=1){
							// создаем одномерный массив oneArray
						    oneArray.push(this.dat[key][i]);
					    };
				    };
				}
			};
			if (oneArray.length !== 0){ // Если oneArray существует, то заменяем данные в dataM  на oneArray
				this.dat = oneArray;
			}
			for (var i = 0; i < this.row; i += 1) {
				arr[i] = []; 
				for (var j = 0; j < this.col; j += 1) {
					if (!this.dat){
						
						arr[i][j] = 0;
					} else {
if (!this.dat[k]){
								this.dat[k] = 0; // если парраметров нет, то берем значение по умолчанию =  10
							} 
							arr[i][j] = this.dat[k];	
							k +=1;
							

					}
					var inp = $('<input/>').attr({'type':'text','value':arr[i][j]}).addClass('matrix');
					if (this.disable) {
						$(inp).attr('disabled','disabled').css({'background-color':'rgb(242,242,242)','color':'rgb(201,201,201)'});
					}
					$( this.par + ' .center').append(inp);
				}
				$( this.par + ' .center').append($('<br>'));
			}
			if(!this.sum){
				
				this.eventsM();
				};
			return arr;
		},
		odd: function (A,B) { // умножение матриц
		    var rowsA = A.length, colsA = A[0].length,
		        rowsB = B.length, colsB = B[0].length,
		        C = [];
		    if (colsA != rowsB) return false;
		    for (var i = 0; i < rowsA; i++) C[i] = [];
		    for (var k = 0; k < colsB; k++) { 
			    for (var i = 0; i < rowsA; i++) {
					var t = 0;
					for (var j = 0; j < rowsB; j++) {
						t += A[i][j]*B[j][k];
						C[i][k] = t;
		          	}
		        }
		    }
			return C;
		}, 
		eventsM: function() { // prorotype method Events Focus In/Out for Cell
			
			var par = this.par + '.inline input[type=text]';
			
			$(par).focusin(function(e){
				even = $(e.target).parents('.inline')[0].id;
				if (matA.col === matB.row) {
				$('#sidebar').css({'background-color':'rgb(81,153,219)'});
				$('.error').css({'display':'none'});
				}
				if (even === 'matrixA') {
					$('#selA').prop( "checked", true );
					$('#selB').prop( "checked", false );
					selM = matA;
				} else {
					$('#selB').prop( "checked", true );
					$('#selA').prop( "checked", false );
					selM = matB;
				}
			});

			$(par).focusout(function(e){
				$('#sidebar').css({'background-color':'rgb(188,188,188)'});
				$('.error').css({'display':'none'});
				newC();
// 				this.dat = this.getDataFromCell(); // записываем ячейку в память
				
			});
		},
		getDataFromCell: function(t) {
			var dataFromCell = $(this.par).children().find('input[type=text]'),
				newData = [],
				k = 0;
			for (var i = 0; i < this.row; i +=1) {
				newData[i] = [];
				if (!t){
					for (var j = 0; j < this.col; j += 1) {
						newData[i][j] = dataFromCell[k].value;
						k += 1;
					}
				} else if(t === true) {
					for (var j = 0; j <= this.col; j += 1) {
						if (j< this.col) {		
							newData[i][j] = dataFromCell[k].value;
							k += 1;
						} else {	
							newData[i][j] = 0;
						}
						
					}
					
				} else if (t === 'cut') {
					
					for (var j = 0; j < this.col - 1 ; j += 1) {
						newData[i][j] = dataFromCell[k].value;
							k += 1;
					}
					k += 1;
// 					alert(newData);
				} 
			}
			
			return newData;
		}
	}
	//! Инициализация ячеек A, B, C
	var matA = new Matrix({
			column: 2,
			row: 4,
			parentM: '#matrixA'
		});
	var matB = new Matrix({
			column: 3,
			row: 2,
			parentM: '#matrixB'
		});	
	var selM = matA;
	var matC;
	newC(true);	
	//! Events:
	// Кнопка умножения
	$('#add').click(function(){
		newC();
	});
	// Очистка матриц
	$('#zero').click(function() {
		matA.dat = matA.def;
		matB.dat = matB.def;
		matC.dat = matC.def;
		matA.clear().start();
		matB.clear().start();
		matC.clear().start();
		
	});
	// выбор матрицы
	$('input[type=radio]').click(function(e){
		if (e.target.id === 'selA') {
			selM = matA;
		} else {
			selM = matB;
		};
	});
	//! Кнопки добавления/удаления
	// Add row
	$('#addR').click(function(e) {
		if (selM.row < 10) {
			selM.dat = selM.getDataFromCell();
			selM.row += 1;
			selM.clear().start();
		}
		newC();
		
	});
	// Del row
	$('#delR').click(function(e) {
		if (selM.row > 2) {
			selM.dat = selM.getDataFromCell();
			selM.row -= 1;
			selM.clear().start();
		}
		newC();
	});
	// Add col
	$('#addC').click(function(e) {
		if (selM.col < 10) {
			selM.dat = selM.getDataFromCell(true);
			
			selM.col += 1;
			selM.clear().start();
		}
		newC();
	});
	// Del col
	$('#delC').click(function(e) {
		if (selM.col > 2) {
			selM.dat = selM.getDataFromCell('cut');
			selM.col -= 1;
			
			selM.clear().start();
		}
		
		newC();
		
	});
	$('#changeView').click(function(e) {
		var newObj =  {
			newAr:  matB.col,
			newAc: matB.row,
			newBr: matA.col,
			newBc: matA.row,
			newArrayA: matA.getDataFromCell(),
			newArrayB: matB.getDataFromCell()
		}
		matA.row = newObj.newAr;
		matA.col = newObj.newAc;
		matB.row = newObj.newBr;
		matB.col = newObj.newBc;
		matA.dat = newObj.newArrayB;
		matB.dat = newObj.newArrayA;
		matA.clear().start();
		matB.clear().start();
		newC();
	})
	function newC(t) {
		if (!t) {
		matC.clear();
		
		}
		matC = new Matrix({
			column: matB.col,
			row: matA.row,
			parentM: '#result',
			enable: true,
			odd: true,
			a: matA.matrix,
			b: matB.matrix
		});
		matC.dat = matC.odd(matA.getDataFromCell(), matB.getDataFromCell());
			matC.clear().start();	
		if (matA.col === matB.row) {
			$('#sidebar').css({'background-color':'rgb(188,188,188)'});
			$('.error').css({'display':'none'});
		} else {
			$('#sidebar').css({'background-color':'rgb(246,193,192)'});
			$('.error').css({'display':'block'});
		}	
		
	}
	$('head').append($('<style />').html('.container{ width: ' + window.screen.availWidth + 'px !important;}'));
})();