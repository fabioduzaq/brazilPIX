require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const PORT = process.env.PORT || 3000;

// Configuração do CORS e middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Configuração da API Asaas
const ASAAS_TOKEN = process.env.ASAAS_TOKEN;
const ASAAS_API = process.env.ASAAS_API || 'https://api.asaas.com/v3';

// Middleware para log de requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
});

// Middleware para verificar token
const verificarToken = (req, res, next) => {
    if (!ASAAS_TOKEN) {
        return res.status(500).json({
            error: 'Token da API Asaas não configurado'
        });
    }
    next();
};

// Rota para criar intenção de pagamento Stripe
app.post("/api/stripe/create-payment-intent", async (req, res) => {
    try {
        const { amount } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe trabalha com centavos
            currency: "brl",
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                integration_check: 'accept_a_payment',
            },
        });

        res.json({
            clientSecret: paymentIntent.client_secret,
            amount: amount
        });
    } catch (error) {
        console.error('Erro ao criar PaymentIntent:', error);
        res.status(500).json({
            error: 'Erro ao processar pagamento',
            details: error.message
        });
    }
});

// Rota para webhook do Stripe
app.post("/api/stripe/webhook", express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Erro no webhook:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent foi bem-sucedido:', paymentIntent.id);
            break;
        case 'payment_intent.payment_failed':
            const paymentError = event.data.object;
            console.error('Pagamento falhou:', paymentError.id);
            break;
        default:
            console.log(`Evento não manipulado: ${event.type}`);
    }

    res.json({received: true});
});

// Rota para criar cliente
app.post('/api/asaas/customers', verificarToken, async (req, res) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${ASAAS_API}/customers`,
            headers: {
                'Accept': 'application/json',
                'access_token': ASAAS_TOKEN
            },
            data: req.body
        });
        res.json(response.data);
        console.log(response.data);
    } catch (error) {
        handleApiError(error, res);
    }
});

// Rota para transferencia pix
app.post('/api/asaas/pix-transfer', verificarToken, async (req, res) => {
    try {
        const { pix } = req.body;
        
        // Mapeia os dados recebidos para o formato esperado pela API Asaas
        const data = {
            value: parseFloat(pix.valor),
            operationType: 'PIX',
            pixAddressKey: pix.chave,
            pixAddressKeyType: pix.tipoChave.toUpperCase(),
            description: pix.descricao || 'Transferência Pix Internacional'
        };
        console.log('Dados da transferência:', data);
        const response = await axios({
            method: 'post',
            url: `${ASAAS_API}/transfers`,
            headers: {
                'Accept': 'application/json',
                'access_token': ASAAS_TOKEN
            },
            data: data
        });
        
        console.log('Resposta da API:', response.data);
        res.json(response.data);

    } catch (error) {
        handleApiError(error, res);
    }
});

// Rota para consultar status da transferência Pix
app.get('/api/asaas/pix/transfer/:id', verificarToken, async (req, res) => {
    try {
        const response = await axios({
            method: 'get',
            url: `${ASAAS_API}/transfers/${req.params.id}`,
            headers: {
                'Accept': 'application/json',
                'access_token': ASAAS_TOKEN
            }
        });
        res.json(response.data);
        console.log(response.data);
    } catch (error) {
        handleApiError(error, res);
    }
});

// Função auxiliar para tratamento de erros
function handleApiError(error, res) {
    console.error('Erro na chamada à API Asaas:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
        error: error.response?.data || 'Erro ao processar requisição',
        message: error.message
    });
}

// Rota para servir o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota catch-all para o Angular
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Servidor proxy rodando na porta ${PORT}`);
    console.log(`API Asaas configurada em: ${ASAAS_API}`);
}); 