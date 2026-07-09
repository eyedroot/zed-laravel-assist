// Laravel service-container resolution entry points, defined once so completion,
// type hints, definition, hover, and references all share the exact same set of
// call sites. Adding a new entry point here updates every feature at once.
//
// Verified against laravel/framework source across v5.0 - v13 tags. The entry
// points that resolve an ARBITRARY user-named class/binding and return it are:
//
//   Global helpers (first arg is the abstract):
//     app($abstract)      resolve($abstract)
//     `app()` with no argument returns the Application itself, not a resolved
//     class, so bare `app()` is deliberately not a class-resolution site.
//
//   Container / Application / `App` facade methods (called on a container
//   receiver — see CONTAINER_RECEIVER_SOURCE):
//     make      (v5.1+)   -> instance
//     makeWith  (v5.4.36+) -> instance   (concrete Container only, not the contract)
//     build     (v5.1+)   -> instance    (instantiates a concrete class directly)
//     get       (v5.5+)   -> instance    (PSR-11; guarded by the receiver because
//                                         `->get(...)` is common on unrelated objects)
//     factory   (v5.4+)   -> Closure     (first arg is a class, but the return is a
//                                         deferred resolver, not the instance)
//     bound / has         -> bool        (first arg is a binding name, no instance)
//
// Deliberately excluded: the protected `resolve()` container method (not callable
// externally; distinct from the global `resolve()` helper), `call`/`wrap`/`tagged`
// (first arg is a callable/Closure/tag, not a class), and `bind*`/`singleton*`/
// `scoped*`/`instance`/`alias`/`extend` (registration; return void/self).

import { LaravelIndex, PhpClassInfo } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

// Methods whose first argument resolves to an instance the caller can then chain
// off of. Drives member completion, member type inference, and member go-to.
export const CONTAINER_INSTANCE_METHOD_NAMES = "make|makeWith|build|get";

// Methods whose first argument is a class/interface name. Drives class-name
// completion. Adds `factory` (returns a resolver closure but still names a class).
export const CONTAINER_CLASS_ARGUMENT_METHOD_NAMES = "make|makeWith|build|get|factory";

// Methods whose first argument is a container binding name (string). Drives
// binding string completion, definition, hover, and references. `build` is
// omitted because it takes a concrete class, not a registered binding name.
export const CONTAINER_BINDING_METHOD_NAMES = "make|makeWith|get|factory|bound|has";

// Expression that resolves to the container instance, ending just before the
// `->`/`?->`/`::` used to call a resolution method: the `App` facade, the `app()`
// helper, a service provider's `$this->app`, or `Container::getInstance()`.
export const CONTAINER_RECEIVER_SOURCE =
  "(?:App::|app\\(\\)\\s*(?:\\?->|->)|\\$this\\s*(?:\\?->|->)\\s*app\\s*(?:\\?->|->)|Container::getInstance\\(\\)\\s*(?:\\?->|->))";

// Entry-point prefix (up to but excluding the opening `(`) for calls that return
// a resolved INSTANCE: the global helpers, or an instance method on a container
// receiver. Callers append their own argument pattern.
export const CONTAINER_INSTANCE_ENTRY_SOURCE =
  `(?:\\b(?:app|resolve)|${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_INSTANCE_METHOD_NAMES}))`;

// A full instance-resolution call including its (single-line) argument list, e.g.
// `app(Foo::class)`, `App::make('bar')`, `$this->app->make($x)`. Used as the
// receiver of a member access and as the right-hand side of an assignment.
export const CONTAINER_INSTANCE_CALL_SOURCE =
  `${CONTAINER_INSTANCE_ENTRY_SOURCE}\\s*\\([^;\\n]*\\)`;

const IDENTIFIER_TAIL = "(?:\\\\?[A-Za-z_\\\\][A-Za-z0-9_\\\\]*)?";

// True when the cursor sits inside the string argument of a binding-name call,
// e.g. `app('<cursor>` or `$this->app->make('<cursor>`. Drives binding completion.
export function isContainerBindingStringPrefix(linePrefix: string): boolean {
  return /\b(?:app|resolve)\(\s*['"][^'"]*$/.test(linePrefix) ||
    new RegExp(`${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_BINDING_METHOD_NAMES})\\(\\s*['"][^'"]*$`).test(linePrefix);
}

// True when the cursor sits at the class-name argument of a resolution call,
// e.g. `app(<cursor>` or `App::make(Foo<cursor>`. Drives class-name completion.
export function isContainerClassArgumentPrefix(linePrefix: string): boolean {
  return new RegExp(`\\b(?:app|resolve)\\(\\s*${IDENTIFIER_TAIL}$`).test(linePrefix) ||
    new RegExp(`${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_CLASS_ARGUMENT_METHOD_NAMES})\\(\\s*${IDENTIFIER_TAIL}$`).test(linePrefix);
}

// True when a definition/hover string prefix ends right where a binding-name
// string opens, e.g. prefix `app(` or `$this->app->make(`. The quote itself has
// already been stripped by the caller.
export function isContainerBindingStringOpeningPrefix(prefix: string): boolean {
  return /\b(?:app|resolve)\s*\(\s*$/.test(prefix) ||
    new RegExp(`${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_BINDING_METHOD_NAMES})\\s*\\(\\s*$`).test(prefix);
}

// Global regexes matching a binding-name call with its quoted argument, for
// reference scanning. In every regex the captured binding value is group 2.
export function containerBindingReferenceRegExps(): RegExp[] {
  return [
    /\b(?:app|resolve)\s*\(\s*(['"])([^'"]+)\1/g,
    new RegExp(`${CONTAINER_RECEIVER_SOURCE}(?:${CONTAINER_BINDING_METHOD_NAMES})\\s*\\(\\s*(['"])([^'"]+)\\1`, "g"),
  ];
}

// Given a document prefix and the current line prefix, resolves the FQCN of the
// instance a container resolution call produces, so its members can be completed
// or navigated. Handles both direct calls (`App::make(Foo::class)->`) and a
// variable that was assigned such a call or annotated with `@var`
// (`$service->` after `/** @var Foo $service */` or `$service = app(Foo::class)`).
export function containerResolvedMemberClass(
  documentPrefix: string,
  linePrefix: string,
  index: LaravelIndex,
): string | null {
  const receiverExpression = `(?:\\$[A-Za-z_][A-Za-z0-9_]*|${CONTAINER_INSTANCE_CALL_SOURCE})`;
  const receiver = new RegExp(`(${receiverExpression})\\s*(?:\\?->|->)\\s*[A-Za-z_][A-Za-z0-9_]*$`).exec(linePrefix)?.[1] ??
    new RegExp(`(${receiverExpression})\\s*(?:\\?->|->)\\s*$`).exec(linePrefix)?.[1];
  if (!receiver) {
    return null;
  }

  if (receiver.startsWith("$")) {
    return docblockPhpClassForVariable(documentPrefix, receiver) ??
      containerResolvedAssignmentClass(documentPrefix, receiver, index);
  }

  return classReferenceFromContainerExpression(documentPrefix, receiver, index);
}

function docblockPhpClassForVariable(documentPrefix: string, variable: string): string | null {
  const annotation = new RegExp(`@var\\s+([^\\s]+)\\s+${escapeRegex(variable)}\\b`).exec(documentPrefix);
  if (!annotation) {
    return null;
  }

  const classReference = annotation[1]
    .split("|")
    .find((part) => /^\\?[A-Za-z_][A-Za-z0-9_\\]*$/.test(part));
  return classReference ? resolvePhpClassReference(documentPrefix, classReference) : null;
}

function containerResolvedAssignmentClass(
  documentPrefix: string,
  variable: string,
  index: LaravelIndex,
): string | null {
  const assignmentPattern = new RegExp(
    `${escapeRegex(variable)}\\s*=\\s*(${CONTAINER_INSTANCE_CALL_SOURCE})`,
    "g",
  );
  let classReference: string | null = null;

  for (const match of documentPrefix.matchAll(assignmentPattern)) {
    classReference = classReferenceFromContainerExpression(documentPrefix, match[1], index);
  }

  return classReference;
}

function classReferenceFromContainerExpression(
  documentPrefix: string,
  expression: string,
  index: LaravelIndex,
): string | null {
  const classMatch = new RegExp(`${CONTAINER_INSTANCE_ENTRY_SOURCE}\\s*\\(\\s*(\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)::class\\b`).exec(expression);
  if (classMatch) {
    return resolvePhpClassReference(documentPrefix, classMatch[1]);
  }

  const stringMatch = new RegExp(`${CONTAINER_INSTANCE_ENTRY_SOURCE}\\s*\\(\\s*['"]([^'"]+)['"]`).exec(expression);
  if (!stringMatch) {
    return null;
  }

  const binding = index.containerBindings.find((candidate) => candidate.abstract === stringMatch[1]);
  return binding?.concrete ?? (isClassLikeReference(stringMatch[1]) ? stringMatch[1] : null);
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isClassLikeReference(value: string): boolean {
  return /^\\?[A-Z_\\][A-Za-z0-9_\\]*$/.test(value);
}

// Resolves a class reference to the indexed PHP types that could back it: the
// type itself, plus the concrete registered for it as a container binding. Used
// to complete or navigate members of a container-resolved instance, where the
// declared abstract (e.g. an interface) carries the members but the bound
// concrete may add more.
export function containerResolvedPhpClasses(
  classReference: string,
  index: LaravelIndex,
): PhpClassInfo[] {
  const classes: PhpClassInfo[] = [];
  const addClass = (reference: string | null | undefined): void => {
    if (!reference) {
      return;
    }

    const phpClass = phpClassForReference(reference, index);
    if (phpClass && !classes.some((candidate) => candidate.fqcn === phpClass.fqcn)) {
      classes.push(phpClass);
    }
  };

  addClass(classReference);

  const binding = index.containerBindings.find((candidate) =>
    classReferenceMatches(candidate.abstract, classReference)
  );
  addClass(binding?.concrete);

  return classes;
}

function phpClassForReference(
  classReference: string,
  index: LaravelIndex,
): PhpClassInfo | null {
  return index.phpClasses.find((phpClass) => classReferenceMatches(phpClass.fqcn, classReference)) ?? null;
}

function classReferenceMatches(indexedReference: string, value: string): boolean {
  const indexed = normalizeClassReference(indexedReference);
  const compared = normalizeClassReference(value);
  return indexed === compared ||
    indexed.split("\\").at(-1) === compared ||
    compared.split("\\").at(-1) === indexed;
}

function normalizeClassReference(value: string): string {
  return value.replace(/\\\\/g, "\\").replace(/^\\+/, "");
}
