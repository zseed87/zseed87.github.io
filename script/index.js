;(function(){
	//一、二级菜单参数配置
	var list_one = ["表格操作", "小控件", "小游戏", "canvas特效"];
	var list_two = [
		[
			{"title":"../","url":"index.html"},
			{"title":"表格行:hover效果","url":"table/table1.html"},
			{"title":"表格行添加和删除","url":"table/table2.html"},
			{"title":"表格筛选","url":"table/table3.html"}
		],
		[
			{"title":"../","url":"index.html"},
			{"title":"3D旋转木马","url":"carrousel/demo1.html"},
			{"title":"仿妙味图片轮播","url":"carrousel/demo2.html"},
			{"title":"CSS3图片轮播百叶窗特效","url":"carrousel/coolImg.html"},
			{"title":"可搜索的下拉框","url":"select/"},
			{"title":"简单的选项卡","url":"tab/"},
			{"title":"简单的加载中动画","url":"loader/loader.html"}
		],
		[
			{"title":"../","url":"index.html"},
			{"title":"2048","url":"2048/"},
			{"title":"正方体6面翻转","url":"css3/cube.html"}
		],
		[
			{"title":"../","url":"index.html"},
			{"title":"网站导航背景","url":"canvas/demo2.html"},
			{"title":"文字粒子化","url":"canvas/demo3.html"}
		]
	];
	var oBody = document.getElementsByTagName('body')[0];
	var oBox = getByClass('list-box', oBody)[0];
	var oUl = oBox.getElementsByTagName('ul')[0];
	oUl.addEventListener("click", handler, false);		//点击事件绑定
	loadList();

	function handler(ev){
		var e = ev || event;
		if(e.target.type == 'one'){
			loadList(e.target.idx);
			e.stopPropagation();
			e.preventDefault();
		}else if(e.target.type == 'two' && e.target.innerHTML == '../'){
			loadList();
			e.stopPropagation();
			e.preventDefault();
		}
	}

	function loadList(idx){		//读取当前菜单列表
		startMove(oUl, {"height": 0, "opacity": 0}, function(){
			oUl.innerHTML = "";
			var frag  = document.createDocumentFragment();
			var list = idx >= 0 ? list_two[idx] : list_one;
			for(var i = 0, len = list.length; i < len; i++){
				var li = document.createElement('li');
				li.className = 'demo-list';
				var a = document.createElement('a');
				if(idx >= 0){
					a.href = list[i].url;
					a.type = 'two';
					a.innerHTML = list[i].title;
				}else{
					a.href = '#';
					a.idx = i;
					a.type = 'one';
					a.innerHTML = list_one[i];
				}
				li.appendChild(a);
				frag.appendChild(li);
			}
			oUl.appendChild(frag);
			listAni();
		});
	}

	function listAni(){		//加载列表动画
		var len = getByClass('demo-list', oUl).length;
		var height = 45 * len + 14;
		startMove(oUl, {"height": 45 * len, "opacity": 100});
	}

	var RAF = (function () {
    	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||  function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
	})();

	var c = document.getElementById('listBg');
    var ctx = c.getContext('2d');
    var e = null;
    var dots = [];
    var i , j = 0;
    window.onresize = cResize;
    cResize();

    var mPosxy = {"x": null, "y": null, "max": 8000};
    c.onmousemove = function(ev){
        e = ev || event;
        mPosxy.x = e.clientX;
        mPosxy.y = e.clientY;
    }
    c.onmouseout = function(ev){
        e = ev || event;
        mPosxy.x = null;
        mPosxy.y = null;
    }

    for(i = 200; i--;){
        dots.push({
            "x": Math.random() * c.width,
            "y": Math.random() * c.height,
            "xa": Math.random() * 0.6,
            "ya": Math.random() * 0.6,
            "max": 6000
        });
    }

    setTimeout(function(){
        dotsMove();
    }, 100);

    function dotsMove(){
        ctx.clearRect(0, 0, c.width, c.height);

        var ndots  = [mPosxy].concat(dots);

        for(i = dots.length; i--;){
            var dot = dots[i];
            dot.x += dot.xa;
            dot.y += dot.ya;
            dot.xa = (dot.x > c.width || dot.x < 0)? -dot.xa : dot.xa;
            dot.ya = (dot.y > c.height || dot.y < 0)? -dot.ya : dot.ya;
            ctx.fillStyle = '#000';
            ctx.fillRect(dot.x - 0.5, dot.y - 0.5, 1, 1);

            for (j = ndots.length; j--;) {
                var d2 = ndots[j];
                if (dot === d2 || d2.x === null || d2.y === null) continue;
                var xc = dot.x - d2.x;
                var yc = dot.y - d2.y;
                var dis = xc * xc + yc * yc;
                var ratio;
                if(dis < d2.max){
                    if (d2 === mPosxy && dis > (d2.max / 2)) {
                        dot.x -= xc * 0.01;
                        dot.y -= yc * 0.01;
                    }
                    ratio = (d2.max - dis) / d2.max;
                    ctx.beginPath();
                    ctx.lineWidth = ratio / 2;
                    ctx.strokeStyle = 'rgba(0, 0, 0, ' + (ratio + 0.2) + ')';
                    ctx.moveTo(dot.x , dot.y);
                    ctx.lineTo(d2.x , d2.y);
                    ctx.stroke();
                }
            }
            ndots.splice(ndots.indexOf(dot), 1);
        }
        RAF(dotsMove);
    }

    function cResize(){
        c.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        c.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    }
})();