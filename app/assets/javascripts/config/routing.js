(function(){

  angular
    .module('ChangesApp')
    .config(config);

    function config($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'home.html',
          controller: 'ClimateController',
          controllerAs: 'climatectrl',
        });


      $stateProvider
        .state('welcome', {
            url:'/',
            templateUrl: 'welcome.html',
            controller: 'WelcomeController',
            controllerAs:'welcomectrl',
        });

        $urlRouterProvider.otherwise('/');
    }

})();