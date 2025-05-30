'use strict';

angular.module('pixBrasilApp')
    .service('CartaoService', ['$http', function($http) {
        var service = {};
        
        // Armazena os dados do cartão
        service.dadosCartao = {
            numero: '',
            nome: '',
            validade: '',
            cvv: '',
            parcelas: 1
        };

        // Valida número do cartão usando algoritmo de Luhn
        service.validarNumeroCartao = function(numero) {
            if (!numero) return false;
            numero = numero.replace(/\D/g, '');
            
            if (numero.length < 13 || numero.length > 19) return false;
            
            var soma = 0;
            var dobro = false;
            
            for (var i = numero.length - 1; i >= 0; i--) {
                var digito = parseInt(numero.charAt(i), 10);
                
                if (dobro) {
                    digito *= 2;
                    if (digito > 9) digito -= 9;
                }
                
                soma += digito;
                dobro = !dobro;
            }
            
            return (soma % 10) === 0;
        };

        // Valida data de validade
        service.validarValidade = function(validade) {
            if (!validade) return false;
            
            var hoje = new Date();
            var mes = parseInt(validade.split('/')[0], 10);
            var ano = parseInt('20' + validade.split('/')[1], 10);
            
            if (isNaN(mes) || isNaN(ano)) return false;
            if (mes < 1 || mes > 12) return false;
            
            var dataValidade = new Date(ano, mes - 1);
            return dataValidade > hoje;
        };

        // Processa pagamento
        service.processarPagamento = function(valor) {
            var dados = angular.extend({}, service.dadosCartao, { valor: valor });
            return $http.post('/api/pagamento', dados);
        };

        return service;
    }]); 