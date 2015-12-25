// function getFoo () {
//   return new Promise(function (resolve, reject){
//     resolve('foo');
//   });
// }

// var g = function* () {
//   try {
//     var foo = yield getFoo();
//     console.log(foo);
//   } catch (e) {
//     console.log(e);
//   }
// };

// function run (generator) {
//   var it = generator();

//   function go(result) {
//     if (result.done) return result.value;

//     return result.value.then(function (value) {
//       return go(it.next(value));
//     }, function (error) {
//       return go(it.throw(value));
//     });
//   }

//   go(it.next());
// }

// run(g);

class Person{
	constructor(name, age){
		this.name = name;
		this.age = age;
	}
	toString(){
		return this.name + ' is ' + this.age + ' age.';
	}
}

let liLei = new Person('李磊', 18);
// console.log(liLei.toString());

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    // this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}

let colorPoint = new ColorPoint(3, 4, '#ccc');

// console.log(colorPoint instanceof ColorPoint); // true
// console.log(colorPoint instanceof Point);  // true

// class Group {
// 	set prop(val){
// 		this.name = val;
// 	}
// 	get prop(){
// 		return this.name;
// 	}
// }

// let group = new Group();
// group.prop = 'group1';
// console.log(group.name);

class Foo {
  static classMethod() {
    return 'hello';
  }
}
console.log(Foo.classMethod());	 // 'hello'
var foo = new Foo();
// foo.classMethod()	//静态方法不能被实例调用