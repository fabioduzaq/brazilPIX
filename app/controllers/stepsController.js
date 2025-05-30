angular.module('pixBrasilApp')
    .controller('StepsController', ['$scope', '$location', function($scope, $location) {
        $scope.isActive = function(path) {
            return $location.path() === path;
        };
    }]); 