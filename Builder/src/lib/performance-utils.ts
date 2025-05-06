interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
}

interface PerformanceOptions {
  maxEntries?: number;
  sendToServer?: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxEntries: number;
  private sendToServer: boolean;

  constructor(options: PerformanceOptions = {}) {
    this.maxEntries = options.maxEntries || 100;
    this.sendToServer = options.sendToServer || false;
  }

  measure(name: string, fn: () => void): number {
    const start = performance.now();
    fn();
    const end = performance.now();
    const duration = end - start;

    this.addMetric(name, duration);
    return duration;
  }

  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<{ result: T; duration: number }> {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    this.addMetric(name, duration);
    return { result, duration };
  }

  private addMetric(name: string, value: number): void {
    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);

    if (this.metrics.length > this.maxEntries) {
      this.metrics.shift();
    }

    if (this.sendToServer) {
      this.sendMetric(metric);
    }
  }

  private async sendMetric(metric: PerformanceMetric): Promise<void> {
    try {
      // Send metric to your analytics service
      // Example: await fetch('/api/performance', { method: 'POST', body: JSON.stringify(metric) });
    } catch (error) {
      console.error('Error sending performance metric:', error);
    }
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(metric => metric.name === name);
    }
    return this.metrics;
  }

  getAverage(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;

    const sum = metrics.reduce((acc, metric) => acc + metric.value, 0);
    return sum / metrics.length;
  }

  clear(): void {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();

export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function memoize<T extends (...args: any[]) => any>(
  fn: T
): (...args: Parameters<T>) => ReturnType<T> {
  const cache = new Map<string, ReturnType<T>>();

  return function (...args: Parameters<T>): ReturnType<T> {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

export function lazyLoad<T>(importFn: () => Promise<{ default: T }>): () => Promise<T> {
  let promise: Promise<T> | null = null;

  return () => {
    if (!promise) {
      promise = importFn().then(module => module.default);
    }
    return promise;
  };
}
