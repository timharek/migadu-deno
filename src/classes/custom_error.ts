import { bgRed, bgYellow, black } from '../../deps.ts';

type Severity = 'error' | 'warning';
const severityMap: Record<Severity, string> = {
  error: black(bgRed('Error')),
  warning: black(bgYellow('Warning')),
};

export class CustomError extends Error {
  constructor(message: string, public severity: Severity = 'error') {
    super(message);
    this.name = 'CustomError';
  }

  public toString(): string {
    return `${severityMap[this.severity]}: ${this.message}`;
  }
}
