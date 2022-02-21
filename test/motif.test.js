import { describe, expect, test } from 'vitest';
import { parseDID } from '../src/modules/motif';

describe('motif', () => {
  test('parseDID()', () => {
    const tests = [
      [
        'zNKtCNqYWLYWYW3gWRA1vnRykfCBZYHZvzKr',
        { colorIndex: 4, positionIndexes: [50, 9, 49, 9, 16, 46, 15, 18] },
      ],
      [
        'z1oQhZEQSsMeAPiTCBAH8cqZxF8YttyUPJp',
        { colorIndex: 24, positionIndexes: [6, 16, 28, 45, 47, 61, 54, 61] },
      ],
      [
        'z1kHBYtqXxpUfUpsW2ug8q4PBeKDEPTsC4Y',
        { colorIndex: 19, positionIndexes: [12, 21, 21, 39, 35, 10, 16, 16] },
      ],
      [
        'z1RbtVHc66zEErVZ1rFb35hkt2xNqDQQExk',
        { colorIndex: 31, positionIndexes: [17, 11, 42, 54, 4, 34, 62, 27] },
      ],
      [
        'z1mAZQTnCioGA9jpXdXJgtMJwrzP5vwGqio',
        { colorIndex: 20, positionIndexes: [42, 54, 20, 12, 31, 19, 49, 39] },
      ],
    ];
    tests.forEach(([did, expected]) => {
      const { colorIndex, positionIndexes } = parseDID(did);
      expect(colorIndex).toEqual(expected.colorIndex);
      expect(positionIndexes).toEqual(expected.positionIndexes);
    });
  });
});
