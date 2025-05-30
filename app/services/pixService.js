'use strict';

angular.module('pixBrasilApp')
    .service('pixService', ['$http', '$q', function($http, $q) {
        const API_BASE = '/api/asaas';

        function handleSuccess(response) {
            return response.data;
        }

        function handleError(error) {
            console.error('Erro na requisição:', error);
            return $q.reject(error.data);
        }

        return { 
            // Criar cliente
            criarCliente: function(dadosCliente) {
                return $http.post(`${API_BASE}/customers`, dadosCliente)
                    .then(handleSuccess)
                    .catch(handleError);
            },

            // Criar cobrança
            criarCobranca: function(dadosCobranca) {
                return $http.post(`${API_BASE}/payments`, dadosCobranca)
                    .then(handleSuccess)
                    .catch(handleError);
            },

            // Consultar status do pagamento
            consultarPagamento: function(pagamentoId) {
                return $http.get(`${API_BASE}/payments/${pagamentoId}`)
                    .then(handleSuccess)
                    .catch(handleError);
            },

            // Criar link de pagamento
            criarLinkPagamento: function(dadosLink) {
                return $http.post(`${API_BASE}/payment-links`, dadosLink)
                    .then(handleSuccess)
                    .catch(handleError);
            },

            // Criar transferência Pix
            criarTransferenciaPix: function(dadosTransferencia) {
                return $http.post(`${API_BASE}/pix/transfer`, dadosTransferencia)
                    .then(handleSuccess)
                    .catch(handleError);
            },

            // Consultar status da transferência Pix
            consultarTransferenciaPix: function(transferenciaId) {
                return $http.get(`${API_BASE}/pix/transfer/${transferenciaId}`)
                    .then(handleSuccess)
                    .catch(handleError);
            },

            // Obter informações comerciais
            obterInfoComercial: function() {
                return $http.get(`${API_BASE}/commercial-info`)
                    .then(handleSuccess)
                    .catch(handleError);
            }
        };
    }]); 