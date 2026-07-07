# Laravel Idea Parity Plan

Laravel Idea(PhpStorm 플러그인)가 생성해 둔 도우미 파일을 분석해서, zed-laravel-assist가 같은 개발 편의를 LSP 방식으로 자체 제공하기 위한 계획 문서입니다.

이 문서는 세션이 바뀌거나 다른 LLM이 이어받아도 작업을 계속할 수 있도록 유지됩니다. **작업자는 단계가 끝날 때마다 하단의 Progress Log와 Todo 상태를 반드시 갱신해야 합니다.**

## 1. 배경과 목표

- 참조 프로젝트(`/Users/eyedroot/Github/Catenoid/kollus-www-v2`)의 `vendor/_laravel_idea/*`에는 PhpStorm + Laravel Idea가 생성한 도우미 파일이 남아 있고, 이 docblock 덕분에 Zed에서도 intelephense를 통해 일부 자동완성·이동이 동작한다.
- 목표: **도우미 파일 없이도** zed-laravel-assist 언어 서버가 동일한 인텔리전스를 제공하는 것. Laravel Idea가 "docblock 생성"으로 풀었던 문제를 우리는 "LSP 응답(completion/hover/definition/diagnostics)"으로 직접 푼다.
- 원칙: 사용자 프로젝트에 파일을 생성하지 않는다. 모든 지식은 언어 서버의 색인(`server/src/projectIndex.ts`)에서 나온다.

## 2. 분석 자료 위치

- 스냅샷: `analysis/laravel-idea-snapshot/` (12개 PHP 파일, 원본은 kollus-www-v2의 `vendor/_laravel_idea/`)
- `analysis/`는 사용자 비공개 프로젝트의 스키마·모델명이 담겨 있으므로 `.gitignore`로 제외되어 있다. **커밋 금지.**
- 스냅샷이 없으면 다시 복사한다:
  `cp /Users/eyedroot/Github/Catenoid/kollus-www-v2/vendor/_laravel_idea/*.php analysis/laravel-idea-snapshot/`

## 3. 도우미 파일 분석 요약

| 파일 | 크기 | 내용 | 제공하는 편의 |
|------|------|------|----------------|
| `_ide_helper_models_App_Kollus_Models.php` | 64KB | 모델 50개의 `@property`(DB 컬럼, 타입 포함, 164개), `@property-read`(관계·`*_count`, 112개), `@method`(관계 메소드, `query()/with()/find()` 정적 진입점, 567개), `@mixin _IH_X_QB` | `$model->컬럼` 완성, 관계 속성 완성, `Model::` 정적 호출 완성 |
| `_ide_helper_model_builders_LaravelIdea_Helper_App_Kollus_Models.php` | 199KB | 모델별 `_IH_X_QB`(쿼리 빌더)와 `_IH_X_C`(컬렉션) 스텁 100개. `find/first/get/paginate/create` 등 41개 메소드가 **해당 모델 타입을 반환**하도록 docblock 선언 | 빌더 체인에서 반환 타입 유지 → 체인 완성과 hover 타입 표시 |
| `_ide_helper_model_builders_LaravelIdea_Helper.php` | 13KB | `_BaseBuilder`/`_BaseCollection` 공통 스텁 (172 `@method`) | 위와 동일한 기반 |
| `_ide_helper_dispatches.php` | 10KB | 이벤트·잡 35개 클래스에 `@method static dispatch(...)/broadcast(...)` — **실제 생성자 시그니처 그대로** | `Event::dispatch(인자힌트)`, `Job::dispatch()` 완성 |
| `_ide_helper_facades.php` | 2.9KB | 루트 네임스페이스 별칭 38개 (`class_alias(\Illuminate\...\App::class, \App::class)`) | `\Auth::`, `\DB::` 같은 루트 별칭 해석 |
| `_ide_helper_macro.php` | 1.3KB | 프레임워크 클래스에 등록된 매크로를 `@method`로 노출 (`Eloquent\Builder::disabled/enabled/withTrashed...`, `Query\Builder::ray`, `Http\Request::hasValid...`) | 빌더 체인·Request에서 매크로 완성 |
| 나머지 (Notifications/Mongodb 등) | 소량 | 패키지 모델에 대해 동일 패턴 반복 | 동일 |

핵심 통찰: Laravel Idea 인텔리전스의 대부분은 (1) **모델 속성/관계의 타입 지식**, (2) **빌더 체인의 반환 타입 유지**, (3) **정적 진입점(dispatch, 파사드, query)의 시그니처 노출** 세 가지로 요약된다.

## 4. 현재 zed-laravel-assist 능력과의 격차

이미 색인·지원 중: route/view/config/env/translation, 미들웨어 별칭·그룹(정의 위치 포함), 컨트롤러(모듈 포함)·액션, `Controller@action` 문자열 이동, 모델(스코프·관계 이름·custom builder·테이블명), 스키마 테이블/컬럼, factory state, seeder, macro(색인만), facade(색인만), container binding, authorization, artisan command, validation rule, Blade 컴포넌트/섹션/스택.

격차(도우미 파일이 제공하지만 우리는 미지원):

| # | 격차 | 도우미 파일의 해법 | LSP 방식 해법 |
|---|------|--------------------|----------------|
| G1 | `$model->컬럼` 속성 완성/hover 없음 | `@property` docblock | 스키마 색인(schemaTables)과 모델의 tableName을 이미 보유 → 모델 변수 문맥에서 컬럼 완성 제공 |
| G2 | 관계 속성(`$model->users`)·`*_count` 완성 없음 | `@property-read` | 모델 관계 색인 보유 → 속성 완성에 관계 이름 + `<관계>_count` 추가 |
| G3 | accessor 가상 속성 없음 | `@property-read` | 모델 파싱에 `getXxxAttribute`/`casts` 추출 추가 |
| G4 | `where('컬럼')` 첫 인자 컬럼 완성 없음 | 타입 체인(간접) | 문맥상 모델을 알 수 있는 체인(`Model::where`, `Model::query()->where`)에서 스키마 컬럼 완성 |
| G5 | 빌더 체인 메소드 완성 없음(`Model::query()->` 뒤) | `_IH_X_QB` 스텁 | 고정 빌더 메소드 목록 + 모델 스코프 + custom builder + 매크로(`_ide_helper_macro` 대응)를 합쳐 완성 제공 |
| G6 | `Event::dispatch()`/`Job::dispatch()` 시그니처·이동 없음 | dispatches 도우미 | artifacts 색인(Events/Jobs)에 생성자 시그니처 추출 추가 → completion/hover/definition |
| G7 | 루트 별칭 파사드(`\Auth::`) 미해석 | facades 도우미 | 프레임워크 기본 별칭표 + `config/app.php` aliases 색인 → facade 이동/hover에 연결 |
| G8 | SoftDeletes 모델의 `withTrashed` 등 미인지 | macro 도우미 | 모델 파싱에 `use SoftDeletes` 감지 → 빌더 완성에 조건부 추가 |

참고: "빌더 반환 타입 추적"(진짜 타입 추론)은 intelephense 영역과 겹치고 구현 비용이 크므로, 문맥 정규식 기반(라인 안에서 모델명이 보이는 체인)으로 한정한다. 이 프로젝트의 기존 구현 방식(라인 단위 접두 문맥 분석)과 일치하는 접근이다.

## 5. Todo 리스트 (우선순위순)

상태 표기: `[ ]` 미착수 / `[~]` 진행 중 / `[x]` 완료 / `[-]` 보류(사유 기록)

### P1 — 모델 속성 인텔리전스 (G1, G2, G3)
- [x] T1. `projectIndex.ts` 모델 추출에 accessor(`getXxxAttribute`, `xxx(): Attribute`)와 SoftDeletes 감지 추가 — `ModelInfo.accessors?`, `ModelInfo.usesSoftDeletes?` (선택 필드로 추가해 픽스처 영향 최소화). casts는 기존 필드가 이미 있어 그대로 사용. 캐시 버전 26→27. T7의 SoftDeletes 감지도 이 단계에서 함께 완료.
- [x] T2. `completions.ts`: `$var->`/`$this->`(모델 파일 내부) 문맥에서 스키마 컬럼 + 관계 + `<관계>_count` + accessor 완성. 변수의 모델 추정: `$var = Model::...`/`new Model(` 대입 또는 `Model $var` 타입힌트 (`modelPropertyContext`, `modelClassForVariable`)
- [x] T3. `hovers.ts`: `$model->속성` hover — 컬럼(타입·테이블·마이그레이션), 관계(종류·대상 모델), `*_count`, accessor 각각 전용 표기 (`modelPropertyContextAtPosition`)
- [x] T4. 테스트: completions 2건, hovers 2건 추가. 전체 통과

### P2 — 쿼리 빌더 문맥 (G4, G5, G8)
- [x] T5. `completions.ts`: `Model::where(`, `Model::query()->...->where(` 첫 인자에서 해당 모델 테이블의 컬럼 완성 (orderBy/value/pluck/whereIn 등 컬럼 인자 메소드 포함)
- [x] T6. `completions.ts`: `Model::query()->` 체인에서 빌더 표준 메소드 + 모델 스코프 + custom builder 메소드 + 색인된 매크로(대상 클래스가 Eloquent/Query Builder인 것) 완성
- [x] T7. `projectIndex.ts`: 모델의 `use SoftDeletes` 감지(완료, T1에서) → T6 완성 목록에 `withTrashed/onlyTrashed/restore/withoutTrashed` 조건부 포함
- [x] T8. 테스트 추가

### P3 — 정적 진입점 (G6, G7)
- [x] T9. `projectIndex.ts`: artifact(Event/Job/Mail/Notification) 추출에 생성자 매개변수 시그니처 저장. 캐시 버전 27→28.
- [x] T10. `completions.ts`/`hovers.ts`: `SomeEvent::dispatch(`에서 생성자 시그니처 힌트, definition은 클래스 파일(기존 artifact 이동 재사용)
- [x] T11. 파사드 루트 별칭: 프레임워크 기본 별칭표(App, Arr, Artisan, Auth, Blade, Cache, Config, DB, Event, Gate, Hash, Http, Lang, Log, Mail, Queue, Route, Schema, Session, Storage, URL, Validator, View 등) 내장 + `config/app.php`의 `aliases` 색인 → `\Auth::` hover/이동
- [x] T12. 테스트 추가

### P4 — 마무리
- [x] T13. README 기능표 갱신, `docs/ROADMAP.md`와 정합성 맞추기
- [-] T14. kollus-www-v2 대상 실기기 검증(LSP 스크립트 + Zed 재시작, 아래 6절 절차) — LSP 스크립트 검증 완료. Zed 강제 종료/재시작은 사용자 편집 세션 보호를 위해 실행하지 않음.
- [x] T15. 이 문서 최종 갱신 및 스냅샷 정리 여부 결정 — `analysis/laravel-idea-snapshot/`은 `.gitignore` 대상이며 이번 변경에서 건드리지 않음.

## 6. 작업 절차 (각 Todo 공통)

1. `server/`에서 구현 + `npm run typecheck && npm test`
2. `npm run build` → 루트에서 `cargo build --release --target wasm32-wasip2` → `cp target/wasm32-wasip2/release/laravel_assist_zed_extension.wasm extension.wasm`
   - 서버 번들은 wasm에 내장되므로 wasm 재빌드 없이는 반영되지 않는다.
   - 색인 스키마가 바뀌면 `projectIndex.ts`의 `LARAVEL_INDEX_CACHE_VERSION`을 반드시 올린다 (현재 34).
3. 통신 규약 수준 검증: `/private/tmp/claude-501/.../scratchpad/lsp-def.cjs`(정의)와 `lsp-e2e.cjs`(진단) 스크립트 패턴 참고 — 서버를 `node server/dist/index.cjs --stdio`로 띄우고 kollus-www-v2를 rootUri로 initialize 후 요청.
4. Zed 반영: zed 프로세스를 완전히 종료(`osascript -e 'tell application "Zed" to quit'`, 프로세스명은 소문자 `zed`) 후 재실행해야 새 wasm이 로드된다.
5. **이 문서의 Todo 상태와 Progress Log 갱신.**

## 7. Progress Log

작업 단위가 끝날 때마다 아래에 항목을 추가한다. 형식: 날짜 | 작업자 | 내용 | 다음 단계.

- 2026-07-06 | Claude (Fable 5) | 계획 수립 단계 완료: `vendor/_laravel_idea/*` 12개 파일을 `analysis/laravel-idea-snapshot/`으로 복사(.gitignore 처리), 구조 분석(3절), 격차 정리(4절), Todo 작성(5절). 코드 변경 없음. | 다음: P1의 T1부터 착수.
- 2026-07-06 | Claude (Fable 5) | T1 완료: `extractModelAccessors`(클래식 `getXxxAttribute` + Laravel 9+ `xxx(): Attribute` 둘 다, snake_case 변환), `modelUsesSoftDeletes` 추가. `ModelInfo`에 선택 필드 `accessors`/`usesSoftDeletes`. 캐시 버전 27. projectIndex 테스트 29개 통과(신규 1개 포함). | 다음: T2 모델 속성 완성.
- 2026-07-06 | Claude (Fable 5) | P1 완료(T2~T4): 모델 속성 완성과 hover 구현. 전체 테스트 162개 통과. 아직 빌드/배포 안 함(P2까지 마친 뒤 일괄 빌드 예정). | 다음: T5 where() 컬럼 완성.
- 2026-07-06 | Codex | P2 완료(T5~T8): Eloquent 컬럼 인자 완성, `Model::query()->` 빌더 표준 메소드/스코프/custom builder/macro/SoftDeletes 완성 추가. 기존 scope/custom builder completion detail 회귀를 수정. `npm run typecheck && npm test` 통과(166개). | 다음: P3 정적 진입점.
- 2026-07-06 | Codex | P3 완료(T9~T12): artifact 생성자 시그니처 색인(`constructorSignature`), dispatch 문맥 event/job 정의·hover·completion detail, 프레임워크 기본 루트 alias와 `config/app.php` aliases 파사드 색인 추가. 캐시 버전 28. `npm run typecheck && npm test` 통과(166개). | 다음: P4 문서/빌드/실기기 검증.
- 2026-07-06 | Codex | P4 완료: README/ROADMAP 갱신, `npm run build`, `cargo build --release --target wasm32-wasip2`, `extension.wasm` 복사 완료. kollus-www-v2 rootUri로 `server/dist/index.cjs --stdio` LSP initialize/hover 실검증 완료(최종 재검증 `Reused 1304/1304`, `\Auth::check()` hover가 config alias `Illuminate\Support\Facades\Auth`로 표시됨). Zed 강제 재시작은 사용자 세션 보호를 위해 보류. | 다음: 필요 시 사용자가 Zed를 재시작해 새 wasm 로드.
- 2026-07-07 | Claude (Fable 5) | 후속 흡수 라운드(7.1절) 완료: 검증 규칙 이름 완성, DB::table 테이블/컬럼 인텔리전스, Storage 디스크 완성, Inertia 페이지 색인·완성·이동·진단·quick fix. 캐시 버전 33→34. ROADMAP에 Phase 6(기구현 미문서 기능)·Phase 7(흡수 항목) 추가. 전체 테스트 195개 통과 + 임시 프로젝트 대상 Inertia 색인 통합 검증. | 다음: Livewire 픽스처 확보 후 Livewire 컴포넌트 인텔리전스 검토.

## 7.1 후속 흡수 라운드 (Laravel Idea 재점검, 2026-07-07)

P1~P4 완료 후 Laravel Idea 기능을 재점검해 도우미 파일 분석 범위 밖의 격차 4개를 추가 흡수했다. 세부 항목은 `docs/ROADMAP.md` Phase 7 참조.

- 검증 규칙 문자열(`'required|string'`, 배열 요소) 안에서 내장 규칙 이름 완성 + `exists:`/`unique:` 뒤 테이블·컬럼 완성 (`rules()`/`validate()`/`Validator::make`/`sometimes` 컨테이너 감지)
- `DB::table('...')` 테이블·체인 컬럼 완성/hover/정의 이동 (`DB::connection(...)->table(...)` 포함)
- `Storage::disk|drive|fake('...')` 디스크 이름 완성 (`filesystems.disks.*` config 색인 재사용)
- Inertia 페이지 색인(`resources/js/[Pp]ages/**`, 캐시 버전 34) + `Inertia::render`/`inertia()`/`Route::inertia` 완성·정의 이동·누락 진단·오타 quick fix
- 보류: Livewire 컴포넌트 인텔리전스(픽스처 프로젝트 필요), 코드 생성 명령(파일 스캐폴딩은 범위 밖)

## 8. 이 세션 이전에 완료된 관련 작업 (문맥)

같은 세션에서 이미 반영되어 커밋 대기 중인 변경 사항 — 이 계획과 무관하게 동작 중:

1. 확장 구조 개편: 서버를 esbuild 단일 번들(`server/dist/index.cjs`)로 만들어 wasm에 내장, 실행 시 Zed 작업 디렉터리에 풀어 실행 (WASI 격리 문제 해결)
2. config 파서의 PHP 주석 처리 수정 (Blade의 config 키 오탐 37건 해소)
3. `Controller@action` 문자열 이동(클래스/메소드 각각), modules 컨트롤러 색인, 미들웨어 별칭 정확한 줄 이동 + 매개변수 별칭(`auth:api`) + 배열 다중 요소 + 미들웨어 그룹 지원
