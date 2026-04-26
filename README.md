# minorlab_links

MinorLab 멀티앱 외부 도메인 fallback / 공유 / 유틸 페이지를 1 프로젝트에서 도메인·path 분기로 통합합니다.

## 기술 스택

- SvelteKit 2 + Svelte 5
- `@sveltejs/adapter-cloudflare`
- 배포: Cloudflare Pages (회사 표준 — `minorlab_profile`, `minorlab_mealplan` 답습)

## 도메인 구성

| 도메인 | 용도 | 추가된 시점 |
| --- | --- | --- |
| `rooty.minorlab.com` | rooty 그룹 v1 딥링크 (Universal Link / App Link) + `/g/{code}` 302 redirect | 2026-04-26 ([rooty #1201](https://github.com/minor-laboratory/rooty/issues/1201)) |

## `rooty.minorlab.com` 산출물

- `static/.well-known/apple-app-site-association` — iOS Universal Link AASA (`com.minorlab.rooty`, paths `/g/*`)
- `static/.well-known/assetlinks.json` — Android App Link Digital Asset Links (App Signing SHA-256)
- `src/routes/g/[code]/+server.ts` — 앱 미설치 fallback 302 (User-Agent 분기로 App Store / Play Store)
- `static/_headers` — AASA / assetlinks Content-Type `application/json` 강제

상위 설계: [rooty/docs/features/group/DESIGN_DEEPLINK.md](https://github.com/minor-laboratory/rooty/blob/main/docs/features/group/DESIGN_DEEPLINK.md)

## 개발

```bash
pnpm install
pnpm run dev      # http://localhost:5173
pnpm run build    # 빌드 산출물 .svelte-kit/cloudflare
pnpm run deploy   # wrangler pages deploy 직접 호출 (수동 배포)
```

## 배포

`main` 브랜치 push 시 Cloudflare Pages 자동 배포 (GitHub 연동). PR 은 preview deployment 자동 생성.
