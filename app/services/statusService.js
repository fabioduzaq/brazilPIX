'use strict';

angular.module('pixBrasilApp')
    .service('StatusService', ['$http', '$interval', 'ConfirmacaoService', 'pixService',
        function($http, $interval, ConfirmacaoService, pixService) {
            var service = {};
            
            // Status possíveis da transação
            service.STATUS = {
                PENDING: 'PENDING',
                BANK_PROCESSING: 'BANK_PROCESSING',
                DONE: 'DONE',
                CANCELLED: 'CANCELLED',
                FAILED: 'FAILED'
            };

            // Armazena os dados da transação
            service.dadosTransacao = ConfirmacaoService.getDadosTransacao();
            
            // Armazena o status atual e dados da transferência
            service.statusAtual = service.STATUS.PENDING;
            service.dadosTransferencia = null;
            
            // Armazena o ID do intervalo de polling
            var pollingId = null;

            // Armazena o ID da transferência
            var transferId = null;

            // Configura o ID da transferência
            service.setTransferId = function(id) {
                transferId = id;
                console.log('ID da transferência configurado:', id);
            };

            // Consulta o status da transferência usando pixService
            service.consultarStatus = function() {
                if (!transferId) {
                    console.error('ID da transferência não configurado');
                    return Promise.reject('ID da transferência não configurado');
                }

                return pixService.consultarTransferenciaPix(transferId);
            };

            // Inicia o monitoramento do status
            service.iniciarMonitoramento = function(callback) {
                // Cancela qualquer monitoramento anterior
                if (pollingId) {
                    $interval.cancel(pollingId);
                }

                // Inicia o polling a cada 3 segundos
                pollingId = $interval(function() {
                    service.consultarStatus()
                        .then(function(response) {
                            service.statusAtual = response.status;
                            service.dadosTransferencia = response;
                            
                            // Se o status for final, para o monitoramento
                            if (![service.STATUS.PENDING, service.STATUS.BANK_PROCESSING].includes(service.statusAtual)) {
                                $interval.cancel(pollingId);
                            }
                            
                            if (callback) {
                                callback(service.statusAtual, service.dadosTransferencia);
                            }
                        })
                        .catch(function(error) {
                            console.error('Erro ao consultar status:', error);
                            service.statusAtual = service.STATUS.FAILED;
                            service.dadosTransferencia = error;
                            $interval.cancel(pollingId);
                            
                            if (callback) {
                                callback(service.statusAtual, service.dadosTransferencia);
                            }
                        });
                }, 3000);
            };

            // Retorna o texto do status
            service.getTextoStatus = function(status) {
                switch (status) {
                    case service.STATUS.PENDING:
                        return 'Iniciando sua transferência...';
                    case service.STATUS.BANK_PROCESSING:
                        return 'Processando sua transferência no banco...';
                    case service.STATUS.DONE:
                        return 'Transferência concluída com sucesso!';
                    case service.STATUS.FAILED:
                        return 'Falha ao processar a transferência.';
                    case service.STATUS.CANCELLED:
                        return 'Transferência cancelada.';
                    default:
                        return 'Status desconhecido';
                }
            };

            // Retorna a classe CSS do status
            service.getClasseStatus = function(status) {
                switch (status) {
                    case service.STATUS.PENDING:
                    case service.STATUS.BANK_PROCESSING:
                        return 'text-primary';
                    case service.STATUS.DONE:
                        return 'text-success';
                    case service.STATUS.FAILED:
                    case service.STATUS.CANCELLED:
                        return 'text-danger';
                    default:
                        return '';
                }
            };

            // Retorna os dados da transferência
            service.getDadosTransferencia = function() {
                return service.dadosTransferencia;
            };

            // Limpa o monitoramento ao destruir o serviço
            service.destruir = function() {
                if (pollingId) {
                    $interval.cancel(pollingId);
                }
                service.dadosTransferencia = null;
            };

            return service;
        }
    ]); 