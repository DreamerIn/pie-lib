import { normalize, sentences, words, sort, intersection } from '../builder';

const token = (start, end, text) => ({ start, end, text });

const selection = (start, end) => ({ start, end });

const o = (strings, ...exp) => {
  return strings.reduce((acc, v, index) => {
    const e = exp[index];
    const s = typeof e === 'object' ? JSON.stringify(e) : e;
    return `${acc}${v}${s || ''}`;
  }, '');
};

describe('builder', () => {
  describe('intersection', () => {
    const assert = (selection, tokens, expected) => {
      it(o`${selection}, ${tokens} => ${expected}`, () => {
        const received = intersection(selection, tokens);
        expect(received.results).toEqual(expected);
      });
    };

    assert(selection(2, 3), [token(0, 1)], []);
    assert(selection(1, 2), [token(0, 1)], []);
    assert(
      selection(0, 1),
      [token(0, 1)],
      [{ token: token(0, 1), type: 'exact-fit' }]
    );
    assert(
      selection(0, 2),
      [token(0, 1)],
      [{ token: token(0, 1), type: 'within-selection' }]
    );
    assert(
      selection(0, 2),
      [token(1, 2)],
      [{ token: token(1, 2), type: 'within-selection' }]
    );
    assert(
      selection(0, 10),
      [token(1, 2), token(2, 3)],
      [
        { token: token(1, 2), type: 'within-selection' },
        { token: token(2, 3), type: 'within-selection' }
      ]
    );
    assert(
      selection(0, 10),
      [token(1, 2), token(2, 11)],
      [
        { token: token(1, 2), type: 'within-selection' },
        { token: token(2, 11), type: 'overlap' }
      ]
    );
  });

  describe('sort', () => {
    it('sorts', () => {
      const out = sort([token(1, 2), token(0, 1)]);
      expect(out).toEqual([token(0, 1), token(1, 2)]);
    });
    it('sorts', () => {
      const out = sort([token(0, 1), token(1, 2)]);
      expect(out).toEqual([token(0, 1), token(1, 2)]);
    });
    it('sorts', () => {
      expect(() => sort([token(0, 2), token(1, 2)])).toThrow(Error);
    });
  });
  describe('normalize', () => {
    const assert = (input, tokens, expected) => {
      it(`${input} + ${JSON.stringify(tokens)} -> ${JSON.stringify(
        expected
      )}`, () => {
        const out = normalize(input, tokens);
        expect(out).toEqual(expected);
      });
    };
    assert(
      'abcde',
      [{ text: 'b', start: 1, end: 2 }, { text: 'd', start: 3, end: 4 }],
      [
        { text: 'a', start: 0, end: 1 },
        { text: 'b', start: 1, end: 2, predefined: true },
        { text: 'c', start: 2, end: 3 },
        { text: 'd', start: 3, end: 4, predefined: true },
        { text: 'e', start: 4, end: 5 }
      ]
    );
    assert(
      'abc',
      [{ text: 'c', start: 2, end: 3 }],
      [
        { text: 'ab', start: 0, end: 2 },
        { text: 'c', start: 2, end: 3, predefined: true }
      ]
    );

    assert(
      'abc',
      [{ text: 'c', start: 2, end: 3 }, { text: 'b', start: 1, end: 2 }],
      [
        { text: 'a', start: 0, end: 1 },
        { text: 'b', start: 1, end: 2, predefined: true },
        { text: 'c', start: 2, end: 3, predefined: true }
      ]
    );

    assert(
      'abc',
      [{ text: 'a', start: 0, end: 1 }],
      [
        { text: 'a', start: 0, end: 1, predefined: true },
        { text: 'bc', start: 1, end: 3 }
      ]
    );

    assert(
      'abcd',
      [
        { text: 'b', start: 1, end: 2 },
        { text: 'c', start: 2, end: 3 },
        { text: 'd', start: 3, end: 4 }
      ],
      [
        { text: 'a', start: 0, end: 1 },
        { text: 'b', start: 1, end: 2, predefined: true },
        { text: 'c', start: 2, end: 3, predefined: true },
        { text: 'd', start: 3, end: 4, predefined: true }
      ]
    );
    assert(
      'abcde',
      [
        { text: 'b', start: 1, end: 2 },
        { text: 'c', start: 2, end: 3 },
        { text: 'd', start: 3, end: 4 }
      ],
      [
        { text: 'a', start: 0, end: 1 },
        { text: 'b', start: 1, end: 2, predefined: true },
        { text: 'c', start: 2, end: 3, predefined: true },
        { text: 'd', start: 3, end: 4, predefined: true },
        { text: 'e', start: 4, end: 5 }
      ]
    );
  });

  describe('words', () => {
    it('works', () => {
      const out = words('foo. bar');
      expect(out).toEqual([
        {
          text: 'foo.',
          start: 0,
          end: 4
        },
        {
          text: 'bar',
          start: 5,
          end: 8
        }
      ]);
    });
  });

  describe('sentences', () => {
    it('foobar', () => {
      const text = 'This is foo. This is bar.';
      const out = sentences(text);
      expect(out[0]).toEqual({ text: 'This is foo.', start: 0, end: 12 });
      expect(out[1]).toEqual({ text: 'This is bar.', start: 13, end: 25 });
    });
    it('works', () => {
      const text =
        'On Jan. 20, former Sen. Barack Obama became the 44th President of the USA. Millions attended the Inauguration.';

      const out = sentences(text);
      expect(out.length).toEqual(2);
    });
  });
});