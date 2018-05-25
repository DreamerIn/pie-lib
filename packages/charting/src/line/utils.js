import debug from 'debug';
import { swap } from '../point/utils';

const log = debug('pie-lib:charting:line:utils');

export class Expression {
  constructor(multiplier, b) {
    this.multiplier = multiplier;
    this.b = b;
  }

  expr() {
    return `${this.multiplier}x + ${this.b}`;
  }

  getY(x) {
    return this.multiplier * x + this.b;
  }

  equals(other) {
    return this.multiplier === other.multiplier && this.b === other.b;
  }
}

export const pointsHaveSameExpression = (a, b) => {
  const expressionA = expression(a.from, a.to);
  const expressionB = expression(b.from, b.to);
  return expressionA.equals(expressionB);
};
/**
 * Create a linear expression from 2 points
 */

export const expression = (from, to) => {
  log('[expression] from: ', from, 'to: ', to);
  const multiplier = (to.y - from.y) / (to.x - from.x);
  const zeroedY = multiplier * from.x;
  const b = from.y - zeroedY;
  return new Expression(multiplier, b);
};

export const point = (x, y) => ({ x, y });

export const pointsFromExpression = (expression, min, max) => {
  const fromY = expression.multiplier * min + expression.b;
  const toY = expression.multiplier * max + expression.b;
  return {
    from: point(min, fromY),
    to: point(max, toY)
  };
};

export const hasLine = (lines, line) => lineIndex(lines, line) !== -1;

export const removeLine = (lines, line) => {
  const index = lineIndex(lines, line);
  if (index === -1) {
    return lines;
  }
  const out = lines.slice();
  out.splice(index, 1);
  return out;
};

export const removeLines = (lines, toRemove) => {
  log('[removeLines] points: ', lines, toRemove);
  toRemove = Array.isArray(toRemove) ? toRemove : [toRemove];
  const out = lines.filter(p => !hasLine(toRemove, p));
  log('[removePoints] points: ', out);
  return out;
};

export const pointsEqual = (a, b) => a.x == b.x && a.y == b.y;

export const linesEqual = (a, b) =>
  pointsEqual(a.from, b.from) && pointsEqual(a.to, b.to);

export const lineIndex = (lines, line) =>
  lines.findIndex(l => linesEqual(l, line));

export const swapLine = (lines, from, to) => swap(lines, from, to, lineIndex);
