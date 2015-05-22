(function(){

  angular
    .module('ChangesApp')
    .config(config)
    .run(run);

    function config($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('welcome', {
          url: '/',
          title: 'Welcome to Changes',
          templateUrl: 'welcome.html',
          controller: 'WelcomeController',
          controllerAs: 'welcome'
        })

        .state('home', {
          url: '/home',
          templateUrl: 'home.html',
          controller: 'ClimateController',
          controllerAs: 'climatectrl',
        })
    }

})();