'use strict';

angular.module('pixBrasilApp')
    .service('ConfirmacaoService', ['$window', '$http', function($window, $http) {
        
        // Função para obter os dados da transação do sessionStorage
        this.getDadosTransacao = function() {
            return {
                pix: {
                    tipoChave: $window.sessionStorage.getItem('tipoPix'),
                    chave: $window.sessionStorage.getItem('chavePix'),
                    valor: parseFloat($window.sessionStorage.getItem('valorTransferencia')),
                    descricao: $window.sessionStorage.getItem('descricaoPix')
                }
            };
        };

        // Função para obter o nome do tipo de chave Pix
        this.getNomeTipoChave = function(tipo) {
            const tiposChave = {
                'cpf': 'CPF',
                'cnpj': 'CNPJ',
                'email': 'E-mail',
                'telefone': 'Telefone',
                'aleatoria': 'Chave Aleatória'
            };
            return tiposChave[tipo] || tipo;
        };

        // Função para formatar valor em reais
        this.formatarValor = function(valor) {
            return 'R$ ' + valor.toFixed(2).replace('.', ',');
        };

        // Função para confirmar a transação
        this.confirmarTransacao = function() {
            return $http.post('/api/asaas/pix-transfer', this.getDadosTransacao());
        };

        
    }]); 