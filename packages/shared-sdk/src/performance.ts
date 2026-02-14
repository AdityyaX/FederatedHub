import { PerformanceMetric } from './types';

class PerformanceTracker {
  private metrics: PerformanceMetric[] = [];
  private marks: Map<string, number> = new Map();

  mark(name: string): void {
    const timestamp = performance.now();
    this.marks.set(name, timestamp);
    
    if (typeof performance.mark === 'function') {
      performance.mark(name);
    }
  }

  measure(name: string, startMark: string, endMark?: string): PerformanceMetric | null {
    const startTime = this.marks.get(startMark);
    
    if (!startTime) {
      console.warn(`Start mark "${startMark}" not found`);
      return null;
    }

    const endTime = endMark ? this.marks.get(endMark) : performance.now();
    
    if (endTime === undefined) {
      console.warn(`End mark "${endMark}" not found`);
      return null;
    }

    const metric: PerformanceMetric = {
      name,
      startTime,
      endTime,
      duration: endTime - startTime,
    };

    this.metrics.push(metric);

    if (typeof performance.measure === 'function' && endMark) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (error) {
        console.warn('Native performance.measure failed:', error);
      }
    }

    return metric;
  }

  measureFromMark(name: string, startMark: string, metadata?: Record<string, any>): PerformanceMetric | null {
    const metric = this.measure(name, startMark);
    
    if (metric && metadata) {
      metric.metadata = metadata;
    }

    return metric;
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getMetricsByName(namePattern: string): PerformanceMetric[] {
    return this.metrics.filter(m => m.name.includes(namePattern));
  }

  clear(): void {
    this.metrics = [];
    this.marks.clear();
    
    if (typeof performance.clearMarks === 'function') {
      performance.clearMarks();
    }
    
    if (typeof performance.clearMeasures === 'function') {
      performance.clearMeasures();
    }
  }

  logMetrics(): void {
    if (this.metrics.length === 0) {
      console.log('No performance metrics recorded');
      return;
    }

    console.group('📊 Performance Metrics');
    this.metrics.forEach(metric => {
      console.log(`${metric.name}: ${metric.duration.toFixed(2)}ms`);
      if (metric.metadata) {
        console.log('  Metadata:', metric.metadata);
      }
    });
    console.groupEnd();
  }
}

export const performanceTracker = new PerformanceTracker();

export function withPerformanceTracking<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: any[]) => {
    const startMark = `${name}-start-${Date.now()}`;
    performanceTracker.mark(startMark);
    
    try {
      const result = fn(...args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          performanceTracker.measureFromMark(name, startMark);
        });
      }
      
      performanceTracker.measureFromMark(name, startMark);
      return result;
    } catch (error) {
      performanceTracker.measureFromMark(`${name}-error`, startMark);
      throw error;
    }
  }) as T;
}
