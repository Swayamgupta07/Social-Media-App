// Reactive programming utilities (similar to Combine)
export class Subject<T> {
  private subscribers: ((value: T) => void)[] = [];
  private _value: T;

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  subscribe(callback: (value: T) => void): () => void {
    this.subscribers.push(callback);
    callback(this._value);
    
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  next(value: T) {
    this._value = value;
    this.subscribers.forEach(callback => callback(value));
  }

  map<U>(transform: (value: T) => U): Subject<U> {
    const mapped = new Subject(transform(this._value));
    this.subscribe(value => mapped.next(transform(value)));
    return mapped;
  }

  filter(predicate: (value: T) => boolean): Subject<T | undefined> {
    const filtered = new Subject<T | undefined>(predicate(this._value) ? this._value : undefined);
    this.subscribe(value => {
      if (predicate(value)) {
        filtered.next(value);
      }
    });
    return filtered;
  }
}

export class BehaviorSubject<T> extends Subject<T> {
  constructor(initialValue: T) {
    super(initialValue);
  }
}

export function combineLatest<T, U>(
  subject1: Subject<T>,
  subject2: Subject<U>
): Subject<[T, U]> {
  const combined = new Subject<[T, U]>([subject1.value, subject2.value]);
  
  subject1.subscribe(() => combined.next([subject1.value, subject2.value]));
  subject2.subscribe(() => combined.next([subject1.value, subject2.value]));
  
  return combined;
}