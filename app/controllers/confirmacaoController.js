'use strict';

angular.module('pixBrasilApp')
    .controller('ConfirmacaoController', ['$scope', '$window', '$location', 'ConfirmacaoService', 'pixService', 'StatusService',
        function($scope, $window, $location, ConfirmacaoService, pixService, StatusService) {
            
            // Lista de tipos de chave Pix
            $scope.tiposChave = [
                { id: 'cpf', nome: 'CPF' },
                { id: 'cnpj', nome: 'CNPJ' },
                { id: 'email', nome: 'E-mail' },
                { id: 'phone', nome: 'Telefone' },
                { id: 'evp', nome: 'Chave Aleatória' }
            ];

            // Inicializa os dados do sessionStorage no escopo
            var dadosTransacao = ConfirmacaoService.getDadosTransacao();
            $scope.dadosPix = {
                tipo: dadosTransacao.pix.tipoChave,
                chave: dadosTransacao.pix.chave,
                valor: ConfirmacaoService.formatarValor(dadosTransacao.pix.valor),
                descricao: dadosTransacao.pix.descricao
            };

            // Função para formatar a chave de acordo com o tipo
            $scope.formatarChave = function() {
                if (!$scope.dadosPix.chave) return;
                
                switch ($scope.dadosPix.tipo) {
                    case 'cpf':
                        $scope.dadosPix.chave = $scope.dadosPix.chave
                            .replace(/\D/g, '')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                        break;
                    case 'cnpj':
                        $scope.dadosPix.chave = $scope.dadosPix.chave
                            .replace(/\D/g, '')
                            .replace(/(\d{2})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1/$2')
                            .replace(/(\d{4})(\d)/, '$1-$2');
                        break;
                    case 'phone':
                        $scope.dadosPix.chave = $scope.dadosPix.chave
                            .replace(/\D/g, '')
                            .replace(/(\d{2})(\d)/, '($1) $2')
                            .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
                        break;
                }
            };

            // Atualiza o sessionStorage quando os dados são alterados
            $scope.onTipoChaveChange = function() {
                $scope.dadosPix.chave = ''; // Limpa a chave quando muda o tipo
                $window.sessionStorage.setItem('tipoPix', $scope.dadosPix.tipo);
            };

            // Observa mudanças na chave Pix
            $scope.$watch('dadosPix.chave', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $window.sessionStorage.setItem('chavePix', newValue);
                }
            });

            // Função para cancelar a transação
            $scope.cancelar = function() {
                $window.sessionStorage.clear();
                $location.path('/');
            };

            // Função para confirmar a transação
            $scope.confirmar = function() {
                ConfirmacaoService.confirmarTransacao()
                    .then(function(response) {
                        // Configura o ID da transferência no StatusService
                        StatusService.setTransferId(response.data.id);
                        
                        // Limpa os dados da sessão após confirmação bem-sucedida
                        $window.sessionStorage.clear();
                        
                        // Redireciona para a página de status
                        $location.path('/status');
                    })
                    .catch(function(error) {
                        $scope.error = 'Erro ao processar a transação. Por favor, tente novamente.';
                        console.error('Erro na transação:', error);
                    });
            };
        }
    ]); 