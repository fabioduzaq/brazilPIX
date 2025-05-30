'use strict';

angular.module('pixBrasilApp')
    .controller('CadastroController', ['$scope', '$location', 'pixService', function($scope, $location, pixService) {
        $scope.formData = {};
        $scope.loading = false;
        $scope.error = null;

        // Lista de países para o select
        $scope.paises = [
            'Argentina', 'Bolívia', 'Chile', 'Colômbia', 'Equador',
            'Estados Unidos', 'México', 'Paraguai', 'Peru', 'Uruguai',
            'Venezuela', 'Outros'
        ];

        // Função para submeter o formulário
        $scope.submitForm = function() {
            if ($scope.cadastroForm.$valid) {
                $scope.loading = true;
                $scope.error = null;

                // Criar cliente no Asaas
                pixService.criarCliente({
                    name: $scope.formData.nome,
                    email: $scope.formData.email,
                    phone: $scope.formData.telefone,
                    mobilePhone: $scope.formData.telefone,
                    externalReference: $scope.formData.paisOrigem,
                    observations: 'Cliente estrangeiro - PixBrasil'
                })
                .then(function(response) {
                    // Armazena o ID do cliente para usar na próxima etapa
                    sessionStorage.setItem('clienteId', response.id);
                    // Redireciona para a página de cartão
                    $location.path('/cartao');
                })
                .catch(function(error) {
                    $scope.error = error.message || 'Erro ao cadastrar cliente. Por favor, tente novamente.';
                })
                .finally(function() {
                    $scope.loading = false;
                    // Força atualização da view
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            }
        };

        // Função para voltar à página anterior
        $scope.voltar = function() {
            window.history.back();
        };
    }]); 