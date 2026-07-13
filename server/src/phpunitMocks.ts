import { LaravelIndex, PhpClassInfo, PhpMethodInfo } from "./projectIndex.js";
import { resolvePhpClassReference } from "./phpResolver.js";

export interface PhpunitMockMethodTarget {
  classFqcn: string;
  filePath: string;
  kind: PhpClassInfo["kind"];
  method: PhpMethodInfo;
}

const MOCK_FACTORY_METHOD_NAMES = "createMock|createStub|createPartialMock|createConfiguredMock";
const MOCK_FACTORY_CALL_SOURCE =
  `(?:\\$this\\s*->\\s*|self::|static::)?(?:${MOCK_FACTORY_METHOD_NAMES})\\s*\\(\\s*(\\\\?[A-Za-z_][A-Za-z0-9_\\\\]*)::class\\b`;

// Resolves the type behind PHPUnit's `$mock->method('name')` selector.
// Supports direct chains (`$this->createMock(Foo::class)->method('...')`) and
// variables assigned from a mock factory, including expectation chains such as
// `$mock->expects($this->once())->method('...')`.
export function phpunitMockMethodClassAtOffset(
  documentText: string,
  offset: number,
): string | null {
  const statement = currentStatementPrefix(documentText, offset);
  if (!/(?:\?->|->)\s*method\s*\(\s*['"][^'"]*$/.test(statement)) {
    return null;
  }

  const receiver = mockReceiverForStatement(statement);
  if (!receiver) {
    return null;
  }

  if (receiver.startsWith("$")) {
    return assignedMockClass(documentText.slice(0, offset), receiver);
  }

  return mockFactoryClass(documentText, receiver);
}

export function phpunitMockMethodTargetsAtOffset(
  documentText: string,
  offset: number,
  index: LaravelIndex,
): PhpunitMockMethodTarget[] {
  const classFqcn = phpunitMockMethodClassAtOffset(documentText, offset);
  const phpClass = classFqcn ? phpClassForReference(classFqcn, index) : null;
  if (!phpClass) {
    return [];
  }

  // PHPUnit test doubles can only stub methods callable from the outside, so
  // mock method-name strings stay limited to public members.
  return (phpClass.methods ?? [])
    .filter((method) => method.visibility === "public")
    .map((method) => ({
      classFqcn: phpClass.fqcn,
      filePath: phpClass.filePath,
      kind: phpClass.kind,
      method,
    }));
}

export function phpunitMockMethodTargetAtOffset(
  documentText: string,
  offset: number,
  methodName: string,
  index: LaravelIndex,
): PhpunitMockMethodTarget | null {
  return phpunitMockMethodTargetsAtOffset(documentText, offset, index)
    .find((candidate) => candidate.method.name === methodName) ?? null;
}

function currentStatementPrefix(documentText: string, offset: number): string {
  const prefix = documentText.slice(0, offset);
  const lastBoundary = Math.max(
    prefix.lastIndexOf(";"),
    prefix.lastIndexOf("{"),
    prefix.lastIndexOf("}"),
  );
  return prefix.slice(lastBoundary + 1);
}

function mockReceiverForStatement(statement: string): string | null {
  const beforeMethod = statement.replace(/\s*(?:\?->|->)\s*method\s*\(\s*['"][^'"]*$/, "");
  const receiverMatch = new RegExp(
    `(${MOCK_FACTORY_CALL_SOURCE}|\\$[A-Za-z_][A-Za-z0-9_]*)(?:\\s*(?:\\?->|->)\\s*[A-Za-z_][A-Za-z0-9_]*\\s*\\([^;]*\\))*\\s*$`,
  ).exec(beforeMethod);
  return receiverMatch?.[1] ?? null;
}

function assignedMockClass(documentPrefix: string, variable: string): string | null {
  const assignmentPattern = new RegExp(
    `${escapeRegex(variable)}\\s*=\\s*(${MOCK_FACTORY_CALL_SOURCE})`,
    "g",
  );
  let classReference: string | null = null;

  for (const match of documentPrefix.matchAll(assignmentPattern)) {
    classReference = mockFactoryClass(documentPrefix, match[1]);
  }

  return classReference;
}

function mockFactoryClass(documentText: string, expression: string): string | null {
  const match = new RegExp(MOCK_FACTORY_CALL_SOURCE).exec(expression);
  return match ? resolvePhpClassReference(documentText, match[1]) : null;
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

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
