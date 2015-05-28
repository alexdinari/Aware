(function(){

  angular
    .module('ChangesApp')
    .controller('ClimateController', ClimateController);

    ClimateController.$inject = ['$http' , '$resource', '$state', '$stateParams'];

    function ClimateController($http, $resource, $state, $stateParams){
      var self = this;

      
    }




})();