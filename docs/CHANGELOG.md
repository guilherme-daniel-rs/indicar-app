# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

## [1.0.0-alpha] - 2024-12-19

### Adicionado
- Estrutura base do projeto React Native com Expo SDK 53
- Configuração de TypeScript com paths absolutos
- Sistema de navegação com React Navigation (Stack + Bottom Tabs)
- Gerenciamento de estado com Zustand
- Cliente HTTP com Axios e interceptors
- Sistema de tema e estilos
- Componentes reutilizáveis (Button, FormTextInput, PhotoPicker, etc.)
- Telas de autenticação (Login, Signup)
- Telas de avaliações (Lista, Nova, Detalhes)
- Tela de relatórios com WebView
- Tela de perfil do usuário
- Sistema de responsividade com SafeAreaInsets
- Configuração de ESLint e Prettier
- Estrutura de pastas organizada

### Modificado
- Atualização do Expo SDK de versão anterior para 53.0.0
- Configuração de dependências compatíveis com SDK 53
- Ajustes de responsividade para diferentes dispositivos
- Correção de problemas de navegação e tipos TypeScript

### Corrigido
- Erro de incompatibilidade de SDK entre app e dispositivo
- Problema de PlatformConstants não encontrado
- Erros de responsividade (header sobrepondo status bar)
- Ciclos de dependência em imports
- Problemas de tipos TypeScript em componentes de navegação
- Tab bar sobrepondo botões nativos do Android

### Temporariamente Desabilitado
- Integração real com API (usando dados mockados)
- Sistema de notificações push
- Persistência de tokens com SecureStore
- Validação completa de formulários

### Próximos Passos
- Restaurar funcionalidades de API gradualmente
- Implementar notificações push
- Reativar persistência de tokens
- Adicionar testes unitários e de integração
- Melhorar UX/UI com animações

---

## Notas de Desenvolvimento

### Problemas Encontrados e Soluções

1. **SDK Incompatível**
   - Problema: Expo SDK incompatível entre app e dispositivo
   - Solução: Atualização completa para SDK 53 e dependências compatíveis

2. **PlatformConstants Error**
   - Problema: `PlatformConstants could not be found`
   - Solução: Remoção de imports desnecessários e simplificação do código

3. **Responsividade**
   - Problema: Header e tab bar sobrepondo elementos nativos
   - Solução: Implementação de `useSafeAreaInsets` para áreas seguras

4. **Ciclos de Dependência**
   - Problema: Warnings de `Require cycle`
   - Solução: Movimentação de imports para dentro dos componentes

5. **Tipos TypeScript**
   - Problema: Propriedades não existentes em tipos de navegação
   - Solução: Uso correto de hooks `useNavigation` e `useRoute`

### Estratégia de Desenvolvimento

O projeto foi desenvolvido seguindo uma estratégia de "funcionamento primeiro, integração depois":

1. **Fase 1**: Estrutura base e navegação funcionando
2. **Fase 2**: Componentes e telas com dados mockados
3. **Fase 3**: Responsividade e UX básica
4. **Fase 4**: Integração gradual com API real
5. **Fase 5**: Funcionalidades avançadas (notificações, persistência)

Esta abordagem permitiu identificar e resolver problemas de configuração antes de adicionar complexidade de integração com backend.
