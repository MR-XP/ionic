var app = angular.module('App', []);
app.controller("indexCtrl", ["$scope","$ionicLoading","ajaxService","$ionicNavBarDelegate","$ionicActionSheet","$ionicScrollDelegate",
				   function ($scope,$ionicLoading,ajaxService,$ionicNavBarDelegate,$ionicActionSheet,$ionicScrollDelegate) {
	
	$scope.load=function(cb){
/*		ajaxService.ajax('venueDetails',null, function (json) {
	        
    	})*/
    	cb && cb()
	}
	
	//获取选择时间段的排课
	$scope.nowTime = '';
	$scope.getTime = function(time){
		console.log(time);
		$scope.nowTime = time;
		$ionicScrollDelegate.$getByHandle('contMode').scrollTop(true);
		//$scope.list = $scope.data[time];
	}
	//默认加载列表一
	$scope.active = 0;
	//列表切换
	var offsetLeft,_width;
	$scope.toggleActive = function(v,name) {
		$scope.active = v;
		offsetLeft 	=	$('div[name = '+name+']:eq('+v+')').offset().left;
		_width		=	$('div[name = '+name+']:eq('+v+')').width();
		if(v == 0)
			angular.element('.tab-nav-look').css({
				'left'			: 	'0.2rem',
				'width'			:	_width + 'px'
			});
		else
			angular.element('.tab-nav-look').css({
				'left'			: offsetLeft + 'px',
				'width'			:	_width + 'px'
			});
		$scope.getTime($scope.nowTime);
	};
	
	//显示进度条
	$scope.showRow = function(item,ix) {
		$timeout(function() {
			$('.bar-mv:eq('+ix+')').css('width', item.finishnum / item.allownum * 100 + '%')
		}, 600)
	}
	
	//跳转
	$scope.go=function(txt){
		$location.path(txt);
	}
	
	//页面刚加载			   
	$scope.$on('$ionicView.beforeEnter',function(){
		//$ionicLoading.show(HX_CONFIG.loadingBase);
		if($scope.app.footNav != 1)
			$scope.app.footNav = 1
	});
	
	//页面加载完成
	$scope.$on('$ionicView.afterEnter',function(){
		//$ionicLoading.hide();
	});
	
	//页面离开之前
	$scope.$on('$ionicView.beforeLeave',function(){
		
	});
	
}]);

//列表
app.controller("listCtrl", ["$scope","$ionicLoading","ajaxService","$ionicScrollDelegate","$stateParams",
				  function ($scope,$ionicLoading,ajaxService,$ionicScrollDelegate,$stateParams) {
	
	var page1 = function(){
    	return {
            currPage  : 1,
            totalPage : 2,
            list      : []
        }
    }
	
	var page2 = function(){
    	return {
            currPage  : 1,
            totalPage : 2,
            list      : []
        }
    }

	$scope.page1 = page1();
	$scope.page2 = page2();
	
	//默认加载第一个
	$scope.active=0;
	$scope.toggleActive=function(v){
		$scope.active=v;
		$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
	};
	
	//是否有传值
	if($stateParams.id)
        $scope.toggleActive($stateParams.id)
        
    //列表1
	$scope.loadpage1=function(cb){
		
		ajaxService.ajax('', {

		}, function (json) {
			
	        if (json.code==200) {
				
				if($scope.page1.currPage == 1){
	    			$scope.page1.list=json.data.list;
	    		}else{
	    			$scope.page1.list=$scope.page1.list.concat(json.list);
	    		}

    			$scope.page1.currPage  = json.page+1;
    			$scope.page1.totalPage = json.pages+1;
				
				if(cb)
    				cb()
    				
	        }
	        
    	})

	}    

	 //列表2
	$scope.loadpage2=function(cb){
		
		ajaxService.ajax('', {

		}, function (json) {
			
	        if (json.code==200) {
				
				if($scope.page2.currPage == 1){
	    			$scope.page2.list=json.data.list;
	    		}else{
	    			$scope.page2.list=$scope.page2.list.concat(json.list);
	    		}

    			$scope.page2.currPage  = json.page+1;
    			$scope.page2.totalPage = json.pages+1;
				
				if(cb)
    				cb()
    				
	        }
	        
    	})

	}    
	
	//下拉刷新
    $scope.doPTRefresh = function () {

        if($scope.active == 0){
        	$scope.page1.currPage = 1;
        	$scope.loadpage1(function(){
        	 	$scope.$broadcast('scroll.refreshComplete');
        	})
        }else{
        	$scope.page2.currPage = 1;
        	$scope.loadpage2(function(){
        	 	$scope.$broadcast('scroll.refreshComplete');
        	})
        }   

    };
    
    //无限加载回调
    $scope.onPTLoadMore = function () {
    	
    	if($scope.active == 0){
        	$scope.loadpage1(function(){
        		$scope.$broadcast('scroll.infiniteScrollComplete');
        	})
        }else{
        	$scope.loadpage2(function(){
        	 	$scope.$broadcast('scroll.infiniteScrollComplete');
        	})
        }
        
    };
	
	//页面刚加载			   
	$scope.$on('$ionicView.beforeEnter',function(){
		//$ionicLoading.show(HX_CONFIG.loadingBase);
	});
	
	//页面加载完成
	$scope.$on('$ionicView.afterEnter',function(){
		//$ionicLoading.hide();
	});
	
	//页面离开之前
	$scope.$on('$ionicView.beforeLeave',function(){
		
	});
	
}]);

//图片上传
app.controller("UpImgCtrl", ["$scope","$ionicLoading","ajaxService","$popup","$compile",
				   function ($scope,$ionicLoading,ajaxService,$popup,$compile) {

	//上传图片
	var gmMain = $("#up-img");
	var loadImg = $('#load-img');
	var id = 0;
	gmMain.DM({
		beforeFun: function() {
			$ionicLoading.show(HX_CONFIG.loadingBase);
		},
		completeFun: function(result) {
			$ionicLoading.hide();
			loadImg.append('<div class="show-img" ng-style="\''+result.base64+'\' | adaptBg" id="img_'+id+'"><i ng-click="remove('+id+')" class="iconfont gymUser-delete-copy"></i></div>');
			loadImg.replaceWith($compile(loadImg)($scope));		//用粗文本替换
			id++
			
/*			ajaxService.ajax('', {
				image	: result.base64
			}, function(json) {
				$ionicLoading.hide();
				if(json.code == 1) {
					loadImg.append('<div class="show-img" pic="'+json.data.src+'" ng-style="\''+json.data.url+'\' | adaptBg" id="img_'+id+'"><i ng-click="remove('+id+')" class="iconfont gymUser-delete-copy"></i></div>');
					loadImg.replaceWith($compile(loadImg)($scope));		//用粗文本替换
					id++;
				}
			})*/
		},
		errorFun: function(file) {
			$popup.alert('尊敬的用户', null, '暂时无法上传照片，请稍后再试！');
		}
	});
	
	$scope.remove=function(ev){
		$('#img_'+ev+'').remove();
	}
	
	//页面刚加载
	$scope.$on('$ionicView.beforeEnter',function(){
		//$ionicLoading.show(HX_CONFIG.loadingBase);
	});

	//页面加载完成
	$scope.$on('$ionicView.afterEnter',function(){
		//$ionicLoading.hide();

	});

	//页面离开之前
	$scope.$on('$ionicView.beforeLeave',function(){

	});

}]);

//日期
app.controller("SignRecordCtrl", ["$scope", "$ionicLoading", "ajaxService", "$compile", "$stateParams",
	function($scope, $ionicLoading, ajaxService, $compile, $stateParams) {

		var calUtil = {

			//时间过滤
			zeroFill: function(num) {
				now = parseInt(num, 10);
				if(now < 10) now = "0" + now;
				return now;
			},
			//当前日历显示的年份
			showYear: new Date().getFullYear(),
			//当前日历显示的月份
			showMonth: new Date().getMonth() + 1,
			//当前日历显示的天数
			showDays: 1,
			//默认加载方式
			eventName: "load",
			//获取数据
			getData: function(data) {
				var signList = new Array(); //新建一个数组
				for(var i = 0; i < data.length; i++) {
					var month = data[i].enter_tm.substring(5, 7);
					if(month == calUtil.zeroFill(calUtil.showMonth)) {
						var signDay = data[i].enter_tm.substring(8, 10);
						signList.push({
							signDay
						});
					}
				}
				calUtil.draw(signList);
			},
			//初始化日历
			init: function() {
				$scope.load()
			},
			draw: function(signList) {
				//绑定日历
				var str = calUtil.drawCal(calUtil.showYear, calUtil.showMonth, signList);

				$("#signLayer").html(str);
				$('#signLayer').replaceWith($compile($("#signLayer")[0].outerHTML)($scope));

				//绑定日历表头
				var calendarName = calUtil.showYear + "-" + calUtil.zeroFill(calUtil.showMonth);
				$(".month-span").html(calendarName);
			},
			bindPrev: function() {
				calUtil.eventName = "prev";
				calUtil.setMonthAndDay()
			},
			bindNext: function() {
				calUtil.eventName = "next";
				calUtil.setMonthAndDay()
			},
			//获取当前选择的年月
			setMonthAndDay: function() {

				switch(calUtil.eventName) {

					case "load":
						var current = new Date();
						calUtil.showYear = current.getFullYear();
						calUtil.showMonth = current.getMonth() + 1;
						break;

					case "prev":
						calUtil.showMonth = parseInt(calUtil.showMonth) - 1;
						if(calUtil.showMonth == 0) {
							calUtil.showMonth = 12;
							calUtil.showYear -= 1;
						}
						break;

					case "next":
						calUtil.showMonth = parseInt(calUtil.showMonth) + 1;
						if(calUtil.showMonth == 13) {
							calUtil.showMonth = 1;
							calUtil.showYear += 1;
						}
						break;

				}

				$scope.load()

			},
			getDaysInmonth: function(iMonth, iYear) {
				var dPrevDate = new Date(iYear, iMonth, 0);
				return dPrevDate.getDate();
			},
			bulidCal: function(iYear, iMonth) {
				var aMonth = new Array();
				aMonth[0] = new Array(7);
				aMonth[1] = new Array(7);
				aMonth[2] = new Array(7);
				aMonth[3] = new Array(7);
				aMonth[4] = new Array(7);
				aMonth[5] = new Array(7);
				aMonth[6] = new Array(7);
				var dCalDate = new Date(iYear, iMonth - 1, 1);
				var iDayOfFirst = dCalDate.getDay();
				var iDaysInMonth = calUtil.getDaysInmonth(iMonth, iYear);
				var iVarDate = 1;
				var d, w;
				aMonth[0][0] = "日";
				aMonth[0][1] = "一";
				aMonth[0][2] = "二";
				aMonth[0][3] = "三";
				aMonth[0][4] = "四";
				aMonth[0][5] = "五";
				aMonth[0][6] = "六";
				for(d = iDayOfFirst; d < 7; d++) {
					aMonth[1][d] = iVarDate;
					iVarDate++;
				}
				for(w = 2; w < 7; w++) {
					for(d = 0; d < 7; d++) {
						if(iVarDate <= iDaysInMonth) {
							aMonth[w][d] = iVarDate;
							iVarDate++;
						}
					}
				}
				return aMonth;
			},
			ifHasSigned: function(signList, day) {
				var signed = false;
				$.each(signList, function(index, item) {
					if(item.signDay == day) {
						signed = true;
						return false;
					}
				});
				return signed;
			},
			drawCal: function(iYear, iMonth, signList) {
				var myMonth = calUtil.bulidCal(iYear, iMonth);
				var htmls = new Array();
				htmls.push("<div class='sign'>");
				htmls.push("<div class='sign-tit'>");
				htmls.push("<div>" + myMonth[0][0] + "</div>");
				htmls.push("<div>" + myMonth[0][1] + "</div>");
				htmls.push("<div>" + myMonth[0][2] + "</div>");
				htmls.push("<div>" + myMonth[0][3] + "</div>");
				htmls.push("<div>" + myMonth[0][4] + "</div>");
				htmls.push("<div>" + myMonth[0][5] + "</div>");
				htmls.push("<div>" + myMonth[0][6] + "</div>");
				htmls.push("</div>");
				var d, w;
				for(w = 1; w < 7; w++) {
					htmls.push("<div class='sign-li'>");
					for(d = 0; d < 7; d++) {
						var ifHasSigned = calUtil.ifHasSigned(signList, myMonth[w][d]);
						if(ifHasSigned) {
							htmls.push("<div><span class='on' ng-class='{\"ck-sp\":active == "+myMonth[w][d]+"}' ng-click='toDay(" + myMonth[w][d] + ")'>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</span></div>");
						} else {
							htmls.push("<div>" + (!isNaN(myMonth[w][d]) ? myMonth[w][d] : " ") + "</div>");
						}
					}
					htmls.push("</div>");
				}
				htmls.push("</div>");
				return htmls.join('');
			}

		};

		//上个月
		$scope.prev = function() {
			calUtil.bindPrev()
		}

		//下个月
		$scope.next = function() {
			calUtil.bindNext()
		}

		//今日锻炼数据
		$scope.toDay = function(ix) {
			$scope.active = ix;
			for(var i = 0; i < $scope.list.length; i++) {
				if($scope.list[i].enter_tm.substr(8, 2) == calUtil.zeroFill(ix)) {
					//这里写要处理的数据
					break;
				}
			}
		}

		$scope.load = function() {
 			//$ionicLoading.show();
 			
 			$scope.active = 0;
 			calUtil.getData([]);
 			
/* 			ajaxService.ajax('', {
				start			: calUtil.showYear +''+ calUtil.zeroFill(calUtil.showMonth) +''+ '01',
				end				: calUtil.showYear +''+ calUtil.zeroFill(calUtil.showMonth) +''+ '31',
			}, function(json) {
				if(json.code == 1) {
					$ionicLoading.hide();
					$scope.list = json.data.data;
					$scope.total = json.data.total;
					calUtil.getData(json.data.data);
				}
			})*/
		}

		//初始化
		calUtil.init();

		//页面刚加载
		$scope.$on('$ionicView.beforeEnter', function() {
			//$ionicLoading.show(HX_CONFIG.loadingBase);
		});

		//页面加载完成
		$scope.$on('$ionicView.afterEnter', function() {
			//$ionicLoading.hide();
		});

		//页面离开之前
		$scope.$on('$ionicView.beforeLeave', function() {

		});

	}
]);