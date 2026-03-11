# Argus Frontend


## Build & Run


### Install `pnpm`

Node 16 버전 이상인 경우 다음의 커맨드를 실행합니다.

```bash
corepack enable
```

### Install Package

```bash
pnpm install
```

### Run

```bash
pnpm run dev --host 10.0.1.50
```

## Adding components

To add components to your app, run the following command at the root of your `web` app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Using components

To use the components in your app, import them from the `ui` package.

```tsx
import { Button } from "@workspace/ui/components/button";
```
