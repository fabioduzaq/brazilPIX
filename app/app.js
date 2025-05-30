'use strict';

var app = angular.module('pixBrasilApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/views/pix.html',
            controller: 'PixController'
        })
        .when('/cadastro', {
            templateUrl: 'app/views/cadastro.html',
            controller: 'CadastroController'
        })
        .when('/cartao', {
            templateUrl: 'app/views/cartao.html',
            controller: 'CartaoController'
        })
        .when('/confirmacao', {
            templateUrl: 'app/views/confirmacao.html',
            controller: 'ConfirmacaoController'
        })
        .when('/status', {
            templateUrl: 'app/views/status.html',
            controller: 'StatusController'
        })
        .when('/como-funciona', {
            templateUrl: 'app/views/como-funciona.html'
        })
        .otherwise({
            redirectTo: '/'
        });
}]); 


 