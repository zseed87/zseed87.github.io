;(function(){
	//一、二级菜单参数配置
	var list_one = ["表格操作","小控件","小游戏"];
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
			{"title":"可搜索的下拉框","url":"select/"},
			{"title":"简单的加载中动画","url":"loader/loader.html"}
		],
		[
			{"title":"../","url":"index.html"},
			{"title":"2048","url":"2048/"},
			{"title":"正方体6面翻转","url":"css3/cube.html"}
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
})();