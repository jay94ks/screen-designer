export class HistoryManager<T> {
  private past: T[] = [];
  private future: T[] = [];
  private maxDepth: number;

  constructor(maxDepth = 30) {
    this.maxDepth = maxDepth;
  }

  public push(state: T): void {
    this.past.push(JSON.parse(JSON.stringify(state)));
    if (this.past.length > this.maxDepth) {
      this.past.shift();
    }
    this.future = [];
  }

  public canUndo(): boolean {
    return this.past.length > 0;
  }

  public canRedo(): boolean {
    return this.future.length > 0;
  }

  public undo(currentState: T): T | null {
    if (!this.canUndo()) return null;
    const previous = this.past.pop()!;
    this.future.push(JSON.parse(JSON.stringify(currentState)));
    return previous;
  }

  public redo(currentState: T): T | null {
    if (!this.canRedo()) return null;
    const next = this.future.pop()!;
    this.past.push(JSON.parse(JSON.stringify(currentState)));
    return next;
  }

  public clear(): void {
    this.past = [];
    this.future = [];
  }
}
