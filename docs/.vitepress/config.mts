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
          { text: 'API', link: '/api/' },
          { text: 'OpenAPI', link: '/openapi/' }
        ],
        sidebar: {
          '/guide/': [
            { text: 'Overview', link: '/guide/' },
            { text: 'Authentication', link: '/guide/authentication' },
            { text: 'Payment Flow', link: '/guide/payment-flow' }
          ],
          '/api/': [
            { text: 'API Overview', link: '/api/' },
            { text: 'Terminal APIs', link: '/api/terminal' },
            { text: 'Transactions', link: '/api/transactions' },
            { text: 'Appendix', link: '/api/appendix' }
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
          { text: 'API', link: '/es/api/' },
          { text: 'OpenAPI', link: '/es/openapi/' }
        ],
        sidebar: {
          '/es/guide/': [
            { text: 'Resumen', link: '/es/guide/' },
            { text: 'Autenticación', link: '/es/guide/authentication' },
            { text: 'Flujo de Pago', link: '/es/guide/payment-flow' }
          ],
          '/es/api/': [
            { text: 'Resumen API', link: '/es/api/' },
            { text: 'APIs de Terminal', link: '/es/api/terminal' },
            { text: 'Transacciones', link: '/es/api/transactions' },
            { text: 'Apéndice', link: '/es/api/appendix' }
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
      copyright: 'Copyright AIMT NEXUS PTE. LTD.'
    }
  }
});
