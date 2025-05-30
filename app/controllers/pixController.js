'use strict';

angular.module('pixBrasilApp')
    .controller('PixController', ['$scope', '$location', '$http', 'pixService', function($scope, $location, $http, pixService) {
        $scope.formData = {
            valorReal: '',
            valorDolar: 0,
            valorEuro: 0,
            valorPesoMx: 0,
            taxaDolar: 0,
            taxaEuro: 0,
            taxaReal: 0,
            taxaPesoMx: 0
        };
        $scope.loading = false;
        $scope.error = null;

        // Taxa de serviço (2%)
        const TAXA_SERVICO = 0.02;

        // Cotações (serão atualizadas a cada 1 minuto)
        let cotacoes = {
            USD: 5.0, // valor inicial aproximado
            EUR: 5.5, // valor inicial aproximado
            MXN: 0.29 // valor inicial aproximado
        };

        // Função para atualizar cotações
        function atualizarCotacoes() {
            $http.get('https://api.exchangerate-api.com/v4/latest/BRL')
                .then(function(response) {
                    cotacoes = {
                        USD: 1 / response.data.rates.USD,
                        EUR: 1 / response.data.rates.EUR,
                        MXN: 1 / response.data.rates.MXN
                    };
                    $scope.calcularConversoes();
                })
                .catch(function(error) {
                    console.error('Erro ao atualizar cotações:', error);
                });
        }

        // Atualizar cotações inicialmente e a cada 1 minuto
        atualizarCotacoes();
        setInterval(atualizarCotacoes, 60000);

        // Calcular conversões quando o valor em reais mudar
        $scope.calcularConversoes = function() {
            if (!$scope.formData.valorReal) {
                $scope.formData.valorDolar = 0;
                $scope.formData.valorEuro = 0;
                $scope.formData.valorPesoMx = 0;
                $scope.formData.taxaDolar = 0;
                $scope.formData.taxaEuro = 0;
                $scope.formData.taxaReal = 0;
                $scope.formData.taxaPesoMx = 0;
                return;
            }

            const valorReal = parseFloat($scope.formData.valorReal);
            
            // Taxa em Real
            $scope.formData.taxaReal = valorReal * TAXA_SERVICO;

            // Conversão para Dólar
            $scope.formData.valorDolar = valorReal / cotacoes.USD;
            $scope.formData.taxaDolar = $scope.formData.taxaReal / cotacoes.USD;

            // Conversão para Euro
            $scope.formData.valorEuro = valorReal / cotacoes.EUR;
            $scope.formData.taxaEuro = $scope.formData.taxaReal / cotacoes.EUR;

            // Conversão para Peso Mexicano
            $scope.formData.valorPesoMx = valorReal / cotacoes.MXN;
            $scope.formData.taxaPesoMx = $scope.formData.taxaReal / cotacoes.MXN;
        };

        // Lista de tipos de chave Pix
        $scope.tiposChave = [
            { id: 'cpf', nome: 'CPF' },
            { id: 'cnpj', nome: 'CNPJ' },
            { id: 'email', nome: 'E-mail' },
            { id: 'phone', nome: 'Telefone' },
            { id: 'evp', nome: 'Chave Aleatória' }
        ];

        // Validadores para cada tipo de chave
        const validadores = {
            cpf: function(chave) {
                const cpf = chave.replace(/\D/g, '');
                if (cpf.length !== 11) return false;
                if (/^(\d)\1{10}$/.test(cpf)) return false;
                
                let soma = 0;
                for (let i = 0; i < 9; i++) {
                    soma += parseInt(cpf.charAt(i)) * (10 - i);
                }
                let digito = 11 - (soma % 11);
                if (digito > 9) digito = 0;
                if (digito !== parseInt(cpf.charAt(9))) return false;

                soma = 0;
                for (let i = 0; i < 10; i++) {
                    soma += parseInt(cpf.charAt(i)) * (11 - i);
                }
                digito = 11 - (soma % 11);
                if (digito > 9) digito = 0;
                if (digito !== parseInt(cpf.charAt(10))) return false;

                return true;
            },
            cnpj: function(chave) {
                const cnpj = chave.replace(/\D/g, '');
                if (cnpj.length !== 14) return false;
                if (/^(\d)\1{13}$/.test(cnpj)) return false;

                let tamanho = cnpj.length - 2;
                let numeros = cnpj.substring(0, tamanho);
                const digitos = cnpj.substring(tamanho);
                let soma = 0;
                let pos = tamanho - 7;

                for (let i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2) pos = 9;
                }

                let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado !== parseInt(digitos.charAt(0))) return false;

                tamanho = tamanho + 1;
                numeros = cnpj.substring(0, tamanho);
                soma = 0;
                pos = tamanho - 7;

                for (let i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2) pos = 9;
                }

                resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
                if (resultado !== parseInt(digitos.charAt(1))) return false;

                return true;
            },
            email: function(chave) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(chave);
            },
            phone: function(chave) {
                const tel = chave.replace(/\D/g, '');
                return tel.length >= 10 && tel.length <= 11;
            },
            evp: function(chave) {
                return chave.length >= 32 && chave.length <= 36;
            }
        };

        // Formatar a chave de acordo com o tipo
        $scope.formatarChave = function() {
            if (!$scope.formData.chave) return;
            
            switch ($scope.formData.tipoChave) {
                case 'cpf':
                    $scope.formData.chave = $scope.formData.chave
                        .replace(/\D/g, '')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    break;
                case 'cnpj':
                    $scope.formData.chave = $scope.formData.chave
                        .replace(/\D/g, '')
                        .replace(/(\d{2})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1.$2')
                        .replace(/(\d{3})(\d)/, '$1/$2')
                        .replace(/(\d{4})(\d)/, '$1-$2');
                    break;
                case 'phone':
                    $scope.formData.chave = $scope.formData.chave
                        .replace(/\D/g, '')
                        .replace(/(\d{2})(\d)/, '($1) $2')
                        .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
                    break;
            }
        };

        // Atualiza placeholder quando muda o tipo de chave
        $scope.onTipoChaveChange = function() {
            $scope.formData.chave = '';
            switch ($scope.formData.tipoChave) {
                case 'cpf':
                    $scope.placeholder = '000.000.000-00';
                    break;
                case 'cnpj':
                    $scope.placeholder = '00.000.000/0000-00';
                    break;
                case 'email':
                    $scope.placeholder = 'exemplo@email.com';
                    break;
                case 'phone':
                    $scope.placeholder = '(00) 00000-0000';
                    break;
                case 'evp':
                    $scope.placeholder = 'Cole a chave aleatória aqui';
                    break;
            }
        };

        // Inicializa o tipo de chave e placeholder
        $scope.formData.tipoChave = 'cpf';
        $scope.onTipoChaveChange();

        // Função para validar a chave Pix
        function validarChave() {
            const validador = validadores[$scope.formData.tipoChave];
            return validador ? validador($scope.formData.chave) : false;
        }

        // Função para submeter o formulário
        $scope.submitForm = function() {
            if ($scope.pixForm.$valid) {
                if (!validarChave()) {
                    $scope.error = 'Chave Pix inválida para o tipo selecionado';
                    return;
                }

                // Armazenar dados na sessão para uso posterior
                sessionStorage.setItem('valorTransferencia', $scope.formData.valorReal);
                sessionStorage.setItem('tipoPix', $scope.formData.tipoChave);
                sessionStorage.setItem('chavePix', $scope.formData.chave);
                sessionStorage.setItem('descricaoPix', $scope.formData.descricao || '');

                // Redirecionar para a página de cadastro
                //$location.path('/cadastro');
                $location.path('/cartao');
            }
        };

        // Função para voltar à página anterior
        $scope.voltar = function() {
            $location.path('/cartao');
        };
    }]); 