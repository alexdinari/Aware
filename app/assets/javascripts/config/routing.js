(function(){

  angular
    .module('ChangesApp')
    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
      $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'home.html',
        controller: 'ClimateController',
      });

      $urlRouterProvider.otherwise('/home');
    }

    ]);

})();