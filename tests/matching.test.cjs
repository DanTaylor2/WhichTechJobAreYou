const test = require('node:test');
const assert = require('node:assert/strict');
require('../site/quiz-data.js');
const { questions, roles, match } = globalThis.TechQuiz;
test('all 4,096 answer combinations produce distinct, reachable role matches', () => {
  const winners = new Set();
  for (let n = 0; n < 4096; n++) {
    const answers = Array.from({ length: 6 }, (_, i) => (n >> (i * 2)) & 3);
    const result = match(answers);
    winners.add(result.main.id);
    assert.equal(new Set([result.main.id, ...result.alternatives.map(r => r.id)]).size, 3);
    assert.equal(result.scores[result.main.id], Math.max(...Object.values(result.scores)));
    assert.equal(Object.values(result.scores).reduce((a, b) => a + b), 24);
    assert.deepEqual(match(answers), result);
  }
  assert.equal(winners.size, 8);
});
test('each role has equal primary and secondary coverage', () => {
  for (const role of roles) {
    assert.equal(questions.flatMap(q => q.answers).filter(a => a.main === role.id).length, 3);
    assert.equal(questions.flatMap(q => q.answers).filter(a => a.related === role.id).length, 3);
  }
});
test('incomplete and invalid answers cannot be scored', () => {
  for (const answers of [[], [0, 0], [0, 0, 0, 0, 0, 4], [0, 0, 0, 0, 0, -1], [0, 0, 0, 0, 0, null]]) {
    assert.throws(() => match(answers));
  }
});
