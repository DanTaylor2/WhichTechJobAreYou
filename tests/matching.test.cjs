const test = require('node:test');
const assert = require('node:assert/strict');
require('../site/quiz-data.js');
const { questions, roles, match } = globalThis.TechQuiz;
test('all 15,625 answer combinations produce accurate scores and supported matches', () => {
  const winners = new Set();
  for (let n = 0; n < 15625; n++) {
    const answers = questions.map((_, i) => Math.floor(n / 5 ** i) % 5);
    const expectedScores = Object.fromEntries(roles.map(role => [role.id, 0]));
    answers.forEach((answer, i) => {
      const choice = questions[i].answers[answer];
      if (choice.unsure) return;
      expectedScores[choice.main] += 3;
      expectedScores[choice.related] += 1;
    });
    const result = match(answers);
    assert.deepEqual(result.scores, expectedScores);
    assert.deepEqual(match(answers), result);
    const scoredRoles = roles.filter(role => expectedScores[role.id] > 0);
    if (scoredRoles.length === 0) {
      assert.equal(result.main, null);
      assert.deepEqual(result.alternatives, []);
      continue;
    }
    winners.add(result.main.id);
    const suggestions = [result.main, ...result.alternatives];
    assert.equal(new Set(suggestions.map(role => role.id)).size, Math.min(3, scoredRoles.length));
    assert.ok(suggestions.every(role => expectedScores[role.id] > 0));
    assert.equal(result.scores[result.main.id], Math.max(...Object.values(result.scores)));
  }
  assert.equal(winners.size, 8);
});
test('each role has equal primary coverage and every related role is valid and distinct', () => {
  for (const role of roles) {
    assert.equal(questions.flatMap(q => q.answers).filter(a => a.main === role.id).length, 3);
  }
  for (const answer of questions.flatMap(q => q.answers).filter(answer => !answer.unsure)) {
    assert.ok(roles.some(role => role.id === answer.main));
    assert.ok(roles.some(role => role.id === answer.related));
    assert.notEqual(answer.main, answer.related);
  }
});
test('not sure on every question gives no match and no points', () => {
  const result = match(questions.map(q => q.answers.findIndex(a => a.unsure)));
  assert.equal(result.main, null);
  assert.deepEqual(result.alternatives, []);
  assert.ok(Object.values(result.scores).every(score => score === 0));
});
test('one scored answer gives only its main and related roles', () => {
  const answers = questions.map(q => q.answers.findIndex(a => a.unsure));
  answers[0] = 0;
  const result = match(answers);
  assert.equal(result.main.id, 'research');
  assert.deepEqual(result.alternatives.map(role => role.id), ['ux']);
  assert.equal(result.scores.research, 3);
  assert.equal(result.scores.ux, 1);
  assert.equal(Object.values(result.scores).reduce((total, score) => total + score, 0), 4);
});
test('unsure answers do not affect tie ordering for equivalent scored choices', () => {
  // Questions 2 and 5 offer the same developer/systems choice at index 0.
  // Question 4 reverses those roles, creating equal scores and primary counts.
  assert.deepEqual(match([4, 0, 4, 0, 4, 4]), match([4, 4, 4, 0, 0, 4]));
});
test('incomplete and invalid answers cannot be scored', () => {
  for (const answers of [[], [0, 0], [0, 0, 0, 0, 0, 5], [0, 0, 0, 0, 0, -1], [0, 0, 0, 0, 0, null], Array(6), [0, 0, 0, 0, 0, undefined], [0, 0, 0, 0, 0, '0'], [0, 0, 0, 0, 0, 0.5]]) {
    assert.throws(() => match(answers));
  }
});
