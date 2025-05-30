# PixBrasil - Sistema de Transferências Internacionais via Pix

<div align="center">

![PixBrasil Logo](assets/images/logo.png)

[![Versão](https://img.shields.io/badge/versão-1.0.0-blue.svg)](https://semver.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![AngularJS](https://img.shields.io/badge/AngularJS-1.2.10-red.svg)](https://angularjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14.x-green.svg)](https://nodejs.org/)

</div>

## 📋 Sumário

- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Funcionalidades](#-funcionalidades)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Uso](#-uso)
- [API](#-api)
- [Testes](#-testes)
- [Deploy](#-deploy)
- [Contribuição](#-contribuição)
- [Licença](#-licença)
- [Contato](#-contato)

## 🚀 Sobre o Projeto

O PixBrasil é uma solução inovadora que permite que estrangeiros realizem transferências para o Brasil utilizando o sistema Pix, mesmo sem ter uma conta bancária brasileira. Nossa plataforma oferece uma interface intuitiva e segura para processar pagamentos internacionais de forma rápida e eficiente.

### 💡 Principais Diferenciais

- Transferências instantâneas 24/7
- Suporte a múltiplas moedas
- Interface multilíngue (PT-BR, EN, ES)
- Processamento seguro de cartões internacionais
- Rastreamento em tempo real das transferências
- Taxas competitivas

## 🛠 Tecnologias

### Frontend
- **AngularJS** (v1.2.10) - Framework MVC
- **Bootstrap** (v3.3.7) - Framework CSS
- **jQuery** (v1.11.0) - Manipulação DOM
- **Font Awesome** (v5.15.4) - Ícones
- **Stripe.js** (v3) - Processamento de Pagamentos

### Backend
- **Node.js** (v14.x) - Runtime JavaScript
- **Express** (v4.x) - Framework Web
- **Axios** (v0.21.x) - Cliente HTTP
- **Cors** (v2.8.x) - Middleware CORS
- **Dotenv** (v8.x) - Configuração de Ambiente

### Integrações
- **Stripe** - Processamento de Pagamentos Internacionais
- **Asaas** - API de Transferências Pix
- **AWS** - Infraestrutura Cloud (opcional)

## 📐 Arquitetura

### Estrutura de Diretórios
```
pixbrasil/
├── app/
│   ├── controllers/
│   │   ├── pixController.js
│   │   ├── cadastroController.js
│   │   ├── cartaoController.js
│   │   ├── confirmacaoController.js
│   │   └── statusController.js
│   ├── services/
│   │   ├── pixService.js
│   │   ├── stripeService.js
│   │   └── statusService.js
│   └── views/
│       ├── cadastro.html
│       ├── cartao.html
│       ├── confirmacao.html
│       └── status.html
├── assets/
│   ├── css/
│   ├── js/
│   └── images/
├── config/
├── public/
└── server/
```

### Fluxo da Aplicação

1. **Entrada de Dados**
   - Validação da chave Pix
   - Conversão de moedas
   - Cálculo de taxas

2. **Processamento do Pagamento**
   - Tokenização do cartão
   - Validação 3D Secure
   - Criação de PaymentIntent

3. **Transferência Pix**
   - Validação dos dados
   - Processamento via Asaas
   - Monitoramento do status

## ⚙️ Funcionalidades

- [x] Cadastro simplificado sem CPF
- [x] Validação de chaves Pix
- [x] Processamento de cartões internacionais
- [x] Conversão automática de moedas
- [x] Transferências Pix instantâneas
- [x] Monitoramento em tempo real
- [x] Comprovantes digitais
- [x] Suporte multilíngue

## 📋 Requisitos

- Node.js (v14.x ou superior)
- NPM (v6.x ou superior)
- Conta Stripe
- Conta Asaas
- Certificado SSL para produção

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/pixbrasil.git
cd pixbrasil
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas credenciais
```

## ⚙️ Configuração

1. **Variáveis de Ambiente**
```env
NODE_ENV=development
PORT=3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ASAAS_TOKEN=...
ASAAS_API=https://api.asaas.com/v3
```

2. **Configuração do Stripe**
```javascript
// config/stripe.js
module.exports = {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    // ... outras configurações
};
```

## 🚀 Uso

1. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

2. Acesse a aplicação:
```
http://localhost:3000
```

## 📡 API

### Endpoints Principais

```http
POST /api/stripe/create-payment-intent
POST /api/stripe/webhook
POST /api/asaas/pix-transfer
GET /api/asaas/pix/transfer/:id
```

## 🧪 Testes

```bash
# Executar testes unitários
npm run test

# Executar testes de integração
npm run test:integration

# Verificar cobertura
npm run test:coverage
```

## 📦 Deploy

1. Build da aplicação:
```bash
npm run build
```

2. Deploy para produção:
```bash
npm run deploy
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

PixBrasil - [suporte@pixbrasil.com](mailto:suporte@pixbrasil.com)

Website: [https://www.pixbrasil.com](https://www.pixbrasil.com)

## 🔒 Segurança

- Certificação PCI DSS
- Criptografia de ponta a ponta
- Proteção contra fraudes
- Monitoramento 24/7
- Backup automático

## 📊 Status do Projeto

![GitHub last commit](https://img.shields.io/github/last-commit/seu-usuario/pixbrasil)
![GitHub issues](https://img.shields.io/github/issues/seu-usuario/pixbrasil)
![GitHub pull requests](https://img.shields.io/github/issues-pr/seu-usuario/pixbrasil)

---

<div align="center">

Desenvolvido com ❤️ pela equipe PixBrasil

</div>
