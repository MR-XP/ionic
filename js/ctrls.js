var app = angular.module('App.ctrls', []);
app.controller("indexCtrl", ["$scope","$timeout","$interval","$state","$stateParams","$rootScope","$location","$filter","$compile","$ionicLoading","$ionicPopup","$ionicModal","ajaxService",
				   function ($scope,
							$timeout,
							$interval, 
							$state,
							$stateParams,
							$rootScope,
							$location,
							$filter,
							$compile,
							
							$ionicLoading,						
							$ionicPopup,
							$ionicModal,
							
							ajaxService) {

	$scope.title="首页";
	
	
	//页面刚加载			   
	$scope.$on('$ionicView.beforeEnter',function(){
		
	});
	
	//页面加载完成
	$scope.$on('$ionicView.afterEnter',function(){
		
	});
	
	//页面离开之前
	$scope.$on('$ionicView.beforeLeave',function(){
		
	});
	
}]);

app.controller("listCtrl", ["$scope","$ionicLoading","ajaxService","$ionicScrollDelegate",
				   function ($scope,$ionicLoading,ajaxService,$ionicScrollDelegate) {

	
	var page = function(){
    	return {
            currPage  : 1,
            totalPage : 2,
            list      : []
        }
    }
	$scope.page = page();
	
	$scope.load=function(cb){
		
		if(cb)
			cb()
	}
	
	//下拉刷新
    $scope.doPTRefresh = function () {
        $scope.page.currPage = 1;
        $scope.load(function(){
        	 $scope.$broadcast('scroll.refreshComplete');
        });

    };
    
    //无限加载回调
    $scope.onPTLoadMore = function () {
        $scope.load(function(){
        	$scope.$broadcast('scroll.infiniteScrollComplete');
        });
    };

	
	//页面刚加载			   
	$scope.$on('$ionicView.beforeEnter',function(){
		
	});
	
	//页面加载完成
	$scope.$on('$ionicView.afterEnter',function(){
		$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
	});
	
	//页面离开之前
	$scope.$on('$ionicView.beforeLeave',function(){
		
	});
	
}]);