const express = require('express');
const db = require('../config/database');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const router = express.Router();

function calculateTotal(data) {
  const fields = [
    'lesson_intro', 'lesson_objectives', 'lesson_sequencing', 'lesson_teacher_activities', 'lesson_pupils_experiences', 'lesson_strategies', 'lesson_media', 'lesson_format_frequency',
    'scheming_aims', 'scheming_content', 'scheming_methods', 'scheming_resources', 'scheming_references',
    'assessment_test_design', 'assessment_assignments', 'assessment_remedial', 'assessment_extension', 'assessment_profiles', 'assessment_records',
    'reflective_depth_scope', 'reflective_attainment', 'reflective_weaknesses_strengths', 'reflective_suggestions',
    'file_appearance_relevant_sections'
  ];
  return fields.reduce((sum, key) => sum + (parseInt(data[key]) || 0), 0);
}

async function ensureSupervisorAssignment(supervisorId, studentId) {
  const result = await db.query('SELECT id FROM assignments WHERE student_id = ? AND supervisor_id = ?', [studentId, supervisorId]);
  return result.rows.length > 0;
}

router.post('/', authMiddleware, roleMiddleware('supervisor'), async (req, res) => {
  try {
    const supervisorId = req.user.id;
    const {
      studentId,
      programme,
      tpSchoolName,
      tpDate,
      tpDurationFrom,
      tpDurationTo,
      subjectTeaching,
      classes,
      lessonIntro,
      lessonObjectives,
      lessonSequencing,
      lessonTeacherActivities,
      lessonPupilsExperiences,
      lessonStrategies,
      lessonMedia,
      lessonFormatFrequency,
      schemingAims,
      schemingContent,
      schemingMethods,
      schemingResources,
      schemingReferences,
      assessmentTestDesign,
      assessmentAssignments,
      assessmentRemedial,
      assessmentExtension,
      assessmentProfiles,
      assessmentRecords,
      reflectiveDepthScope,
      reflectiveAttainment,
      reflectiveWeaknessesStrengths,
      reflectiveSuggestions,
      fileAppearanceRelevantSections,
      overallComments,
      markAwarded,
      assessorName
    } = req.body;

    if (!studentId) return res.status(400).json({ error: 'studentId is required' });
    if (!await ensureSupervisorAssignment(supervisorId, studentId)) {
      return res.status(403).json({ error: 'Student is not assigned to this supervisor' });
    }

    const totalMarks = calculateTotal({
      lesson_intro: lessonIntro,
      lesson_objectives: lessonObjectives,
      lesson_sequencing: lessonSequencing,
      lesson_teacher_activities: lessonTeacherActivities,
      lesson_pupils_experiences: lessonPupilsExperiences,
      lesson_strategies: lessonStrategies,
      lesson_media: lessonMedia,
      lesson_format_frequency: lessonFormatFrequency,
      scheming_aims: schemingAims,
      scheming_content: schemingContent,
      scheming_methods: schemingMethods,
      scheming_resources: schemingResources,
      scheming_references: schemingReferences,
      assessment_test_design: assessmentTestDesign,
      assessment_assignments: assessmentAssignments,
      assessment_remedial: assessmentRemedial,
      assessment_extension: assessmentExtension,
      assessment_profiles: assessmentProfiles,
      assessment_records: assessmentRecords,
      reflective_depth_scope: reflectiveDepthScope,
      reflective_attainment: reflectiveAttainment,
      reflective_weaknesses_strengths: reflectiveWeaknessesStrengths,
      reflective_suggestions: reflectiveSuggestions,
      file_appearance_relevant_sections: fileAppearanceRelevantSections
    });

    const existing = await db.query('SELECT id FROM final_marks WHERE student_id = ? AND supervisor_id = ?', [studentId, supervisorId]);
    const data = [
      studentId,
      supervisorId,
      programme || null,
      tpSchoolName || null,
      tpDate || null,
      tpDurationFrom || null,
      tpDurationTo || null,
      subjectTeaching || null,
      classes || null,
      lessonIntro || null,
      lessonObjectives || null,
      lessonSequencing || null,
      lessonTeacherActivities || null,
      lessonPupilsExperiences || null,
      lessonStrategies || null,
      lessonMedia || null,
      lessonFormatFrequency || null,
      schemingAims || null,
      schemingContent || null,
      schemingMethods || null,
      schemingResources || null,
      schemingReferences || null,
      assessmentTestDesign || null,
      assessmentAssignments || null,
      assessmentRemedial || null,
      assessmentExtension || null,
      assessmentProfiles || null,
      assessmentRecords || null,
      reflectiveDepthScope || null,
      reflectiveAttainment || null,
      reflectiveWeaknessesStrengths || null,
      reflectiveSuggestions || null,
      fileAppearanceRelevantSections || null,
      totalMarks,
      overallComments || null,
      markAwarded || null,
      assessorName || null
    ];

    if (existing.rows.length > 0) {
      await db.query(
        `UPDATE final_marks SET
          programme = ?, tp_school_name = ?, tp_date = ?, tp_duration_from = ?, tp_duration_to = ?, subject_teaching = ?, classes = ?,
          lesson_intro = ?, lesson_objectives = ?, lesson_sequencing = ?, lesson_teacher_activities = ?, lesson_pupils_experiences = ?, lesson_strategies = ?, lesson_media = ?, lesson_format_frequency = ?,
          scheming_aims = ?, scheming_content = ?, scheming_methods = ?, scheming_resources = ?, scheming_references = ?,
          assessment_test_design = ?, assessment_assignments = ?, assessment_remedial = ?, assessment_extension = ?, assessment_profiles = ?, assessment_records = ?,
          reflective_depth_scope = ?, reflective_attainment = ?, reflective_weaknesses_strengths = ?, reflective_suggestions = ?,
          file_appearance_relevant_sections = ?, total_marks = ?, overall_comments = ?, mark_awarded = ?, assessor_name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE student_id = ? AND supervisor_id = ?`,
        [...data.slice(2), assessorName || null, studentId, supervisorId]
      );
    } else {
      await db.insert(
        `INSERT INTO final_marks (
          student_id, supervisor_id, programme, tp_school_name, tp_date, tp_duration_from, tp_duration_to, subject_teaching, classes,
          lesson_intro, lesson_objectives, lesson_sequencing, lesson_teacher_activities, lesson_pupils_experiences, lesson_strategies, lesson_media, lesson_format_frequency,
          scheming_aims, scheming_content, scheming_methods, scheming_resources, scheming_references,
          assessment_test_design, assessment_assignments, assessment_remedial, assessment_extension, assessment_profiles, assessment_records,
          reflective_depth_scope, reflective_attainment, reflective_weaknesses_strengths, reflective_suggestions,
          file_appearance_relevant_sections, total_marks, overall_comments, mark_awarded, assessor_name
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [...data, assessorName || null]
      );
    }

    res.json({ message: 'Final mark submitted successfully', totalMarks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.get('/my-students', authMiddleware, roleMiddleware('supervisor'), async (req, res) => {
  try {
    const supervisorId = req.user.id;
    const result = await db.query(`
      SELECT a.student_id AS id, s.first_name, s.last_name, s.email, s.student_id AS reg_number, s.program, s.school, fm.id AS final_mark_id, fm.total_marks, fm.mark_awarded
      FROM assignments a
      JOIN users s ON a.student_id = s.id
      LEFT JOIN final_marks fm ON fm.student_id = s.id AND fm.supervisor_id = ?
      WHERE a.supervisor_id = ?
      ORDER BY s.first_name
    `, [supervisorId, supervisorId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/student/:studentId', authMiddleware, roleMiddleware('supervisor'), async (req, res) => {
  try {
    const supervisorId = req.user.id;
    const studentId = req.params.studentId;
    if (!await ensureSupervisorAssignment(supervisorId, studentId)) {
      return res.status(403).json({ error: 'Student is not assigned to this supervisor' });
    }
    const result = await db.query(
      `SELECT fm.*, CONCAT(s.first_name,' ',s.last_name) AS student_name, s.email, s.student_id AS reg_number
       FROM final_marks fm
       JOIN users s ON fm.student_id = s.id
       WHERE fm.student_id = ? AND fm.supervisor_id = ?`,
      [studentId, supervisorId]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/me', authMiddleware, roleMiddleware('student'), async (req, res) => {
  try {
    const studentId = req.user.id;
    const result = await db.query(
      `SELECT fm.*, CONCAT(s.first_name,' ',s.last_name) AS student_name, s.email, s.student_id AS reg_number
       FROM final_marks fm
       JOIN users s ON fm.student_id = s.id
       WHERE fm.student_id = ?`,
      [studentId]
    );
    res.json(result.rows[0] || null);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/gradebook', authMiddleware, roleMiddleware('coordinator', 'admin'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT fm.*, CONCAT(s.first_name,' ',s.last_name) AS student_name, s.student_id AS reg_number,
        CONCAT(sv.first_name,' ',sv.last_name) AS supervisor_name, sv.email AS supervisor_email
      FROM final_marks fm
      JOIN users s ON fm.student_id = s.id
      LEFT JOIN users sv ON fm.supervisor_id = sv.id
      ORDER BY s.first_name
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
