var app = angular.module('App.directives', []);

//图片缩放
app.directive('imgzoom', ['$timeout','$ionicLoading',function($timeout,$ionicLoading) {
	return {
		restrict: 'A',
		template: '',
		replace: true,
		link: function($scope, element, attr, controller) {
			
			//标签例子
			//<img imgzoom ng-repeat="i in data.images" ng-src="uploads/{{i}}" clsname="imgs" zoomurl="uploads/{{i}}" />
			
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

//柱状图
app.directive('echartbar', [function() {
	return {
		restrict: 'A',
		template: '',
		replace: true,
		link: function($scope, element, attrs, controller) {

			$scope.$watch('historyData.id', function() {
				
				//动态获取日期
				item 	= 	$scope.historyData.item;
				//动态获取数值
				data 	= 	$scope.historyData.data;
				//动态提示语
				legend	= 	$scope.historyData.legend;	
				//渲染的类
				id		= 	$scope.historyData.id;
				//颜色
				color	= 	$scope.historyData.color;
				
				line(item,data,legend,id,color)

			});

			function line(item,data,legend,id,color) {

				var option = {
					
					// 提示框，鼠标悬浮交互时的信息提示
					tooltip: {
						trigger: 'axis',
						axisPointer : {           
				            type : 'shadow'        
				        }
					},
					// 图例
					legend: {
				        data: legend
				   },
					// 横轴坐标轴
					xAxis: [{
						type: 'category',
						data: item,
						axisLabel: {
						    interval:0
						}
					}],
					// 纵轴坐标轴
/*					yAxis: [{
						type: 'value',
						axisLabel: {
						    interval:0,
						    rotate:60
						}
					}],*/
					yAxis	:	{
						show	: false
					},

					//内容
					series: function() {
						
						var serie = [];
			 			for(var i=0;i<legend.length;i++){
							 var item = {
								 name 		: 	legend[i],
								 type		: 	'bar',
								 data		: 	data[i],
								 barGap		:	0,
								 
								 itemStyle: {
								 	
									normal: {
										
										color: color[i]
										
									}
								 }
							 }							
							 
							 serie.push(item);
						} 

						
						return serie;
					}()
				};
				var myChart = echarts.init(document.getElementById(id), 'macarons');
				myChart.setOption(option);
			}
		}
	};
}]);