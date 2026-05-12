# Janus — Aplicativo Móvel

Aplicativo móvel desenvolvido como parte do Trabalho de Conclusão de Curso de Engenharia de Computação (PUCPR, 2025), cujo objetivo é oferecer uma solução de interfonia residencial acessível para pessoas com deficiência auditiva ou de fala.

## Sobre o projeto

Interfones e campainhas convencionais dependem de sinais sonoros, o que cria uma barreira de comunicação para usuários surdos ou com perda auditiva. Segundo a PNS 2019 (IBGE), cerca de 2,3 milhões de brasileiros declararam grande dificuldade ou incapacidade total de ouvir — uma parcela significativa da população frequentemente negligenciada pelas soluções de automação residencial disponíveis no mercado.

O projeto propõe um interfone inteligente que permite comunicação bidirecional via vídeo em tempo real, transcrição automática da fala do visitante (Speech-to-Text) e síntese de voz para mensagens digitadas pelo usuário (Text-to-Speech), além de controle remoto da fechadura.

O sistema é composto por três componentes principais:

- **Dispositivo embarcado** — Raspberry Pi 4 com câmera, microfone, alto-falante, servo motor e demais periféricos, instalado na entrada da residência.
- **Back-end** — API REST em TypeScript com PostgreSQL, responsável pelo gerenciamento de usuários, dispositivos, gravações e eventos. Repositório: [janus-back-end](https://github.com/escbarros/janus-back-end).
- **Aplicativo móvel** — este repositório.

## Design

O protótipo de alta fidelidade da interface está disponível no Figma:

🎨 [**Janus — Alta Fidelidade (Figma)**](https://www.figma.com/design/hhQJDVirzahMxC2FEvUlBP/Alta-Fidelidade?node-id=0-1)

## Demonstrações

Vídeos demonstrando as principais funcionalidades do sistema:

| # | Funcionalidade | Vídeo |
| --- | --- | --- |
| 1 | Autenticação pelo aplicativo | [▶️ Assistir](https://youtu.be/Q1Ybbk2eQzY) |
| 2 | Pareamento de um novo interfone | [▶️ Assistir](https://youtu.be/0LwyoF7uhls) |
| 3 | Funcionamento do evento de campainha | [▶️ Assistir](https://youtu.be/IIqcsuyzZIc) |
| 4 | Chamada ao vivo | [▶️ Assistir](https://youtu.be/qXcGGxUXxkY) |
| 5 | Funcionamento da transcrição (Speech-to-Text) | [▶️ Assistir](https://youtu.be/3BP2GhFiSqY) |
| 6 | Funcionamento da sintetização (Text-to-Speech) | [▶️ Assistir](https://youtu.be/NBumZ8Zto1E) |
| 7 | Gravação de uma chamada | [▶️ Assistir](https://youtu.be/sJwk4N5R_o0) |

---

## Índice

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos e Ambiente](#pré-requisitos-e-ambiente)
- [Variáveis de Ambiente e Segurança](#variáveis-de-ambiente-e-segurança)
- [Instalação e Execução](#instalação-e-execução)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Padrões de Código e Performance](#padrões-de-código-e-performance)
- [Build, Deploy e OTA Updates](#build-deploy-e-ota-updates)
- [Scripts Úteis](#scripts-úteis)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Tecnologias Utilizadas

| Categoria | Tecnologia |
| --- | --- |
| Framework | [Expo](https://expo.dev) SDK 53 (Managed Workflow) + [React Native](https://reactnative.dev) 0.79 |
| Linguagem | [TypeScript](https://www.typescriptlang.org) 5.8 |
| Navegação | [Expo Router](https://docs.expo.dev/router/introduction/) 5 + [React Navigation](https://reactnavigation.org) 7 |
| Estado global | [Zustand](https://zustand-demo.pmnd.rs) |
| Estilização | [NativeWind](https://www.nativewind.dev) (Tailwind CSS) |
| Autenticação | [Clerk](https://clerk.com) (`@clerk/clerk-expo`) |
| Comunicação em tempo real | [react-native-webrtc](https://github.com/react-native-webrtc/react-native-webrtc), [MQTT](https://github.com/mqttjs/MQTT.js) / Paho MQTT |
| HTTP | [Axios](https://axios-http.com) |
| UI / UX | `@gorhom/bottom-sheet`, `lucide-react-native`, `lottie-react-native`, `react-native-reanimated`, `expo-haptics`, `expo-blur`, `expo-linear-gradient` |
| Mídia | `expo-av`, `expo-video`, `expo-image`, `expo-image-picker` |
| Conectividade | `react-native-wifi-reborn`, `@react-native-community/netinfo` |
| Internacionalização | `i18next` + `react-i18next` (pt / en) |
| Persistência local | `@react-native-async-storage/async-storage`, `expo-secure-store` |
| Push Notifications | `expo-notifications` |
| Qualidade | ESLint, Prettier, Husky, lint-staged, Commitizen |
| Testes | Jest (`jest-expo`) |
| Build & Deploy | EAS Build / EAS Update |

## Pré-requisitos e Ambiente

Antes de começar, garanta que seu ambiente atende aos requisitos abaixo:

- **Node.js** `>= 22.11.0` (recomendado o uso de [nvm](https://github.com/nvm-sh/nvm) ou [Volta](https://volta.sh) para gerenciar versões)
- **npm** `>= 10` (gerenciador de pacotes padrão deste projeto — utilizamos o `package-lock.json`)
- **Git**
- **Expo CLI** (não precisa instalar globalmente, usado via `npx`)
- **EAS CLI** para builds em nuvem: `npm install -g eas-cli`
- **Android Studio** (para o emulador Android) e/ou **Xcode** (para o simulador iOS — apenas em macOS)

> ⚠️ Este projeto usa o **Managed Workflow do Expo**, porém depende de módulos nativos não suportados pelo **Expo Go** (ex.: `react-native-webrtc`, `react-native-wifi-reborn`, MQTT nativo). Portanto, é obrigatório o uso de um **Development Build** gerado via `eas build --profile development` ou, localmente, via `npx expo run:android` / `npx expo run:ios`.

## Variáveis de Ambiente e Segurança

O projeto utiliza variáveis de ambiente para credenciais sensíveis (autenticação Clerk, URL da API, broker MQTT, etc.). Um arquivo de exemplo, `.env.example`, é versionado para servir de referência.

### Passos

1. Copie o arquivo de exemplo:

   ```bash
   cp .env.example .env
   ```

2. Preencha os valores reais:

   ```dotenv
   # Chave pública do Clerk (Expo expõe variáveis prefixadas com EXPO_PUBLIC_*)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
   # Chave secreta do Clerk (uso apenas em ambiente seguro)
   CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx

   # [INSERIR AQUI] URL base do back-end (ex.: https://api.janus.dev)
   # EXPO_PUBLIC_API_URL=

   # [INSERIR AQUI] Broker MQTT (ex.: mqtts://broker.janus.dev:8883)
   # EXPO_PUBLIC_MQTT_URL=
   ```

## Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/escbarros/Janus-FrontEnd.git
cd Janus-FrontEnd
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
# edite o .env com seus valores
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npx expo start
```

### 5. Rodar em um dispositivo / emulador

```bash
# Android (emulador ou device USB com depuração ativada)
npm run android

# iOS (simulador — somente macOS)
npm run ios

# Web (somente para testes parciais de UI)
npm run web
```

> 💡 Por usar módulos nativos (WebRTC, Wi-Fi, MQTT), o **Expo Go** não é suportado. Utilize o comando `expo run:*` para gerar um Development Build local ou `eas build --profile development` para gerar na nuvem.

## Estrutura de Pastas

```text
Janus-FrontEnd/
├── app/                      # Rotas (Expo Router — file-based routing)
│   ├── (auth)/               # Stack de autenticação (login, signup, forgotPassword...)
│   ├── (root)/               # Área autenticada do app
│   │   └── (tabs)/           # Navegação por tabs
│   ├── _layout.tsx           # Layout raiz (providers globais)
│   └── index.tsx             # Tela inicial / redirecionamento
├── assets/                   # Imagens, ícones, fontes, Lottie animations
├── components/               # Componentes reutilizáveis de UI (BottomSheets, Buttons, Inputs...)
├── constants/                # Constantes globais (cores, tamanhos, enums)
├── context/                  # React Contexts (MQTT, Notifications)
├── hooks/                    # Custom hooks (useAuthActions, useLoginForm, usePahoMqtt...)
├── i18n/                     # Configuração de internacionalização
│   └── locales/              # Arquivos de tradução (pt.json, en.json)
├── store/                    # Stores Zustand (userStore, deviceStore)
├── types/                    # Tipagens TypeScript compartilhadas
├── utils/                    # Funções utilitárias e camada de API
│   └── api/                  # Clientes HTTP (user, device, event, call, invite, health)
├── android/                  # Projeto nativo Android (gerado pelo Expo prebuild)
├── eas-hooks/                # Hooks customizados de build no EAS
├── app.json                  # Configuração do Expo (ícones, plugins, permissões)
├── eas.json                  # Perfis de build/submit do EAS
├── tailwind.config.js        # Configuração do Tailwind / NativeWind
├── babel.config.js           # Configuração do Babel
├── metro.config.js           # Configuração do bundler Metro
└── tsconfig.json             # Configuração do TypeScript
```

### Propósito das pastas principais

- **`app/`** — Sistema de rotas baseado em arquivos do **Expo Router**. Cada arquivo `.tsx` vira uma rota; pastas entre parênteses são *route groups* que não afetam a URL.
- **`components/`** — Componentes apresentacionais reutilizáveis em todo o app (sheets, cards, inputs).
- **`hooks/`** — Hooks customizados encapsulando lógica de negócio (formulários, autenticação, MQTT, dados de usuário).
- **`context/`** — Providers para estado compartilhado entre telas (conexão MQTT, notificações push).
- **`store/`** — Estado global com **Zustand**, dividido por domínio (usuário, dispositivo).
- **`utils/api/`** — Camada de comunicação HTTP com o back-end, organizada por recurso (user, device, event, call, invite, health).
- **`i18n/`** — Configuração do `i18next` e arquivos de tradução PT/EN.
- **`assets/`** — Mídia estática (imagens, ícones, fontes, Lotties).

## Padrões de Código e Performance

### Qualidade

- **TypeScript estrito** em todo o código-fonte.
- **ESLint** (`eslint-config-expo` + plugins React/React Hooks/TypeScript) para análise estática.
- **Prettier** + `prettier-plugin-tailwindcss` para formatação automática e ordenação de classes Tailwind.
- **Husky** + **lint-staged** rodando `eslint --fix` e `prettier --write` antes de cada commit.
- **Commitizen** com `cz-conventional-changelog` para padronização de mensagens de commit (Conventional Commits).

### Performance e UX

- **React Native New Architecture** habilitada (`newArchEnabled: true` em `app.json`) — Fabric + TurboModules.
- **`react-native-reanimated`** para animações executadas na UI thread.
- **`@gorhom/bottom-sheet`** + **`@gorhom/portal`** para bottom sheets performáticos.
- **`expo-image`** para carregamento de imagens com cache nativo (substitui o `Image` padrão).
- **WebRTC** via `react-native-webrtc` para chamadas de vídeo em tempo real com baixa latência.
- **MQTT** para sinalização leve entre app, back-end e dispositivo embarcado.

## Build, Deploy e OTA Updates

Utilizamos o **EAS (Expo Application Services)** para builds em nuvem e atualizações Over-The-Air.

### Configurar o EAS

```bash
npm install -g eas-cli
eas login
eas init   # apenas na primeira vez
```

### Perfis disponíveis (`eas.json`)

| Perfil | Descrição |
| --- | --- |
| `development` | Development Build com Dev Client, distribuição interna, APK debug |
| `preview` | Build de homologação, distribuição interna, APK release |
| `production` | Build de produção, auto-incremento de versão, APK release |

### Comandos comuns

```bash
# Build de desenvolvimento (Android)
eas build --profile development --platform android

# Build de homologação para testers
eas build --profile preview --platform android

# Build de produção
eas build --profile production --platform all

# Submissão para as lojas
eas submit --profile production --platform android

# Publicar atualização OTA (não nativa)
eas update --branch production --message "fix: ajuste no fluxo de pareamento"
```

> 📦 Apenas mudanças em JavaScript/assets podem ser enviadas via `eas update`. Alterações em código nativo ou em plugins do Expo exigem um novo build.

## Scripts Úteis

Definidos no `package.json`:

| Script | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor do Expo (`expo start`) |
| `npm run android` | Compila e abre o app no emulador/dispositivo Android (`expo run:android`) |
| `npm run ios` | Compila e abre o app no simulador iOS (`expo run:ios`) |
| `npm run web` | Inicia a versão web do app |
| `npm run lint` | Executa o ESLint com `--fix` em todos os arquivos JS/TS/TSX |
| `npm run format` | Formata o código com Prettier |
| `npm test` | Executa os testes com Jest em modo watch |
| `npm run reset-project` | Reseta o projeto para o estado inicial (utilitário) |
| `npm run prepare` | Instala os hooks do Husky (executado automaticamente após `npm install`) |

Comandos úteis adicionais:

```bash
# Limpar cache do Metro
npx expo start --clear

# Verificar saúde do projeto e compatibilidade de dependências
npx expo-doctor

# Atualizar SDK do Expo
npx expo install --fix
```
