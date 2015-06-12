//symmetry(10403);		无聊写的一个函数，输出堆成的数字如：11,121,134431...
function symmetry(num){
	num = num.toString();
	var len = Math.floor(num.length / 2);
	var str1 = num.slice(0, len);
	var str2 = num.slice(-len);
	var str3 = "";

	for(var i = len-1; i >= 0; i--){
		str3 += str2[i];
	}
	if(str3 == str1){
		console.log(num);
	}
	if(num > 11){
		arguments.callee(num - 1);
	}
}
