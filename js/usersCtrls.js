var app = angular.module('App', []);
app.controller("indexCtrl", ["$scope","$ionicLoading","ajaxService","$ionicNavBarDelegate","$ionicActionSheet",
				   function ($scope,$ionicLoading,ajaxService,$ionicNavBarDelegate,$ionicActionSheet) {
	
	$scope.load=function(){
		ajaxService.ajax('',null, function (json) {			
	        if (json.code==1) {
				
	        }	        
    	})
	}
		
	//页面刚加载			   
	$scope.$on('$ionicView.beforeEnter',function(){
		$ionicLoading.show(HX_CONFIG.loadingBase);
		$scope.load()
	});
	
	//页面加载完成
	$scope.$on('$ionicView.afterEnter',function(){
		$ionicLoading.hide();
	});
	
	//页面离开之前
	$scope.$on('$ionicView.beforeLeave',function(){
		
	});
	
}]);

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
	
	//默认加载进行中的课程
	$scope.active=0;
	
	$scope.toggleActive=function(v){
		
		$scope.active=v;
		$ionicScrollDelegate.$getByHandle('mainScroll').scrollTop(false);
		
/*		if(v==0)
			angular.element('.tab-nav-look').css({'left':'0','margin-left':'0'});
		else
			angular.element('.tab-nav-look').css({'left':'15%','margin-left':angular.element('.look').width()+2+'px'});*/
			
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