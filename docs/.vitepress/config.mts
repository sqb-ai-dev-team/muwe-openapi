import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'MUWE OpenAPI',
  description: 'Developer documentation for MUWE payment integrations',
  base: process.env.DOCS_BASE || '/',
  cleanUrls: true,
  lastUpdated: true,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/guide/' },
          { text: 'Terminal APIs', link: '/terminal/activate' },
          { text: 'API', link: '/api/' },
          { text: 'Reference', link: '/reference/' },
          { text: 'Console', link: '/console/' },
          { text: 'OpenAPI', link: '/openapi/' }
        ],
        sidebar: {
          '/guide/': [
            { text: 'Overview', link: '/guide/' },
            { text: 'Business Processes', link: '/guide/business-processes' },
            { text: 'API Guide & Authentication', link: '/guide/authentication' },
            { text: 'Payment Flow', link: '/guide/payment-flow' }
          ],
          '/terminal/': [
            { text: 'Activate', link: '/terminal/activate' },
            { text: 'Check-in', link: '/terminal/checkin' },
            { text: 'Log Upload', link: '/terminal/log-upload' }
          ],
          '/api/': [
            { text: 'API Overview', link: '/api/' },
            { text: 'Pay', link: '/api/pay' },
            { text: 'Pre-create', link: '/api/precreate' },
            { text: 'Query', link: '/api/query' },
            { text: 'Refund', link: '/api/refund' },
            { text: 'Cancel', link: '/api/cancel' },
            { text: 'Revoke', link: '/api/revoke' },
            { text: 'Legacy Transactions', link: '/api/transactions' }
          ],
          '/reference/': [
            { text: 'Reference Overview', link: '/reference/' },
            { text: 'Response Model', link: '/reference/response-model' },
            { text: 'Result & Error Codes', link: '/reference/result-codes' },
            { text: 'Order & Transaction Status', link: '/reference/order-status' },
            { text: 'Payment Providers', link: '/reference/payment-methods' }
          ],
          '/console/': [
            { text: 'Developer Console', link: '/console/' }
          ]
        }
      }
    },
    es: {
      label: 'Español',
      lang: 'es-MX',
      link: '/es/',
      themeConfig: {
        nav: [
          { text: 'Guía', link: '/es/guide/' },
          { text: 'Terminales', link: '/es/terminal/activate' },
          { text: 'API', link: '/es/api/' },
          { text: 'Referencia', link: '/es/reference/' },
          { text: 'Consola', link: '/es/console/' },
          { text: 'OpenAPI', link: '/es/openapi/' }
        ],
        sidebar: {
          '/es/guide/': [
            { text: 'Resumen', link: '/es/guide/' },
            { text: 'Procesos de negocio', link: '/es/guide/business-processes' },
            { text: 'Guía API y autenticación', link: '/es/guide/authentication' },
            { text: 'Flujo de Pago', link: '/es/guide/payment-flow' }
          ],
          '/es/terminal/': [
            { text: 'Activación', link: '/es/terminal/activate' },
            { text: 'Check-in', link: '/es/terminal/checkin' },
            { text: 'Carga de logs', link: '/es/terminal/log-upload' }
          ],
          '/es/api/': [
            { text: 'Resumen API', link: '/es/api/' },
            { text: 'Pay', link: '/es/api/pay' },
            { text: 'Pre-create', link: '/es/api/precreate' },
            { text: 'Query', link: '/es/api/query' },
            { text: 'Refund', link: '/es/api/refund' },
            { text: 'Cancel', link: '/es/api/cancel' },
            { text: 'Revoke', link: '/es/api/revoke' },
            { text: 'Transacciones legado', link: '/es/api/transactions' }
          ],
          '/es/reference/': [
            { text: 'Resumen de referencia', link: '/es/reference/' },
            { text: 'Modelo de respuesta', link: '/es/reference/response-model' },
            { text: 'Códigos de resultado y error', link: '/es/reference/result-codes' },
            { text: 'Estados', link: '/es/reference/order-status' },
            { text: 'Proveedores de pago', link: '/es/reference/payment-methods' }
          ],
          '/es/console/': [
            { text: 'Consola de desarrollador', link: '/es/console/' }
          ]
        }
      }
    }
  },
  themeConfig: {
    search: {
      provider: 'local'
    },
    footer: {
      message: 'MUWE OpenAPI documentation for bank and payment partners.',
      copyright: 'Copyright MUWE'
    }
  }
});
