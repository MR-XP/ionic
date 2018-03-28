window.HX_CONFIG = {
    loadingBase: {template: '<ion-spinner icon="android" class="spinner spinner-android" style="stroke: #fff"><svg viewBox="0 0 64 64"><g transform="rotate(315.7000000000001,32,32)"><circle stroke-width="6" stroke-dasharray="130.10559854346837" stroke-dashoffset="0.33136094674554784" r="26" cx="32" cy="32" fill="none" transform="scale(1,1) translate(0,0) rotate(-270,32,32)"></circle></g></svg></ion-spinner>'},
    HOST			: 		"",
    TEMPLATE_HOST	: 		"",
    STATIC_HOST		: 		"",
    VERSION	   		: 		"",
    PAGEVERSION		:		"?v=1.0"
};

// Ionic Starter App
angular.module('App', ["ionic", "ngAnimate", "App.ctrls", "oc.lazyLoad", "App.filters", "App.directives","App.services"])

    .run(["$ionicPlatform", "$ionicLoading", "$rootScope", "$state", "$location",
        function ($ionicPlatform, $ionicLoading, $rootScope, $state, $location) {

            $ionicLoading.show(HX_CONFIG.loadingBase);

/*			
			//验证登录
            var missLoginView = ["login", "reg"];		//不需要登录的页面
           
            $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
               
            	if (missLoginView.indexOf(toState.name) == -1 && !window.member.id){
                    
                    $state.go('/login');									//跳转到登录页
					
                    event.preventDefault(); 								//阻止默认事件，即原本页面的加载
					
                }
				
            });
*/

			//you know
            $rootScope.back = function () {
                history.back();
            };
            
            //静态跳转
            $rootScope.location = function (path, type) {

                if (type) 
                    path = $state.href(path).replace("#", "")
                
                $location.path(path);
            };
            
            //阻止冒泡
            $rootScope.stopBubbling = function (e) {
                e.stopPropagation();
            };
            
            //title
            $rootScope.setDocumentTitle = function(title) {
		    	document.title = title;
			   	i = document.createElement('iframe');
		        i.src = '/favicon.ico';
		        i.style.display = 'none';
		        i.onload = function() {
		            setTimeout(function(){
		                i.remove();
		            }, 9)
		        }
		        document.body.appendChild(i);
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
