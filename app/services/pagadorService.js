'use strict';

angular.module('pixBrasilApp')
    .service('PagadorService', ['$http', function($http) {
        var service = {};
        
        // Armazena os dados do pagador durante o fluxo
        service.dadosPagador = {
            nome: '',
            email: '',
            telefone: '',
            paisOrigem: ''
        };
 
 
        // Salva os dados do pagador no backend
        service.salvarDadosPagador = function() {
            return $http.post('/api/pagador', service.dadosPagador); 
            
        };

        // Valida os dados do pagador
        service.validarDados = function() {
            return (
                service.dadosPagador.nome &&
                service.dadosPagador.email &&
                service.dadosPagador.telefone &&
                service.dadosPagador.paisOrigem
            );
        };

        return service;
    }]); 