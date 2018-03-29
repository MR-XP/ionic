function storage(type) {
	var key = '';
	var storageType = 1;
	var array = false;
	//初始化
	this.init = function (type) {
		if (type === 1) {
			this.storageType = 1;
		} else {
			this.storageType = 2;
		}
		if (window.localStorage) {
			return true;
		} else {
			alert("浏览暂不支持本地储存,请联系管理员");
			return false;
		} //if(typeof window.localStorage == 'undefined'){ 	alert("浏览暂不支持localStorage") }
	};
	//拉取
	this.get = function () {
		if (this.storageType === 1) {
			var str = localStorage[this.key];
		} else {
			var str = sessionStorage[this.key];
		}
		if (this.isArray === true) {
			str = eval(str);
			if (!str) {
				str = [];
			}
		}
		return str;
	};
	//赋值
	this.set = function (val) {
		if (this.isArray === true) {
			val = JSON.stringify(val)
		}
		if (this.storageType === 1) {
			localStorage[this.key] = val;//JSON.stringify(val);
		} else {
			sessionStorage[this.key] = val;//JSON.stringify(val);
		}
	};
	//移除
	this.remove = function () {
		if (this.storageType === 1) {
			localStorage.removeItem(this.key);
		} else {
			sessionStorage.removeItem(this.key);
		}
	};
	//清空
	this.clear = function () {
		if (this.storageType === 1) {
			localStorage.clear();
		} else {
			sessionStorage.clear();
		}
	};
}