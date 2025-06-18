import { cosineSimilarity } from '../ai_model.js';

describe('cosineSimilarity', () => {
  it('computes similarity between two vectors', () => {
    const a = [1, 0];
    const b = [1, 0];
    expect(cosineSimilarity(a, b)).toBeCloseTo(1);

    const c = [1, 0];
    const d = [0, 1];
    expect(cosineSimilarity(c, d)).toBeCloseTo(0);
  });
});