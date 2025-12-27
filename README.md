# Tem que Comprar - PWA

Progressive Web App para gerenciamento de estoque doméstico e lista de compras familiar.

## Características

- Progressive Web App instalável em dispositivos móveis e desktop
- Interface responsiva e mobile-first
- Notificações push para alertas de estoque baixo
- Gerenciamento de produtos com categorias
- Lista de compras colaborativa
- Sistema de convite para membros da família
- Alertas visuais para produtos abaixo da quantidade mínima

## Tecnologias

- React 18 com TypeScript
- Zustand para gerenciamento de estado
- React Router para navegação
- TailwindCSS para estilização
- Lucide React para ícones
- Service Worker para funcionalidades PWA

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Variáveis disponíveis:
- `VITE_API_URL`: URL base da API backend
- `VITE_VAPID_PUBLIC_KEY`: Chave pública VAPID para notificações push

## Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Estrutura do Projeto

```
src/
├── components/       # Componentes reutilizáveis
│   ├── Layout.tsx
│   ├── ProductCard.tsx
│   ├── ShoppingListItem.tsx
│   └── MemberCard.tsx
├── pages/           # Páginas da aplicação
│   ├── Login.tsx
│   ├── Home.tsx
│   ├── Products.tsx
│   ├── ShoppingList.tsx
│   └── Members.tsx
├── store/           # Gerenciamento de estado com Zustand
│   └── useStore.ts
├── services/        # Serviços e comunicação com API
│   └── api.ts
├── utils/           # Utilitários
│   ├── ProtectedRoute.tsx
│   ├── pwa.ts
│   └── mockData.ts
├── types/           # Definições TypeScript
│   └── index.ts
├── App.tsx          # Componente principal com roteamento
└── main.tsx         # Entry point da aplicação
```

## Funcionalidades

### Login
- Autenticação com email e senha
- Token armazenado no sessionStorage
- Credenciais de demonstração:
  - Email: demo@familia.com
  - Senha: demo123

### Dashboard (Home)
- Visão geral de produtos, lista e membros
- Alertas de estoque baixo
- Ações rápidas

### Produtos
- Listagem de produtos com filtros
- Busca por nome ou marca
- Filtro por categoria
- Adicionar/editar/remover produtos
- Alertas visuais para estoque baixo
- Adicionar à lista de compras produtos com estoque baixo

### Lista de Compras
- Adicionar itens manualmente
- Marcar como comprado
- Separação entre pendentes e comprados
- Remover itens

### Membros da Família
- Listagem de membros
- Link de convite para novos membros
- Identificação de administradores

## PWA

O app suporta instalação como PWA com:
- Manifest.json configurado
- Service Worker para cache offline
- Notificações push
- Ícones para diferentes dispositivos

## Dados Mock

Para desenvolvimento, o app utiliza dados mockados localmente. Quando o backend estiver pronto, basta atualizar o arquivo `src/services/api.ts` para integrar com as APIs reais.

## Próximos Passos

1. Integrar com API backend
2. Implementar sincronização offline
3. Adicionar suporte a fotos de produtos
4. Implementar histórico de compras
5. Adicionar relatórios e estatísticas
