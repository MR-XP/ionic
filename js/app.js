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
		
		$urlRouterProvider.when('', '/guide/guide-one');
		$urlRouterProvider.when('/users', '/users/index');
		$urlRouterProvider.when('/guide', '/guide/guide-one');
		
		//判断是否跳转支付,没有默认users模块
/*		var nowUrl=location.href.substr(location.href.lastIndexOf('/')+1,8);
		if(nowUrl!='pay.html')
			$urlRouterProvider.otherwise('/users')*/

		//控制器加载
        $stateProvider
		
		//注册模块
		.state('reg', {
            url: '/reg',
            templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/reg.html"+HX_CONFIG.APP_VERSION,
            controller: 'regCtrl',
            cache: false
        })
		
		//引导模块
		.state('guide', {
			url: '/guide',
			template: '<ion-nav-view class="slide-left-right"></ion-nav-view>',
			cache: false
		})
			//引导页1
			.state('guide.guide-one', {
	            url: '/guide-one',
	            templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/guide-one.html"+HX_CONFIG.APP_VERSION,
	            controller: 'guideCtrl',
	            cache: false
	       	})
			//引导页2
			.state('guide.guide-two', {
	            url: '/guide-two',
	            templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/guide-two.html"+HX_CONFIG.APP_VERSION,
	            controller: 'guideCtrl',
	            cache: false
	       	})
			//引导页3
			.state('guide.guide-three', {
	            url: '/guide-three',
	            templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/guide-three.html"+HX_CONFIG.APP_VERSION,
	            controller: 'guideCtrl',
	            cache: false
	        })
			//引导页4
			.state('guide.guide-four', {
	            url: '/guide-four',
	            templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/guide-four.html"+HX_CONFIG.APP_VERSION,
	            controller: 'guideCtrl',
	            cache: false
	        })

        //users模块
		.state('users', {
			url: '/users',
			template: '<ion-nav-view class="slide-left-right"></ion-nav-view>',
			resolve: {
				ollc: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load(HX_CONFIG.STATIC_HOST + 'js/usersCtrls.js'+HX_CONFIG.APP_VERSION).then(function () {
						console.log("js load ok");
					});
				}]
			},
			cache: false
		})
			//子模块
			.state('users.index', {
				url: '/index',
				templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/users/index.html"+HX_CONFIG.APP_VERSION,
				cache: false
			})
			//日期
			.state('users.date', {
				url: '/date',
				templateUrl: HX_CONFIG.TEMPLATE_HOST + "/tpl/users/date.html"+HX_CONFIG.APP_VERSION,
				cache: false
			})
			//上传图片
			.state('users.up-img', {
				url: '/up-img',
				templateUrl: HX_CONFIG.TEMPLATE_HOST + "/tpl/users/up-img.html"+HX_CONFIG.APP_VERSION,
				resolve: {
					ollc: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load(HX_CONFIG.PUBLIC_HOST + '/js/plugins/jquery.GM.js'+HX_CONFIG.APP_VERSION);
					}]
				},
				cache: false
			})
			//列表
			.state('users.list', {
				url: '/list',
				templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/users/list.html",
				resolve:{
					ollc:['$ocLazyLoad',function($ocLazyLoad){
						return 	$ocLazyLoad.load(HX_CONFIG.STATIC_HOST + 'js/plugins/jquery.GM.js'+HX_CONFIG.APP_VERSION),
								$ocLazyLoad.load(HX_CONFIG.STATIC_HOST + 'css/app.css'+HX_CONFIG.APP_VERSION);
					}]
				},
				cache: false
			})
			//404
			.state('users.404', {
				url: '/404',
				templateUrl: HX_CONFIG.TEMPLATE_HOST + "tpl/users/404.html",
				cache: false
			})
		
    }]);
