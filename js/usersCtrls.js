var app = angular.module('App', []);
app.controller("userIndexCtrl", ["$scope","$ionicLoading","ajaxService","$ionicNavBarDelegate","$ionicActionSheet",
				   function ($scope,$ionicLoading,ajaxService,$ionicNavBarDelegate,$ionicActionSheet) {
	

	//页面刚加载			   
	$scope.$on('$ionicView.beforeEnter',function(){
		$ionicLoading.show(HX_CONFIG.loadingBase);
	});
	
	//页面加载完成
	$scope.$on('$ionicView.afterEnter',function(){
		$ionicLoading.hide();
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
		
		$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
		
		ajaxService.ajax('', {
			
		}, function (json) {
			
	        if (!json.errCode) {
				
				if($scope.page.currPage == 1){
	    			$scope.order.list=json.data.list;
	    		}else{
	    			$scope.order.list=$scope.order.list.concat(json.data.list);
	    		}
	    		
	            $scope.page.currPage  = json.data.page.page+1;
    			$scope.page.totalPage = json.data.page.countPage;
				
				if(cb)
    				cb()
	        }else {
	            
	        }
    	});
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
		$ionicLoading.show(HX_CONFIG.loadingBase);
	});
	
	//页面加载完成
	$scope.$on('$ionicView.afterEnter',function(){
		$ionicLoading.hide();
	});
	
	//页面离开之前
	$scope.$on('$ionicView.beforeLeave',function(){
		
	});
	
}]);