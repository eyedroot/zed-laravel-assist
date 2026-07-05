# Local Zed Install Guide

이 문서는 Laravel Assist를 로컬 Zed 개발 확장으로 설치해 Laravel 프로젝트에서 직접 테스트하는 절차를 정리합니다.

## 1. 준비 사항

- Zed가 설치되어 있어야 합니다.
- Rust는 `rustup`으로 설치되어 있어야 합니다. Zed 개발 확장은 Rust/WASM 빌드를 사용합니다.
- Node.js와 npm이 필요합니다.
- 테스트할 Laravel 프로젝트가 로컬에 있어야 합니다.

## 2. Language Server 빌드

이 저장소에서 TypeScript Language Server를 먼저 설치하고 빌드합니다.

```sh
cd /Users/eyedroot/Github/zed-laravel-assist/server
npm install
npm run build
```

정상 빌드되면 Zed 확장이 다음 서버 엔트리를 실행합니다.

```text
/Users/eyedroot/Github/zed-laravel-assist/server/dist/index.js --stdio
```

## 3. Zed에 개발 확장 설치

1. Zed를 엽니다.
2. Command Palette를 엽니다.
   - macOS: `Cmd+Shift+P`
3. `zed: install dev extension`을 실행합니다.
4. 폴더 선택 창에서 이 저장소 루트를 선택합니다.

```text
/Users/eyedroot/Github/zed-laravel-assist
```

설치가 성공하면 Zed Extensions 화면에서 Laravel Assist가 개발 확장으로 표시됩니다.

## 4. Zed 설정 추가

Zed Settings를 열고 PHP 언어에 `laravel-assist` language server를 추가합니다.

```json
{
  "languages": {
    "PHP": {
      "language_servers": ["laravel-assist", "..."]
    }
  }
}
```

기존 PHP language server가 있다면 `"..."`를 남겨 기존 서버와 함께 사용합니다. Laravel Assist는 일반 PHP 분석을 대체하지 않고 Laravel 전용 completions, navigation, hover, diagnostics, code actions를 보완합니다.

Blade 파일 테스트는 현재 설치된 Blade 확장이 Zed에서 노출하는 언어 이름에 따라 동작 범위가 달라질 수 있습니다.

## 5. Laravel 프로젝트 열기

Zed에서 테스트할 Laravel 프로젝트 폴더를 엽니다.

Laravel Assist는 다음 신호 중 하나가 있을 때 Laravel 프로젝트로 인식합니다.

- 프로젝트 루트의 `artisan`
- `composer.json`의 `laravel/framework`, `illuminate/support`, 또는 `orchestra/testbench` 의존성

Laravel 프로젝트로 인식되지 않으면 Laravel 전용 기능은 비활성 상태로 유지됩니다.

## 6. 테스트 체크리스트

PHP 파일에서 다음 위치에 커서를 두고 completion, hover, go-to-definition을 확인합니다.

```php
route('...')
to_route('...')
redirect()->route('...')
view('...')
config('...')
env('...')
Rule::exists('...', '...')
Rule::unique('...', '...')
User::query()->...
User::with('...')
$request->validated('...')
$request->input('...')
```

특히 이번 작업 범위는 다음 기능을 확인하면 좋습니다.

- Eloquent custom builder method completion/hover/definition
- `Rule::exists(...)`, `Rule::unique(...)`의 schema table/column completion
- 잘못된 route/view/config/env/schema 이름에 대한 diagnostics와 quick fix
- service provider, facade, macro, factory state, seeder class navigation
- workspace symbols에서 Laravel route, model, schema, provider, factory, seeder 항목 검색

## 7. 변경 후 다시 테스트할 때

Language Server 코드를 수정한 뒤에는 다시 빌드합니다.

```sh
cd /Users/eyedroot/Github/zed-laravel-assist/server
npm run build
```

Zed에서 확장이 이전 빌드 결과를 계속 사용하는 것처럼 보이면 다음 순서로 재시도합니다.

1. Zed Command Palette에서 `zed: reload extensions` 실행
2. Laravel 프로젝트 창 다시 열기
3. 필요하면 Zed 재시작

## 8. 문제 확인

Zed에서 로그를 엽니다.

```text
zed: open log
```

확장이 실행되지 않거나 language server가 시작되지 않으면 다음을 확인합니다.

- `/Users/eyedroot/Github/zed-laravel-assist/server/dist/index.js`가 존재하는지
- `cd /Users/eyedroot/Github/zed-laravel-assist/server && npm run build`가 성공하는지
- Zed Settings의 PHP `language_servers`에 `laravel-assist`가 들어 있는지
- 테스트 프로젝트가 Laravel 프로젝트로 감지될 수 있는 구조인지

터미널에서 Zed를 foreground로 실행하면 더 자세한 로그를 볼 수 있습니다.

```sh
zed --foreground
```
