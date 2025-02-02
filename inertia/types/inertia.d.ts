import { LayoutComponent } from 'your-layout-type-path'

declare module '@inertiajs/react' {
  interface PageProps {
    // Adicione outras props globais se necessário
  }
}

declare module '@inertiajs/react' {
  interface Page {
    layout?: React.ComponentType<{ children: React.ReactNode }>
  }
}
