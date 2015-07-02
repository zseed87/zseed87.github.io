function getByClass(selector, parent){
	parent = parent ? parent : document;
	if(parent.getElementsByClassName){
		return parent.getElementsByClassName(selector);
	}else{
		var oAll = parent.getElementsByTagName('*');
		var arr = [];
		var len = oAll.length;
		for(var i = 0; i < len; i++){
			var aAll = oAll[i].className.split(' ');
			var l = aAll.length;
			for(var j = 0; j < l; j++){
				if(aAll[j] == selector){
					arr.push(oAll[i]);
					break;
				}
			}
		}
		return arr;
	}
}

function getStyle(obj, attr){
	return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr];
}

function startMove(obj, json, fn, speed){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var bStop = true;		//设置变量判断所有值是否到达目标值
		for(var attr in json){
			var iCur = 0;	//获取目标当前值
			if(attr == 'opacity'){
				iCur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
			}else{
				iCur = parseInt(getStyle(obj, attr));
			}
			var sp = speed ? speed : 8;
			var iSpeed = (json[attr] - iCur) / sp;	//计算速度
			iSpeed = iSpeed > 0 ? Math.ceil(iSpeed) : Math.floor(iSpeed);
			if(iCur != json[attr]){		//判断是否到达目标值
				bStop = false;
			}
			if(attr == 'opacity'){
				iCur += iSpeed;
				obj.style.filter = 'alpha(opacity:'+ iCur +')';
				obj.style.opacity = iCur / 100;
			}else{
				obj.style[attr] = iCur + iSpeed + 'px';
			}
		}
		if(bStop){
			clearInterval(obj.timer);
			if(fn)	fn();
		}
	}, 30);
}

// 阻止事件冒泡
function stopBubble(e){
    if(e && e.stopPropagation){
        e.stopPropagation();
    }
    else{
        e.cancelBubble=true;
    }
    return false;
}
