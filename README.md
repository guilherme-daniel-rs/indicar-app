# IndiCar - App Mobile

App React Native para solicitação e acompanhamento de avaliações técnicas de veículos.

## 🚀 Tecnologias

- **React Native** com **Expo** (Managed Workflow)
- **TypeScript** para tipagem estática
- **React Navigation** para navegação
- **Zustand** para gerenciamento de estado
- **Axios** para requisições HTTP
- **React Hook Form** + **Zod** para formulários e validação
- **Expo Image Picker** para seleção de fotos
- **Expo Notifications** para push notifications

## 📱 Funcionalidades

### Autenticação
- Login e cadastro de usuários
- Armazenamento seguro de tokens (JWT)
- Refresh automático de tokens
- Logout com confirmação

### Avaliações
- Criar nova avaliação (cidade, marca, modelo, ano, observações)
- Listar avaliações com filtros por status
- Visualizar detalhes da avaliação
- Anexar fotos (múltiplas)
- Acompanhar status da avaliação

### Laudos
- Visualizar laudos em WebView
- Download de laudos
- Abertura no navegador nativo

### Notificações Push
- Registro automático do token do dispositivo
- Suporte para iOS e Android

### Perfil
- Visualizar e editar dados pessoais
- Gerenciar conta

## 🛠️ Configuração do Projeto

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- Expo CLI (`npm install -g @expo/cli`)
- Conta no Expo (para builds)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd indicar-app
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp env.example .env
   ```
   
   Edite o arquivo `.env` com suas configurações:
   ```env
   EXPO_PUBLIC_API_BASE_URL=https://sua-api.com:8080
   EXPO_PUBLIC_PROJECT_ID=seu-project-id-expo
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   # ou
   yarn start
   ```

### Estrutura do Projeto

```
src/
├── api/                    # Camada de API
│   ├── apiClient.ts       # Cliente Axios com interceptors
│   ├── endpoints.ts       # Endpoints da API
│   └── types.ts           # Tipos TypeScript
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
│   ├── Auth/
│   ├── Evaluations/
│   ├── Reports/
│   └── Account/
├── store/                # Gerenciamento de estado
│   ├── auth.store.ts
│   └── ui.store.ts
├── theme/                # Tema e estilos
│   └── index.ts
└── utils/                # Utilitários
    ├── validators.ts
    └── permissions.ts
```

## 🔧 Configuração da API

O app espera que a API backend tenha os seguintes endpoints:

### Autenticação
- `POST /auth/login` - Login do usuário
- `POST /auth/signup` - Cadastro do usuário
- `POST /auth/refresh` - Renovar token de acesso
- `GET /me` - Dados do usuário logado
- `PUT /me` - Atualizar dados do usuário

### Avaliações
- `POST /evaluations` - Criar nova avaliação
- `GET /evaluations` - Listar avaliações (com filtros)
- `GET /evaluations/{id}` - Detalhes da avaliação
- `PATCH /evaluations/{id}` - Atualizar avaliação
- `POST /evaluations/{id}/photos` - Upload de fotos

### Laudos
- `POST /reports` - Criar laudo
- `GET /reports/{id}` - Dados do laudo
- `GET /reports/{id}/file` - URL do arquivo do laudo

### Dispositivos
- `POST /devices` - Registrar token de push

### Utilitários
- `GET /cities` - Listar cidades disponíveis

## 📱 Build e Deploy

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento
npm start

# Executar no iOS
npm run ios

# Executar no Android
npm run android
```

### Build de Produção

```bash
# Build para Android
npm run build:android

# Build para iOS
npm run build:ios
```

## 🧪 Testes Manuais

### Fluxo de Login
1. Abra o app
2. Digite email e senha válidos
3. Verifique se o login é realizado com sucesso
4. Confirme navegação para a tela principal

### Criação de Avaliação
1. Acesse "Nova Avaliação"
2. Preencha todos os campos obrigatórios
3. Selecione uma cidade
4. Submeta o formulário
5. Verifique se a avaliação é criada e aparece na lista

### Upload de Fotos
1. Acesse os detalhes de uma avaliação
2. Toque em "Adicionar fotos"
3. Selecione fotos da galeria ou tire uma nova
4. Verifique se as fotos são enviadas com sucesso
5. Confirme se as fotos aparecem na tela

### Visualização de Laudo
1. Acesse uma avaliação com laudo disponível
2. Toque em "Ver Laudo"
3. Verifique se o laudo abre corretamente
4. Teste as opções de abrir no navegador e baixar

### Notificações Push
1. Aceite as permissões de notificação
2. Verifique se o token é registrado no backend
3. Teste o recebimento de notificações

## 🔒 Segurança

- Tokens JWT armazenados de forma segura com Expo SecureStore
- Refresh automático de tokens
- Validação de formulários com Zod
- Interceptors Axios para tratamento de erros de autenticação

## 🎨 UI/UX

- Design system consistente com tema customizável
- Componentes reutilizáveis
- Estados de loading e empty states
- Feedback visual com toasts
- Navegação intuitiva com tabs e stack

## 🐛 Troubleshooting

### Problemas Comuns

1. **Erro de conexão com API**
   - Verifique se a URL da API está correta no `.env`
   - Confirme se o servidor backend está rodando

2. **Erro de permissões de câmera/galeria**
   - Verifique as permissões no dispositivo
   - Teste em dispositivo físico (não funciona no simulador)

3. **Problemas com notificações push**
   - Confirme se o projeto Expo está configurado corretamente
   - Verifique se o token está sendo enviado para o backend

4. **Erro de build**
   - Limpe o cache: `expo start -c`
   - Reinstale as dependências: `rm -rf node_modules && npm install`

### Logs de Debug

```bash
# Ver logs detalhados
expo start --dev-client

# Logs específicos do React Native
npx react-native log-ios
npx react-native log-android
```

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte, entre em contato através dos canais oficiais do projeto.
