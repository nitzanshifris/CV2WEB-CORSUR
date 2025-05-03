interface TestOptions {
  timeout?: number;
  retries?: number;
  skip?: boolean;
}

interface TestResult {
  name: string;
  passed: boolean;
  error?: Error;
  duration: number;
}

class TestRunner {
  private tests: Array<{
    name: string;
    fn: () => void | Promise<void>;
    options: TestOptions;
  }> = [];

  addTest(
    name: string,
    fn: () => void | Promise<void>,
    options: TestOptions = {}
  ): void {
    this.tests.push({ name, fn, options });
  }

  async run(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    for (const test of this.tests) {
      if (test.options.skip) {
        results.push({
          name: test.name,
          passed: true,
          duration: 0,
        });
        continue;
      }

      const start = performance.now();
      let passed = true;
      let error: Error | undefined;

      try {
        const result = test.fn();
        if (result instanceof Promise) {
          await Promise.race([
            result,
            new Promise((_, reject) =>
              setTimeout(
                () => reject(new Error("Test timeout")),
                test.options.timeout || 5000
              )
            ),
          ]);
        }
      } catch (e) {
        passed = false;
        error = e as Error;
      }

      const duration = performance.now() - start;

      results.push({
        name: test.name,
        passed,
        error,
        duration,
      });
    }

    return results;
  }

  clear(): void {
    this.tests = [];
  }
}

export const testRunner = new TestRunner();

export function describe(name: string, fn: () => void): void {
  console.group(name);
  fn();
  console.groupEnd();
}

export function it(name: string, fn: () => void | Promise<void>): void {
  testRunner.addTest(name, fn);
}

export function expect<T>(actual: T) {
  return {
    toBe(expected: T): void {
      if (actual !== expected) {
        throw new Error(
          `Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`
        );
      }
    },
    toEqual(expected: T): void {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(
            expected
          )}`
        );
      }
    },
    toBeTruthy(): void {
      if (!actual) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be truthy`);
      }
    },
    toBeFalsy(): void {
      if (actual) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be falsy`);
      }
    },
    toBeNull(): void {
      if (actual !== null) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be null`);
      }
    },
    toBeUndefined(): void {
      if (actual !== undefined) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be undefined`);
      }
    },
    toBeDefined(): void {
      if (actual === undefined) {
        throw new Error(`Expected ${JSON.stringify(actual)} to be defined`);
      }
    },
    toContain(expected: any): void {
      if (Array.isArray(actual)) {
        if (!actual.includes(expected)) {
          throw new Error(
            `Expected ${JSON.stringify(actual)} to contain ${JSON.stringify(
              expected
            )}`
          );
        }
      } else if (typeof actual === "string") {
        if (!actual.includes(expected)) {
          throw new Error(
            `Expected "${actual}" to contain "${expected}"`
          );
        }
      } else {
        throw new Error("toContain can only be used with arrays and strings");
      }
    },
    toHaveLength(expected: number): void {
      if (Array.isArray(actual)) {
        if (actual.length !== expected) {
          throw new Error(
            `Expected array to have length ${expected}, but got ${actual.length}`
          );
        }
      } else if (typeof actual === "string") {
        if (actual.length !== expected) {
          throw new Error(
            `Expected string to have length ${expected}, but got ${actual.length}`
          );
        }
      } else {
        throw new Error("toHaveLength can only be used with arrays and strings");
      }
    },
  };
}

export function beforeEach(fn: () => void | Promise<void>): void {
  testRunner.addTest("beforeEach", fn);
}

export function afterEach(fn: () => void | Promise<void>): void {
  testRunner.addTest("afterEach", fn);
}

export function beforeAll(fn: () => void | Promise<void>): void {
  testRunner.addTest("beforeAll", fn);
}

export function afterAll(fn: () => void | Promise<void>): void {
  testRunner.addTest("afterAll", fn);
}

export function skip(name: string, fn: () => void | Promise<void>): void {
  testRunner.addTest(name, fn, { skip: true });
}

export function timeout(
  name: string,
  fn: () => void | Promise<void>,
  ms: number
): void {
  testRunner.addTest(name, fn, { timeout: ms });
}

export function retry(
  name: string,
  fn: () => void | Promise<void>,
  count: number
): void {
  testRunner.addTest(name, fn, { retries: count });
} 