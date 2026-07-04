# Codex 작업 지침

이 저장소의 목표는 Zed에서 Laravel 개발 경험을 PHPStorm + Laravel Idea 수준에 가깝게 끌어올리는 것입니다.

## 기본 원칙

- 답변은 한국어 존댓말로 짧고 명확하게 작성합니다.
- 수정 전에는 관련 파일, git 상태, 기존 패턴을 먼저 확인합니다.
- 사용자 변경사항은 되돌리지 않습니다.
- 변경은 작고 명확하게 유지하고, 불필요한 리팩터링은 피합니다.
- 최신 Zed extension API, LSP, Laravel 동작은 추측하지 말고 공식 문서나 실제 코드로 확인합니다.

## 기술 방향

- Zed extension은 Rust/WASM으로 작성합니다.
- Laravel 특화 분석은 별도 Language Server에서 구현합니다.
- Zed extension은 language server 실행, 설정 전달, 배포 경로 관리에 집중합니다.
- Language Server는 Laravel 프로젝트 인덱싱, completion, hover, diagnostics, code action을 단계적으로 담당합니다.
- PHP 자체의 일반 분석은 기존 PHP LSP와 공존하는 방향을 우선합니다.

## 검증

- TypeScript 서버 변경 후 가능한 경우 `npm run typecheck`, `npm test`, `npm run build`를 실행합니다.
- Rust extension 변경 후 로컬에 Rust toolchain이 있으면 `cargo check`를 실행합니다.
- 외부 배포, GitHub push, release, npm publish는 사용자가 요청한 범위 안에서만 진행합니다.

