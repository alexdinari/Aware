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
          // controllerAs: 'climatectrl',
        });

        $urlRouterProvider.otherwise('/');
    }

})();