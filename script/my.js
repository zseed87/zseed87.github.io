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

function appendBefore(obj, nObj){
	var oParent = obj.parentNode;
	if(oParent){
		oParent.insertBefore(nObj, obj);
	}
}

function appendAfter(obj, nObj){
	var oParent = obj.parentNode;
	if(oParent){
		var oNext = obj.nextSibling;
		if(oNext){
			oParent.insertBefore(nObj, oNext);
		}else{
			oParent.appendChild(nObj);
		}
	}
}

function hasClass(obj, cls) {
    return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(obj, cls) {
    if (!this.hasClass(obj, cls)) obj.className += " " + cls;
}

function removeClass(obj, cls) {
    if (hasClass(obj, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        obj.className = obj.className.replace(reg, ' ');
    }
}

function toggleClass(obj,cls){
    if(hasClass(obj,cls)){
        removeClass(obj, cls);
    }else{
        addClass(obj, cls);
    }
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

function parseURL(url) {
    var a =  document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':',''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function(){
            var ret = {},
                seg = a.search.replace(/^\?/,'').split('&'),
                len = seg.length, i = 0, s;
            for (;i<len;i++) {
                if (!seg[i]) { continue; }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
        hash: a.hash.replace('#',''),
        path: a.pathname.replace(/^([^\/])/,'/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
        segments: a.pathname.replace(/^\//,'').split('/')
    };
}

/*事件绑定*/
function onEvent(type, elem, eventHandle){
	if(elem.addEventListener){
		elem.addEventListener(type, eventHandle, false);
	}else if(elem.attachEvent) {
		elem.attachEvent("on" + type, eventHandle);
	}
}

function offEvent(type, elem, eventHandle){
	if(elem.removeEventListener){
		elem.removeEventListener(type, eventHandle, false);
	}else if(elem.detachEvent) {
		elem.detachEvent("on" + type, eventHandle);
	}
}