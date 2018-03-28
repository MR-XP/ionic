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

//月份
app.filter('zeroFill', [function () {
    return function (input) {
        input = parseInt(input, 10);
        if (input < 10) input = "0" + input;
        return input;
    }
}]);

//限定文字长度
app.filter('cut', [function () {
	return function (value, wordwise, max, tail) {
	   if (!value) return '';
	
	   max = parseInt(max, 10);
	   if (!max) return value;
	   if (value.length <= max) return value;
	
	   value = value.substr(0, max);
	   if (wordwise) {
		   var lastspace = value.lastIndexOf(' ');
		   if (lastspace != -1) {
			   value = value.substr(0, lastspace);
		   }
	   }
	
	   return value + (tail || ' …');
	  };
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

