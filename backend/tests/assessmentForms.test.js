const test = require('node:test');
const assert = require('node:assert/strict');
const { buildFormSummary, canSubmitForm } = require('../routes/assessmentForms');

test('buildFormSummary returns readable labels for assessment forms', () => {
  const summary = buildFormSummary({
    form_type: 'lesson-observation',
    status: 'submitted',
    updated_at: '2024-01-01T00:00:00.000Z'
  });

  assert.equal(summary.formTypeLabel, 'Lesson Observation');
  assert.equal(summary.statusLabel, 'Submitted');
  assert.equal(summary.updatedAt, '2024-01-01');
});

test('canSubmitForm restricts mentors and supervisors to the correct instruments', () => {
  assert.equal(canSubmitForm('mentor', 'lesson-observation'), true);
  assert.equal(canSubmitForm('mentor', 'test-supervision'), false);
  assert.equal(canSubmitForm('supervisor', 'document-assessment'), true);
  assert.equal(canSubmitForm('supervisor', 'lesson-observation'), false);
  assert.equal(canSubmitForm('student', 'lesson-observation'), false);
});
