'use strict';

angular.module('pixBrasilApp')
    .service('stripeService', ['$http', '$q', '$window', function($http, $q, $window) {
        const stripe = $window.Stripe('pk_live_51JVDoDGOsZzhvXMpdPHpPMSLNVMAU6PDHzCo8oaYGNWmmOSvWmS7CMQVn2AltfjWOxiFwlUFJV1iXAHWEak0QMCE00eMO4kuhT');
        let elements = null;

        function handleError(error) {
            console.error('Erro no Stripe:', error);
            return $q.reject(error.data);
        }

        return {
            // Inicializar elementos do Stripe
            initializePaymentElement: async function(amount) {
                try {
                    const response = await $http.post('/api/stripe/create-payment-intent', { amount: amount });
                    const { clientSecret } = response.data;

                    const appearance = {
                        theme: 'stripe',
                        variables: {
                            colorPrimary: '#009c3b',
                            colorBackground: '#ffffff',
                            colorText: '#002776',
                            colorDanger: '#dc3545',
                            colorTextSecondary: '#002776',
                            colorTextPlaceholder: '#6c757d',
                            colorIcon: '#009c3b',
                            colorIconHover: '#008732',
                            spacingUnit: '4px',
                            borderRadius: '4px',
                            fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                            fontSizeBase: '15px',
                            fontWeightNormal: '400',
                            fontWeightMedium: '500',
                            fontWeightBold: '600',
                            fontLineHeight: '1.5',
                            fontSmooth: 'auto',
                        },
                        rules: {
                            '.Input': {
                                border: '1px solid #dee2e6',
                                boxShadow: 'none',
                                fontSize: '16px',
                                padding: '12px',
                                transition: 'border-color 0.2s ease',
                            },
                            '.Input:focus': {
                                borderColor: '#009c3b',
                                boxShadow: '0 0 0 1px #009c3b',
                            },
                            '.Label': {
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                            },
                            '.Error': {
                                fontSize: '14px',
                                marginTop: '8px',
                            },
                            '.Tab': {
                                padding: '10px 16px',
                                borderRadius: '4px',
                            },
                            '.Tab--selected': {
                                backgroundColor: '#009c3b',
                                color: '#ffffff',
                            },
                            '.TabIcon': {
                                marginRight: '8px',
                            }
                        }
                    };

                    elements = stripe.elements({ 
                        appearance, 
                        clientSecret,
                        locale: 'pt-BR'
                    });

                    const paymentElement = elements.create('payment', {
                        layout: 'tabs',
                        defaultValues: {
                            billingDetails: {
                                name: sessionStorage.getItem('nomeCliente'),
                                email: sessionStorage.getItem('emailCliente')
                            }
                        }
                    });

                    paymentElement.mount('#payment-element');
                    return elements;
                } catch (error) {
                    return handleError(error);
                }
            },

            // Confirmar pagamento
            confirmPayment: async function(returnUrl) {
                try {
                    const { error } = await stripe.confirmPayment({
                        elements,
                        confirmParams: {
                            return_url: returnUrl,
                            payment_method_data: {
                                billing_details: {
                                    name: sessionStorage.getItem('nomeCliente'),
                                    email: sessionStorage.getItem('emailCliente')
                                }
                            }
                        }
                    });

                    if (error) {
                        throw error;
                    }
                } catch (error) {
                    return handleError(error);
                }
            },

            // Verificar status do pagamento
            checkPaymentStatus: function() {
                const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
                if (!clientSecret) {
                    return $q.reject('Nenhum pagamento encontrado');
                }

                return stripe.retrievePaymentIntent(clientSecret)
                    .then(function(result) {
                        return result.paymentIntent;
                    })
                    .catch(handleError);
            }
        };
    }]); 