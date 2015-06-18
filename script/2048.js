var Game2048 = function(c, m){
	this.score = 0;		//当前分数
	this.cellNum = [];	//格子上的数字
	this.merge = [];		//当前格子是否合并
	this.oScore = document.getElementById('Score').getElementsByTagName('span')[0];	//当前分数对象
	this.oHScore = document.getElementById('HighScore').getElementsByTagName('span')[0];	//历史分数对象
	this.cSpeed = c || 4;	//格子生成速度，默认为4，数值越小速度越快
	this.mSpeed = m || 4;	//格子移动速度，默认为4，数值越小速度越快
	this.newGame();
}
Game2048.prototype = {
	initGame: function(){//初始化游戏
		this.score = 0;
		if(window.localStorage){
			var hScore = window.localStorage.getItem("JUEMINGZI_2048");
			if(hScore){
				this.oHScore.innerHTML = hScore;
			}
		}
		for(var i = 0; i < 4; i++){
			this.cellNum[i] = [];
			this.merge[i] = [];
			for(var j = 0; j < 4; j++){
				this.cellNum[i][j] = 0;
				this.merge[i][j] = false;
			}
		}
	},
	newGame: function(){//生成新游戏
		this.initGame();
		this.updateCellNum();
		this.oScore.innerHTML = 0;
		//监听方向键事件
		var target = this;
		document.addEventListener("keydown", this.handler.bind(this), false);
		this.createCellNum();
		this.createCellNum();
	},
	isGameOver: function(){//游戏是否结束
		if (this.noSpace() && this.noMove()) this.gameOver();
	},
	gameOver: function(){//游戏结束
		document.removeEventListener("keydown", this.handler, false);
		if(window.localStorage){
			var hScore = window.localStorage.getItem("JUEMINGZI_2048");
			if((hScore && Number(hScore) < this.score) || !hScore){
				window.localStorage.setItem("JUEMINGZI_2048", this.score);
			}
		}
		if(confirm('游戏结束！是否重新开始？')){
			this.newGame();
		}
	},
	createCellNum: function(){//随机生成新格子
		if(this.noSpace()) return false;
		var randX = 0, randY = 0, randNum = 0;
		do{
			randX = Math.floor(Math.random() * 4);
			randY = Math.floor(Math.random() * 4);
		}while(this.cellNum[randX][randY] !== 0)
		randNum = Math.random() > 0.5 ? 2 : 4;
		this.cellNum[randX][randY] = randNum;
		this.showCellNum(randX, randY, randNum);
	},
	showCellNum: function(posX, posY, num){//新格子生成动画
		var oCell = document.getElementById('num-'+posX+'-'+posY);
		var left = parseInt(getStyle(oCell, "left"));
		var top = parseInt(getStyle(oCell, "top"));
		this.setBgColor(oCell, num);
		oCell.innerHTML = num;
		oCell.style.left = left + 50 + 'px';
		oCell.style.top = top + 50 + 'px';
		startMove(oCell, {
			"width": 100,
			"height": 100,
			"top": top,
			"left": left,
			"fontSize": 32,
			"opacity": 100}, null, this.cSpeed);
	},
	setBgColor: function(oCell, num){//根据数值设置格子颜色
		var bgColor = '';
		switch( num ) {
			case 2: bgColor = '#EBE5D9'; break;
			case 4: bgColor = '#EADFC3'; break;
			case 8: bgColor = '#F1B078'; break;
			case 16: bgColor = '#F49461'; break;
			case 32: bgColor = '#F37C5E'; break;
			case 64: bgColor = '#F25C37'; break;
			case 128: bgColor = '#edcf72'; break;
			case 256: bgColor = '#edcc61'; break;
			case 512: bgColor = '#9c0'; break;
			case 1024: bgColor = '#33b5e5'; break;
			case 2048: bgColor = '#09c'; break;
			case 4096: bgColor = '#a6c'; break;
			case 8192: bgColor = '#93c'; break;
			default: bgColor = '#000';
		}
		oCell.style.backgroundColor = bgColor;
	},
	handler: function(ev){//根据方向键移动格子
		var target = this;
		var fn = function() {
			setTimeout(target.createCellNum.bind(target), 150);
			setTimeout(target.isGameOver.bind(target), 400);
		};
		var e = ev || event;
		switch (e.keyCode) {
			case 37:
				this.moveLeft() && fn();
				break;
			case 38:
				this.moveUp() && fn();
				break;
			case 39:
				this.moveRight() && fn();
				break;
			case 40:
				this.moveDown() && fn();
				break;
			default:
				break;
		}
		e.preventDefault();
	},
	moveLeft: function(){//往左移动
		if(!this.canMoveLeft())	return false;
		for(var i = 0; i < 4; i++){
			for(var j = 1; j < 4; j++){
				if(this.cellNum[i][j] !== 0) {
					for(var k = 0; k < j; k++){
						if((this.cellNum[i][k] === 0 || this.cellNum[i][k] === this.cellNum[i][j]) && this.noBlockHorizontal(i, k, j) && !this.merge[i][k]){
							this.moveCellNumm(i, j, i, k);
							if(this.cellNum[i][k] == this.cellNum[i][j]){
								this.merge[i][k] = true;
							}
							this.cellNum[i][k] += this.cellNum[i][j];
							this.cellNum[i][j] = 0;
							this.addScore(this.cellNum[i][k]);
							break;
						}
					}
				}
			}
		}
		setTimeout(this.updateCellNum.bind(this), 150);
		return true;
	},
	moveUp: function(){//往上移动
		if(!this.canMoveUp())	return false;
		for(var i = 1; i < 4; i++){
			for(var j = 0; j < 4; j++){
				if(this.cellNum[i][j] !== 0) {
					for(var k = 0; k < i; k++){
						if((this.cellNum[k][j] === 0 || this.cellNum[k][j] === this.cellNum[i][j]) && this.noBlockVertical(i, k, j) && !this.merge[k][j]){
							this.moveCellNumm(i, j, k, j);
							if(this.cellNum[k][j] == this.cellNum[i][j]){
								this.merge[k][j] = true;
							}
							this.cellNum[k][j] += this.cellNum[i][j];
							this.cellNum[i][j] = 0;
							this.addScore(this.cellNum[k][j]);
							break;
						}
					}
				}
			}
		}
		setTimeout(this.updateCellNum.bind(this), 150);
		return true;
	},
	moveRight: function(){//往右移动
		if(!this.canMoveRight())	return false;
		for (var i = 0; i < 4; i++) {
			for (var j = 2; j >= 0; j--) {
				if(this.cellNum[i][j] !== 0) {
					for(var k = 3; k > j; k--){
						if((this.cellNum[i][k] === 0 || this.cellNum[i][k] === this.cellNum[i][j]) && this.noBlockHorizontal(i, j, k) && !this.merge[i][k]){
							this.moveCellNumm(i, j, i, k);
							if(this.cellNum[i][k] == this.cellNum[i][j]){
								this.merge[i][k] = true;
							}
							this.cellNum[i][k] += this.cellNum[i][j];
							this.cellNum[i][j] = 0;
							this.addScore(this.cellNum[i][k]);
							break;
						}
					}
				}
			}
		}
		setTimeout(this.updateCellNum.bind(this), 150);
		return true;
	},
	moveDown: function(){//往下移动
		if(!this.canMoveDown())	return false;
		for (var i = 2; i >= 0; i--) {
			for (var j = 0; j < 4; j++) {
				if(this.cellNum[i][j] !== 0) {
					for(var k = 3; k > i; k--){
						if((this.cellNum[k][j] === 0 || this.cellNum[k][j] === this.cellNum[i][j]) && this.noBlockVertical(k, i, j) && !this.merge[k][j]){
							this.moveCellNumm(i, j, k, j);
							if(this.cellNum[k][j] == this.cellNum[i][j]){
								this.merge[k][j] = true;
							}
							this.cellNum[k][j] += this.cellNum[i][j];
							this.cellNum[i][j] = 0;
							this.addScore(this.cellNum[k][j]);
							break;
						}
					}
				}
			}
		}
		setTimeout(this.updateCellNum.bind(this), 150);
		return true;
	},
	canMoveLeft: function(){//是否能向左移动
		for(var i = 0; i < 4; i++) {
			for(var j = 1; j < 4; j++) {
				if(this.cellNum[i][j] !== 0) {
					if(this.cellNum[i][j-1] === 0 || this.cellNum[i][j-1] == this.cellNum[i][j]) return true;
				}
			}
		}
		return false;
	},
	canMoveRight: function(){//是否能向右移动
		for( var i=0; i<4; i++ ) {
			for( var j=0; j<3; j++ ) {
				if( this.cellNum[i][j] !== 0 ) {
					if( this.cellNum[i][j+1] === 0 || this.cellNum[i][j+1] == this.cellNum[i][j] ) return true;
				}
			}
		}
		return false;
	},
	canMoveUp: function(){//是否能向上移动
		for( var i=1; i<4; i++ ) {
			for( var j=0; j<4; j++ ) {
				if( this.cellNum[i][j] !== 0 ) {
					if( this.cellNum[i-1][j] === 0 || this.cellNum[i-1][j] == this.cellNum[i][j] ) return true;
				}
			}
		}
		return false;
	},
	canMoveDown: function(){//是否能向下移动
		for( var i=0; i<3; i++ ) {
			for( var j=0; j<4; j++ ) {
				if( this.cellNum[i][j] !== 0 ) {
					if( this.cellNum[i+1][j] === 0 || this.cellNum[i+1][j] == this.cellNum[i][j] ) return true;
				}
			}
		}
		return false;
	},
	noBlockHorizontal: function(row, col1, col2){//判断水平方向两方块之间是否有其它方块
		for( var i=col1+1; i<col2; i++ ) {
			if( this.cellNum[row][i] !== 0 ) return false;
		}
		return true;
	},
	noBlockVertical: function(row1, row2, col){//判断垂直方向两方块之间是否有其它方块
		for( var i=row2+1; i<row1; i++ ) {
			if( this.cellNum[i][col] !== 0 ) return false;
		}
		return true;
	},
	addScore: function(num){//分数添加
		this.score += num;
		this.oScore.innerHTML = this.score;
	},
	moveCellNumm: function(formX, formY, toX, toY){//格子的移动动画
		var oCell = document.getElementById('num-'+formX+'-'+formY);
		var pos = this.getPos(toX, toY);
		startMove(oCell, {
			"left": pos.x,
			"top": pos.y
		}, null, this.mSpeed);
	},
	getPos: function(x, y){//获取目标格子的坐标
		var oCell = document.getElementById('cell-'+x+'-'+y);
		var left = parseInt(getStyle(oCell, "left"));
		var top = parseInt(getStyle(oCell, "top"));
		return {"x": left, "y": top};
	},
	updateCellNum: function(){//动画完成后更新格子信息
		var oNumBox = document.getElementById('numBox');
		oNumBox.innerHTML = "";
		var frag  = document.createDocumentFragment();
		for(var i = 0; i < 4; i++) {
			for(var j = 0; j < 4; j++) {
				var oNum = document.createElement('div');
				var num = this.cellNum[i][j];
				oNum.className = 'num';
				oNum.id = 'num-' + i + '-' + j;
				if(num !== 0){
					oNum.innerHTML = this.cellNum[i][j];
					oNum.style.width = '100px';
					oNum.style.height = '100px';
					oNum.style.fontSize = '32px';
					this.setBgColor(oNum, num);
					oNum.style.opacity = 1;
				}
				this.merge[i][j] = false;
				frag.appendChild(oNum);
			}
		}
		oNumBox.appendChild(frag);
	},
	noSpace: function(){//容器是否还有空间
		for( var i=0; i<4; i++ ) {
			for( var j=0; j<4; j++ ) {
				if( this.cellNum[i][j] === 0 ) return false;
			}
		}
		return true;
	},
	noMove: function(){//格子是否还能移动
		if( this.canMoveLeft() || this.canMoveRight() || this.canMoveUp() || this.canMoveDown() ) return false;
		return true;
	}
};
var run = new Game2048(3, 4);