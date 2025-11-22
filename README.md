# IndiCar - App de Avaliações Técnicas de Veículos

## 📱 Sobre o Projeto

O IndiCar é um aplicativo React Native desenvolvido com Expo para avaliações técnicas de veículos, integração de fotos e geração de relatórios. O app se conecta com um backend Go existente e oferece funcionalidades completas para técnicos e avaliadores.

## 🚀 Tecnologias Utilizadas

- **React Native** - Framework para desenvolvimento mobile
- **Expo SDK 53** - Plataforma para desenvolvimento universal
- **TypeScript** - Superset do JavaScript com tipagem estática
- **React Navigation** - Navegação (Stack + Bottom Tabs)
- **Zustand** - Gerenciamento de estado global
- **Axios** - Cliente HTTP com interceptors
- **react-hook-form + Zod** - Gerenciamento e validação de formulários
- **expo-image-picker** - Captura e seleção de fotos
- **expo-notifications** - Notificações push
- **expo-secure-store** - Armazenamento seguro de tokens

## 📁 Estrutura do Projeto

```
src/
├── api/                    # Configuração e endpoints da API
│   ├── apiClient.ts       # Cliente Axios com interceptors
│   ├── endpoints.ts       # Funções de API
│   └── types.ts          # Tipos TypeScript para API
├── components/            # Componentes reutilizáveis
│   ├── Button.tsx
│   ├── FormTextInput.tsx
│   ├── PhotoPicker.tsx
│   ├── EmptyState.tsx
│   ├── LoadingSpinner.tsx
│   └── ToastContainer.tsx
├── navigation/            # Configuração de navegação
│   └── AppNavigator.tsx
├── screens/              # Telas da aplicação
│   ├── Auth/            # Telas de autenticação
│   ├── Evaluations/     # Telas de avaliações
│   ├── Reports/         # Telas de relatórios
│   └── Account/         # Telas de perfil
├── store/               # Gerenciamento de estado
│   ├── auth.store.ts   # Store de autenticação
│   └── ui.store.ts     # Store de UI (toasts, etc.)
├── theme/               # Tema e estilos
│   └── index.ts
└── utils/               # Utilitários
    ├── validators.ts    # Schemas Zod
    └── permissions.ts   # Gerenciamento de permissões
```

## 🔧 Configuração e Instalação

### Pré-requisitos

- Node.js (versão 18 ou superior)
- Expo CLI
- Expo Go app no dispositivo móvel
- Backend Go rodando (para funcionalidades completas)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd indicar-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://sua-api.com
   EXPO_PUBLIC_PROJECT_ID=seu-project-id
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npx expo start --port 8082
   ```

5. **Execute no dispositivo**
   - Escaneie o QR code com o Expo Go
   - Ou use um emulador Android/iOS

## 📋 Funcionalidades Implementadas

### ✅ MVP Funcional
- [x] **Estrutura base** - Navegação e componentes
- [x] **Autenticação** - Telas de login/signup (mockadas)
- [x] **Avaliações** - Lista, criação e detalhes (mockadas)
- [x] **Fotos** - Componente de seleção de imagens
- [x] **Relatórios** - Visualização de laudos
- [x] **Perfil** - Tela de conta do usuário
- [x] **Responsividade** - Layout adaptável para diferentes dispositivos
- [x] **Tema** - Sistema de cores e estilos consistente

### 🔄 Em Desenvolvimento
- [ ] **Integração com API** - Conexão real com backend
- [ ] **Notificações push** - Sistema de notificações
- [ ] **Persistência** - Armazenamento seguro de tokens
- [ ] **Validação de formulários** - Schemas Zod completos

## 🛠️ Desenvolvimento e Debugging

### Problemas Resolvidos Durante o Desenvolvimento

1. **Incompatibilidade de SDK**
   - **Problema**: Expo SDK incompatível entre app e dispositivo
   - **Solução**: Atualização para SDK 53 e dependências compatíveis

2. **Erros de PlatformConstants**
   - **Problema**: `PlatformConstants could not be found`
   - **Solução**: Remoção de imports desnecessários e simplificação do código

3. **Problemas de Responsividade**
   - **Problema**: Header sobrepondo status bar, tab bar sobrepondo botões nativos
   - **Solução**: Implementação de `useSafeAreaInsets` para áreas seguras

4. **Ciclos de Dependência**
   - **Problema**: `Require cycle` warnings
   - **Solução**: Movimentação de imports para dentro dos componentes

5. **Erros de TypeScript**
   - **Problema**: Propriedades não existentes em tipos
   - **Solução**: Correção de tipos e uso de hooks de navegação

### Comandos Úteis

```bash
# Limpar cache do Expo
npx expo start --clear

# Limpar cache do Watchman
watchman watch-del '/Users/guilherme/Projects/Indicar/indicar-app'
watchman watch-project '/Users/guilherme/Projects/Indicar/indicar-app'

# Verificar erros de linting
npx eslint src/

# Formatar código
npx prettier --write src/
```

## 🔗 Integração com Backend

### Endpoints da API

- **Autenticação**: `/auth/login`, `/auth/refresh`
- **Avaliações**: `/evaluations`, `/evaluations/:id`
- **Fotos**: `/evaluations/:id/photos`, `/photos/presigned-url`
- **Relatórios**: `/reports/:id`, `/reports/:id/presigned-url`
- **Dispositivos**: `/devices` (para notificações push)

### Configuração de Interceptors

O `apiClient.ts` está configurado com:
- Interceptor de requisição para adicionar token de autorização
- Interceptor de resposta para renovação automática de tokens
- Tratamento de erros 401 com refresh token

## 📱 Testes e Validação

### Testes Manuais Recomendados

1. **Navegação**
   - [ ] Login → Nova Avaliação → Detalhes
   - [ ] Navegação entre tabs
   - [ ] Botões de voltar funcionando

2. **Formulários**
   - [ ] Criação de nova avaliação
   - [ ] Validação de campos obrigatórios
   - [ ] Seleção de fotos

3. **Responsividade**
   - [ ] Header respeitando status bar
   - [ ] Tab bar acima dos botões nativos
   - [ ] Conteúdo visível em diferentes tamanhos de tela

## 🚀 Próximos Passos

1. **Restaurar funcionalidades de API**
   - Conectar com backend real
   - Implementar autenticação real
   - Carregar dados reais

2. **Implementar notificações push**
   - Configurar expo-notifications
   - Registrar dispositivo no backend
   - Tratar notificações recebidas

3. **Melhorar UX/UI**
   - Animações e transições
   - Estados de loading mais refinados
   - Feedback visual melhorado

4. **Testes e Qualidade**
   - Testes unitários
   - Testes de integração
   - CI/CD pipeline

## 📄 Licença

Este projeto é privado e proprietário da IndiCar.

## 👥 Equipe

- **Desenvolvimento**: Engenheiro Front-end Sênior
- **Backend**: Equipe Go (existente)
- **Design**: Equipe de UX/UI

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0.0-alpha  
**Status**: Em desenvolvimento ativo