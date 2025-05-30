'use strict';

angular.module('pixBrasilApp')
    .controller('StatusController', ['$scope', '$location', 'StatusService',
        function($scope, $location, StatusService) {
            
            // Controle de loading
            $scope.isLoading = true;
            
            // Inicializa o status
            $scope.status = StatusService.statusAtual;
            $scope.getTextoStatus = StatusService.getTextoStatus;
            $scope.getClasseStatus = StatusService.getClasseStatus;

            // Dados da transferência
            $scope.transferData = {};

            // Inicia o monitoramento do status
            StatusService.iniciarMonitoramento(function(novoStatus, dadosTransferencia) {
                $scope.status = novoStatus;
                $scope.transferData = dadosTransferencia;
                $scope.isLoading = false;
                
                // Força atualização da view se necessário
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });

            // Função para voltar à página inicial
            $scope.voltarInicio = function() {
                $location.path('/');
            };

            // Limpa o monitoramento quando o controller é destruído
            $scope.$on('$destroy', function() {
                StatusService.destruir();
            });
        }
    ]); 