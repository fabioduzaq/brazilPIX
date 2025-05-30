'use strict';

angular.module('pixBrasilApp')
    .controller('CartaoController', ['$scope', '$location', 'stripeService', function($scope, $location, stripeService) {
        // Recuperar valores da sessão
        $scope.valorTransferencia = parseFloat(sessionStorage.getItem('valorTransferencia') || 0);
        $scope.taxaServico = $scope.valorTransferencia * 0.02; // 2% de taxa
        $scope.valorTotal = $scope.valorTransferencia + $scope.taxaServico;
        
        // Recuperar dados do Pix
        $scope.tipoPix = sessionStorage.getItem('tipoPix');
        $scope.chavePix = sessionStorage.getItem('chavePix');
        $scope.descricaoPix = sessionStorage.getItem('descricaoPix');
        
        // Detectar sistema operacional para pagamento
        function detectarSistemaOperacional() {
            var userAgent = window.navigator.userAgent.toLowerCase();
            var platform = window.navigator.platform.toLowerCase();
            
            $scope.isIOS = /iphone|ipad|ipod/.test(userAgent) || 
                          /iphone|ipad|ipod/.test(platform) ||
                          (platform === 'macintel' && navigator.maxTouchPoints > 1);
                          
            $scope.isAndroid = /android/.test(userAgent) || 
                              /linux armv/.test(platform) ||
                              /android/.test(platform);
                              
            console.log('Sistema Operacional:', {
                userAgent: userAgent,
                platform: platform,
                isIOS: $scope.isIOS,
                isAndroid: $scope.isAndroid
            });
        }
        
        // Executar detecção
        detectarSistemaOperacional();
        
        $scope.loading = false;
        $scope.error = null;
        $scope.stripeReady = false; // Novo flag para controle do estado do Stripe

        // Função para resetar estado do formulário
        function resetarEstadoFormulario() {
            $scope.loading = false;
            if (!$scope.$$phase) {
                $scope.$apply();
            }
        }

        // Inicializar elementos do Stripe
        async function initializeStripe() {
            try {
                $scope.loading = true;
                const elementResult = await stripeService.initializePaymentElement($scope.valorTotal);
                $scope.stripeReady = true; // Marca como pronto após inicialização bem-sucedida
                $scope.loading = false;
                
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            } catch (erro) {
                console.log('Erro na inicialização do Stripe:', erro);
                $scope.error = formatarMensagemErro(erro);
                $scope.stripeReady = false;
                resetarEstadoFormulario();
            }
        }

        // Inicializar quando a página carregar
        initializeStripe();

        // Função para formatar mensagem de erro
        function formatarMensagemErro(erro) {
            if (typeof erro === 'string') {
                return erro;
            }
            
            if (erro && erro.message) {
                return erro.message;
            }
            
            if (erro && erro.error && erro.error.message) {
                return erro.error.message;
            }
            
            return 'Erro ao processar pagamento. Por favor, tente novamente.';
        }

        // Submeter pagamento
        $scope.submitPayment = async function(event) {
            event.preventDefault();
            
            if (!$scope.stripeReady) {
                $scope.error = 'Aguarde o carregamento do formulário de pagamento.';
                return;
            }

            $scope.loading = true;
            $scope.error = null;

            try {
                await stripeService.confirmPayment(window.location.origin + '/#/confirmacao');
            } catch (erro) {
                console.log('Erro no pagamento:', erro);
                $scope.error = formatarMensagemErro(erro);
                resetarEstadoFormulario();
            }
        };

        // Limpar erro ao tentar novamente
        $scope.limparErro = function() {
            $scope.error = null;
            resetarEstadoFormulario();
        };

        // Voltar para a página anterior
        $scope.voltar = function() {
            $location.path('/cadastro');
        };
    }]); 