var app = angular.module('App.directives', []);

//图片缩放
app.directive('imgzoom', ['$timeout','$ionicLoading',function($timeout,$ionicLoading) {
	return {
		restrict: 'A',
		template: '',
		replace: true,
		link: function($scope, element, attr, controller) {
			
			//标签例子
			//<img imgzoom ng-repeat="i in data.images" ng-src="{{i}}" clsname="imgs" zoomurl="{{i}}" />
			
			var srcList = [],
				imgs	= [];

			element.click(function () {
				
				$ionicLoading.show();
				srcList= [];
				
				imgs=$('[clsname='+attr.clsname+']').length;
				
				for (var i = 0; i < imgs; i++)
					srcList.push(window.base_url+'/'+$('[clsname='+attr.clsname+']:eq('+i+')').attr('zoomurl'));

				$timeout(function(){
					
					$ionicLoading.hide();
					imagePreview(window.base_url+'/'+attr.zoomurl, srcList);
					
				},500)

			});
			
			function imagePreview(curSrc, srcList) {
			  if (!curSrc || !srcList || srcList.length == 0) {
			    return;
			  }
			  WeixinJSBridge.invoke('imagePreview', {
			    'current': curSrc,
			    'urls': srcList
			  });
			}
			
		}
	};
}]);

app.directive('dateMenu', ["$compile","$filter", "formatDate", function($compile,$filter, formatDate) {
	return {
		restrict: 'E',
		template: '<ion-scroll class="date-menu" has-bouncing="true" scrollbar-x="false" direction="x"></ion-scroll>',
		replace: true,
		link: function(scope, element, attr) {

			var temp = 1000 * 60 * 60 * 24;
			
			var dayMap = {
				0: "周日",
				1: "周一",
				2: "周二",
				3: "周三", 
				4: "周四",
				5: "周五",
				6: "周六"
			};
			var html = "";
			var cd = new Date();			//获取当前日期
			var cdt = cd.getTime();			//获取时间戳
			
			for(var i = 0; i < 10; i++) {
				c = cdt + temp * i;						//获取近七天时间戳
				nd = new Date(c);						//转换为日期
				day = nd.getDay();						//获取星期几
				f = formatDate.get(nd);
				format = f.y + "-" + f.m + "-" + f.d;
																																					
				html+='<a href="javascript:;" class="date-menu-li" name="'+attr.divname+'" nowDay="'+$filter('zeroFill')(f.d)+'" ng-click="'+attr.click+'(\''+attr.divname+'\',\''+attr.stripname+'\',\''+ f.y + "-" + $filter('zeroFill')(f.m) + "-" + $filter('zeroFill')(f.d)+'\','+i+','+attr.cbfn+','+attr.handle+')">'+
						'<div class="date-menu-li-txt">'+dayMap[day]+'</div>'+
						'<div class="date-menu-li-num">'+$filter('zeroFill')(f.d)+'</div>'+
				'</a>';
				
			}
			
			var btn='<div class="date-menu-active anime-ease-4" name="'+attr.stripname+'"></div>';
			element.append(html+btn);										//赋予值
			element.replaceWith($compile(element[0].outerHTML)(scope));		//用粗文本替换
			
			//默认加载第一个
			var t = formatDate.get(cd);
			scope.load(function(){
				scope.$eval(attr.click+'(\''+attr.divname+'\',\''+attr.stripname+'\',\''+ t.y + "-" + $filter('zeroFill')(t.m) + "-" + $filter('zeroFill')(t.d)+'\','+0+','+attr.cbfn+','+attr.handle+')');				
			})
						
		}
	}
}]);

//导航切换
app.directive('footNav', ["$compile", function($compile) {
	return {
		restrict: 'E',
		template: '<div class="foot-nav"></div>',
		replace: true,
		link: function(scope, element, attr) {
			
			var html='<a href="javascript:;" class="foot-nav-li" ng-class="{\'foot-nav-active\' : app.footNav == 1}" ng-click="'+attr.click+'(1)">'+
						'<i class="iconfont foot-nav-icon gymUser-index-jianshenfang"></i>'+
						'<div class="foot-nav-name">健身房</div>'+
					'</a>'+
					'<a href="javascript:;" class="foot-nav-li" ng-class="{\'foot-nav-active\' : app.footNav == 2}" ng-click="'+attr.click+'(2)">'+
						'<i class="iconfont foot-nav-icon gymUser-index-tuanke"></i>'+
						'<div class="foot-nav-name">运动</div>'+
					'</a>'+									   
					'<a href="javascript:;" class="foot-nav-li" ng-class="{\'foot-nav-active\' : app.footNav == 3}" ng-click="'+attr.click+'(3)">'+
						'<i class="iconfont foot-nav-icon gymUser-ren"></i>'+
						'<div class="foot-nav-name">个人</div>'+
					'</a>'
			
			element.append(html);											//赋予值
			element.replaceWith($compile(element[0].outerHTML)(scope));		//用粗文本替换
			
		}
	}
}]);