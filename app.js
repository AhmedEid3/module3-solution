(function(){
  "use strict";
  angular
  .module("NarrowItDownApp", [])
  .controller("NarrowItDownController", NarrowItDownController)
  .service("MenuSearchService", MenuSearchService)
  .directive("foundItems", foundItemsDirective);

  function foundItemsDirective () {
    var ddo = {
      restrict: 'E',
      templateUrl: 'loader/itemsloaderindicator.template.html',
      scope: {
        foundItems: '<',
        onRemove: '&'
      },
      controller:foundItemsDirectiveController,
      controllerAs:'founDdo',
      bindToController:true,
      transclude: true
    }
    return ddo;
  }

  function foundItemsDirectiveController() {
  var founDdo = this;
}

  NarrowItDownController.$inject = ['MenuSearchService']
  function NarrowItDownController(MenuSearchService) {
    var narrow = this;

    narrow.title = "Narrow Down Your Chinese Menu Choice";
    narrow.search = "";
    narrow.showitems = false;

    narrow.searchItems = function () {
      if(narrow.search != ""){
      var promise = MenuSearchService.getMatchedMenuItems(narrow.search);
      promise.then(function (result) {
        narrow.foundItems = result;
        narrow.showitems = false;
        narrow.search = "";
        if(result == ""){
          narrow.showitems = true;
        }
      });
    }
    else {
      narrow.showitems = true;
    }
    }

    narrow.removeItem = function (index) {
      MenuSearchService.removeItem(index);
    }

  };

  MenuSearchService.$inject = ['$http']
  function MenuSearchService($http) {
    var service = this;
    var foundItem = [];
    service.getMatchedMenuItems = function(searchTerm) {

      var menuItems = $http({
        method: "GET",
        url: "https://davids-restaurant.herokuapp.com/menu_items.json"
      })
      .then(function (result) {
        foundItem = [];
        var menu_items = result.data.menu_items;

        for(var i = 0; i < menu_items.length; i++) {

          var item = menu_items[i].description.split(" ");

          for (var j = 0; j < item.length; j++) {
            if(searchTerm.toLowerCase() == item[j]){
              foundItem.push(menu_items[i]);
              break;
            }
          }
        }
        return foundItem;
      }).catch(function (result) {
        console.log("Error Connection Losts");
      });

      return menuItems;
    }

    service.removeItem = function (index) {
      foundItem.splice(index, 1);
    }

  }

})();
