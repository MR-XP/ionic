var app = angular.module('App.services', []);

app.service('infoService' , [function(){

	var service = {};
	var info = {}

	service.setForm = function(key , val){
		info[key] = val;
	}
	service.getForm = function(key){
		return info[key];
	}
	return service;
}]);

app.service('$session', function () {
    return {
        get: function (key) {
            return sessionStorage[key];
        },
        set: function (key, value) {
            sessionStorage[key] = value;
        },
        remove: function (key) {
            sessionStorage.removeItem(key);
        },
        clear: function () {
            sessionStorage.clear();
        },
        setObj: function (key, obj) {
            var str = JSON.stringify(obj);
            sessionStorage[key] = str;
        },
        getObj: function (key) {
            var str = sessionStorage[key];
            if (str) {
                return JSON.parse(str);
            }
            return false;
        }
    };
});

app.service('$local', function () {
    return {
        get: function (key) {
            return localStorage[key];
        },
        set: function (key, value) {
            localStorage[key] = value;
        },
        remove: function (key) {
            localStorage.removeItem(key);
        },
        clear: function () {
            localStorage.clear();
        },
        setObj: function (key, obj) {
            var str = JSON.stringify(obj);
            localStorage[key] = str;
        },
        getObj: function (key) {
            var str = localStorage[key];
            if (str) {
                return JSON.parse(str);
            }
            return false;
        }
    };
});

app.service('$popup' , ["$ionicPopup" , function($ionicPopup){
	return {
		alert : function(title , subTitle , template){
			$ionicPopup.alert({
           	  title    : title, // String. 弹窗的标题。
           	  subTitle : subTitle,
           	  template : template,
           	  okText   : '确定', // String (默认: 'OK')。OK按钮的文字。
           	  okType   : 'button-block', // String (默认: 'button-positive')。OK按钮的类型。
           });
		}
	}
}])


//AJAX server
app.service('ajaxService', ["$ionicLoading", "$http","$location", function ($ionicLoading, $http,$location) {

    var service = {};
	
	var methodMap = {
    	
		Upload             : {url : '/App/Upload/Oss' , method : 'post'},						 //test

	};
	
    var sendAJAX = function (url, method, body, cb) {
        method = method.toLocaleUpperCase();
        if (HX_CONFIG.debug) {
            console.log("--------------------------------准备发送AJAX----------------------------------");
            console.log("HOST：", HX_CONFIG.HOST);
            console.log("URL：", url);
            console.log("method：", method);
            console.log("body：", body);
        }

        for (var k in body) {
            if (body.hasOwnProperty(k)) {
                if (k.indexOf("$") != -1) {
                    url.replace("{" + k + "}", body[k]);
                    delete  body[k];
                }
            }
        }

        switch (method) {
            case "GET":
                var config = {params: body , headers : {X_REQUESTED_WITH : 'xmlhttprequest'}};
                $http.get(HX_CONFIG.HOST + url, config).success(function (data) {
                	if(data.errCode == 10000){
                		$.toast(data.message , 'text');
                		$location.path('employee_login');
                		return;
                	}
                	if(data.errCode == 21001){
                		$.toast(data.message , 'text');
                		window._member = {};
                		$location.path('login');
                		return;
                	}
                    HX_CONFIG.debug && console.log("url=" + url, "成功", "返回结果：", data, "\n");
                    cb && cb(data);
                }).error(function (err) {
                    HX_CONFIG.debug && console.log("url=" + url, "错误", "返回结果：err = ", err, "\n");
                    cb && cb({errCode: -9999, message: "访问服务器失败！"});
                });
                break;
            case "POST":
                $http.post(HX_CONFIG.HOST + url, body , {headers : {X_REQUESTED_WITH : 'xmlhttprequest'}}).success(function (data) {
                    HX_CONFIG.debug && console.log("url = " + url, "成功", "返回结果：", data, "\n");
                    if(data.errCode == 10000){
                    	$.toast(data.message , 'text');
                		$location.path('employee_login');
                		return;
                	}
                    if(data.errCode == 21001){
                    	$.toast(data.message , 'text');
                		$location.path('login');
                		return;
                	}
                    cb && cb(data);
                }).error(function (err) {
                    HX_CONFIG.debug && console.log("url = " + url, "错误", "返回结果：err = ", err, "\n");
                    cb && cb({errCode: -9999, message: "访问服务器失败！"});
                });
                break;
        }

    };
    
    service.ajax = function (method, opts, cb) {
        var mm = methodMap[method];
        if (mm) {
            sendAJAX(mm.url, mm.method, opts, cb);
        } else {
            //未找到方法
            HX_CONFIG.debug && console.log("url=" + url, "错误", "返回结果：err = ", "无法请求，无效的请求！", "\n");
            cb && cb({errCode: -1, message: "无效的请求"})
        }
    };

    return service;
}]);


