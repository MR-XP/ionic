window.HX_CONFIG = {
    loadingBase: {template: '<ion-spinner icon="android" class="spinner spinner-android" style="stroke: #fff"><svg viewBox="0 0 64 64"><g transform="rotate(315.7000000000001,32,32)"><circle stroke-width="6" stroke-dasharray="130.10559854346837" stroke-dashoffset="0.33136094674554784" r="26" cx="32" cy="32" fill="none" transform="scale(1,1) translate(0,0) rotate(-270,32,32)"></circle></g></svg></ion-spinner>'},
    HOST: '',
    TEMPLATE_HOST: "",
    STATIC_HOST: '',
};

// Ionic Starter App
angular.module('App', ["ionic", "ngAnimate", "App.ctrls", "oc.lazyLoad", "App.filters", "App.directives","App.services"])

    .run(["$ionicPlatform", "$ionicLoading", "$rootScope", "$state", "$location","$ionicPopup",
        function ($ionicPlatform, $ionicLoading, $rootScope, $state, $location,$ionicPopup) {

            $ionicLoading.show(HX_CONFIG.loadingBase);

/*			
			//验证登录
            var missLoginView = ["login", "find-pwd"];		//不需要登录的页面
           
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
               
            	if (missLoginView.indexOf(toState.name) == -1 && !window.member.id){
 
                    $ionicPopup.alert({
                    	title		:	'请登录',
                    });
                    
                    $state.go('/login');									//跳转到登录页
					
                    event.preventDefault(); 								//阻止默认事件，即原本页面的加载
					
                }
				
            });
*/

            $rootScope.back = function () {
                history.back();
            };
            
            $rootScope.location = function (path, type) {
                $ionicLoading.show(HX_CONFIG.loadingBase);
                if (type) {
                    path = $state.href(path).replace("#", "");
                }
                $location.path(path);
            };
            
            $rootScope.stopBubbling = function (e) {
                e.stopPropagation();
            };
            
            
        }])
		
    .config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.platform.android.templates.maxPrefetch(5);
        $ionicConfigProvider.platform.ios.templates.maxPrefetch(5);

        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('bottom');
		
		$urlRouterProvider.when('/users', '/users/index');			     
		
		$urlRouterProvider.otherwise('/users/index');
		

		//控制器加载
        $stateProvider
		
		//单个加载
		.state('login', {
            url: '/login',
            templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/login.html",
            controller: 'loginCtrl',
            cache: false
        })


        //模块化加载
		.state('users', {
			url: '/users',
			template: '<ion-nav-view class="slide-left-right"></ion-nav-view>',
			resolve: {
				ollc: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load(HX_CONFIG.STATIC_HOST + 'js/usersCtrls.js').then(function () {
						console.log("js load ok");
					});
				}]
			},
			cache: false
		})
			//模块子类
			.state('users.index', {
				url: '/index',
				templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/users/index.html",
				cache: false
			})
		
		
			.state('users.list', {
				url: '/list',
				templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/users/list.html",
				resolve:{
					ollc:['$ocLazyLoad',function($ocLazyLoad){
						return 	$ocLazyLoad.load(HX_CONFIG.STATIC_HOST + 'js/plugins/jquery.GM.js'),
								$ocLazyLoad.load(HX_CONFIG.STATIC_HOST + 'css/app.css');
					}]
				},
				cache: false
			})
		
    }]);
