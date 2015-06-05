(function(){

  angular
    .module('ChangesApp')
    .controller('WelcomeController', WelcomeController);

    WelcomeController.$inject = ['$http' , '$resource', '$state', '$stateParams'];

    function WelcomeController($http, $resource, $state, $stateParams){
      var welcome = this;

      d3.selectAll('.welcome').transition().duration(8000).style('opacity',"100");

      var icons = ["factory.png", "icon-bear.png","thermometer.jpg","watertemp.png"];



    }


})();