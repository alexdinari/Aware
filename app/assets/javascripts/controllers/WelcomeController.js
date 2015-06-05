(function(){

  angular
    .module('ChangesApp')
    .controller('WelcomeController', WelcomeController);

    WelcomeController.$inject = ['$http' , '$resource', '$state', '$stateParams'];

    function WelcomeController($http, $resource, $state, $stateParams){
      var welcome = this;


    }


})();