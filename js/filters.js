var app = angular.module('App.filters', []);

//自适应图片
app.filter('adaptBg', [function () {
    return function (address) {
        if (!address) return "";
        return {
        	'background': 'url(' + address + ') 50% 50% / cover no-repeat'
        }
    }
}]);

//100%图片
app.filter('allBg', [function () {
    return function (address) {
        if (!address) return "";
        return {
        	'background': 'url(' + address + ') 50% 50% / 100% 100% no-repeat'
        }
    }
}]);

app.filter('zeroFill', [function () {
    return function (input) {
        input = parseInt(input, 10);
        if (input < 10) input = "0" + input;
        return input;
    }
}]);

//限定文字长度
app.filter('cut', [function () {
	/*	例子
	 * {{i.start_time | cut:11:5}}
	 */
	return function (value, tail, max) {
	   
	   if (!value) return '';

	   max = parseInt(max, 10);
	   
	   if(typeof value == 'number'){
	   		value = value.toString();
	   }
	   if (value.length <= max) return value;
	   if (!max) return value;
		
	   value = value.substr(tail, max);
	
	   return value
	}
}]);

//类别
app.filter('category',function(){
	var types = {
			1	:	'男',
			2	:	'女',
	};
	return function(type){
		return types[type]	||	'--';
	};
});

