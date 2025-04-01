/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import '../css/app.css';
import '../assets/icons-banks/icones-bancos-brasileiros.css';
import { hydrateRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import type { ReactElement } from 'react'

const appName = import.meta.env.VITE_APP_NAME || 'My Money Map'

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: (name) => {
    return resolvePageComponent(
      `../pages/${name}.tsx`,
      import.meta.glob('../pages/**/*.tsx'),
    )
  },

  setup({ el, App, props }) {
    hydrateRoot(
      el,
      <App {...props}>
        {({ Component }) => {
          // Type assertion para acessar a propriedade layout
          const PageComponent = Component as typeof Component & {
            layout?: React.ComponentType<{ children: React.ReactNode }>
          }

          const Layout = PageComponent.layout

          return Layout ? (
            <Layout>
              <PageComponent />
            </Layout>
          ) : (
            <PageComponent />
          )
        }}
      </App>
    )
  },
})
