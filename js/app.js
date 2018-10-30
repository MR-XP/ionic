angular.module('App', ["ionic", "ngAnimate", "App.ctrls", "oc.lazyLoad", "App.filters", "App.directives","App.services"])
    .run(["$ionicPlatform", "$ionicLoading", "$rootScope", "$state", "$location",
        function ($ionicPlatform, $ionicLoading, $rootScope, $state, $location) {
        	
            //$ionicLoading.show(HX_CONFIG.loadingBase);
/*			
			//验证登录
            var missLoginView = ["login", "reg"];		//不需要登录的页面
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            	if (missLoginView.indexOf(toState.name) == -1 && !window.member.id){
                    $state.go('/login');		//跳转到登录页
                    event.preventDefault(); 	//阻止默认事件，即原本页面的加载
               }
            });
*/

    }])
		
    .config(["$stateProvider", "$urlRouterProvider", "$ionicConfigProvider", function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.platform.android.templates.maxPrefetch(5);
        $ionicConfigProvider.platform.ios.templates.maxPrefetch(5);

        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('bottom');
		
		$urlRouterProvider.when('/users', '/users/index');			     
		
		//判断是否跳转支付,没有默认users模块
		var nowUrl=location.href.substr(location.href.lastIndexOf('/')+1,8);
		if(nowUrl!='pay.html')
			$urlRouterProvider.otherwise('/users')
		

		//控制器加载
        $stateProvider
		
		//单个加载
		.state('reg', {
            url: '/reg',
            templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/reg.html"+HX_CONFIG.PAGEVERSION,
            controller: 'regCtrl',
            cache: false
        })


        //模块化加载
		.state('users', {
			url: '/users',
			template: '<ion-nav-view class="slide-left-right"></ion-nav-view>',
			resolve: {
				ollc: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load(HX_CONFIG.STATIC_HOST + 'js/usersCtrls.js'+HX_CONFIG.PAGEVERSION).then(function () {
						console.log("js load ok");
					});
				}]
			},
			cache: false
		})
			//模块子类
			.state('users.index', {
				url: '/index',
				templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/users/index.html"+HX_CONFIG.PAGEVERSION,
				cache: false
			})

			.state('users.list', {
				url: '/list',
				templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/users/list.html",
				resolve:{
					ollc:['$ocLazyLoad',function($ocLazyLoad){
						return 	$ocLazyLoad.load(HX_CONFIG.STATIC_HOST + 'js/plugins/jquery.GM.js'+HX_CONFIG.PAGEVERSION),
								$ocLazyLoad.load(HX_CONFIG.STATIC_HOST + 'css/app.css'+HX_CONFIG.PAGEVERSION);
					}]
				},
				cache: false
			})
		
    }]);
