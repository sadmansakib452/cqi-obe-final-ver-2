// File: src/config/uploadStepsConfig.js

import step1Schema from "@/yup/step1Schema";
import step2Schema from "@/yup/step2Schema";
import step3Schema from "@/yup/step3Schema";
import step4Schema from "@/yup/step4Schema";
import step5Schema from "@/yup/step5Schema";
import step6Schema from "@/yup/step6Schema";
import step7Schema from "@/yup/step7Schema";
import step8Schema from "@/yup/step8Schema";
import step9Schema from "@/yup/step9Schema";

export const uploadStepsConfig = {
  step1: {
    stepKey: "finalGrades",
    title: "Upload Final Grades",
    fileType: "FINAL-GRADES",
    renamePattern: (courseFileName) => `${courseFileName}.Final-Grades.pdf`,
    fields: [
      {
        name: "file",
        label: "Final Grades (PDF)",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Please upload the Final Grades PDF.",
      },
    ],
    validationSchema: step1Schema,
    successKey: "finalGrades",
  },
  step2: {
    stepKey: "obeSummary",
    title: "Upload Summary of OBE",
    fileType: "OBE-SUMMARY",
    renamePattern: (courseFileName) => `${courseFileName}-OBE-SUMMARY.pdf`,
    toggleable: true,
    fields: [
      {
        name: "file",
        label: "OBE Summary (PDF)",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Please upload the OBE Summary PDF.",
      },
      {
        name: "text_area",
        label: "OBE Summary (Text)",
        type: "textarea",
        placeholder: "Enter the OBE Summary text here...",
      },
    ],
    validationSchema: step2Schema,
    successKey: "obeSummary",
  },
  step3: {
    stepKey: "instructorFeedback",
    title: "Upload Instructor Feedback",
    fileType: "INSTRUCTOR-FEEDBACK",
    renamePattern: (courseFileName) =>
      `${courseFileName}.INSTRUCTOR-FEEDBACK.pdf`,
    toggleable: true,
    fields: [
      {
        name: "file",
        label: "Instructor Feedback (PDF)",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Please upload the Instructor Feedback PDF.",
      },
      {
        name: "form_data",
        label: "Instructor Feedback (Form)",
        type: "custom",
        component: "InstructorFeedback",
      },
    ],
    validationSchema: step3Schema,
    successKey: "instructorFeedback",
  },
  step4: {
    stepKey: "courseOutline",
    title: "Upload Course Outline",
    fileType: "COURSE-OUTLINE",
    renamePattern: (courseFileName) => `${courseFileName}.COURSE-OUTLINE.pdf`,
    fields: [
      {
        name: "file",
        label: "Course Outline (PDF)",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Please upload the Course Outline PDF.",
      },
    ],
    validationSchema: step4Schema,
    successKey: "courseOutline",
  },
  step5: {
    stepKey: "midExam",
    title: "Upload Mid Exam Files",
    fileType: "MID-EXAM",
    renamePattern: (courseFileName, index, key) =>
      `${courseFileName}.MID-${index + 1}.${key.toUpperCase()}.pdf`,
    dynamic: true,
    fields: [
      {
        name: "question",
        label: "Mid Exam Question",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Mid Exam Question PDF.",
      },
      {
        name: "highest",
        label: "Highest Scoring Script",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Highest Scoring Script PDF.",
      },
      {
        name: "average",
        label: "Average Scoring Script",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Average Scoring Script PDF.",
      },
      {
        name: "marginal",
        label: "Marginally Passed Script",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Marginally Passed Script PDF.",
      },
    ],
    validationSchema: step5Schema,
    successKey: "midExams",
  },
  step6: {
    stepKey: "quizExam",
    title: "Upload Quiz Exam Files",
    fileType: "QUIZ-EXAM",
    renamePattern: (courseFileName, index, key) =>
      `${courseFileName}.QUIZ-${index + 1}.${key.toUpperCase()}.pdf`,
    dynamic: true,
    fields: [
      {
        name: "question",
        label: "Quiz Exam Question",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Quiz Exam Question PDF.",
      },
      {
        name: "highest",
        label: "Highest Scoring Script",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Highest Scoring Script PDF.",
      },
      {
        name: "average",
        label: "Average Scoring Script",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Average Scoring Script PDF.",
      },
      {
        name: "marginal",
        label: "Marginally Passed Script",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Marginally Passed Script PDF.",
      },
    ],
    validationSchema: step6Schema,
    successKey: "quizExams",
  },
  step7: {
    stepKey: "finalExam",
    title: "Upload Final Exam Files",
    fileType: "FINAL-EXAM",
    renamePattern: (courseFileName, index, key) =>
      `${courseFileName}.FinalExam-${key.toUpperCase()}.pdf`,
    fields: [
      {
        name: "question",
        label: "Final Exam Question",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Final Exam Question PDF.",
      },
      {
        name: "highest",
        label: "Highest Scoring Script",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Highest Scoring Script PDF.",
      },
      {
        name: "average",
        label: "Average Scoring Script",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Average Scoring Script PDF.",
      },
      {
        name: "marginal",
        label: "Marginally Passed Script",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Upload the Marginally Passed Script PDF.",
      },
    ],
    validationSchema: step7Schema,
    successKey: "finalExam",
  },
  step8: {
    stepKey: "assignment",
    title: "Upload Assignment",
    fileType: "ASSIGNMENT",
    renamePattern: (courseFileName) => `${courseFileName}.ASSIGNMENT.pdf`,
    fields: [
      {
        name: "file",
        label: "Assignment (PDF)",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Please upload the Assignment PDF.",
      },
    ],
    validationSchema: step8Schema,
    successKey: "assignment",
  },
  step9: {
    stepKey: "lab",
    title: "Upload Lab Files",
    fileType: "LAB",
    renamePattern: (courseFileName) => `${courseFileName}.LAB.pdf`,
    fields: [
      {
        name: "file",
        label: "Lab Files (PDF)",
        accept: "application/pdf",
        maxFiles: 1,
        type: "file",
        helperText: "Please upload the Lab Files PDF.",
      },
    ],
    validationSchema: step9Schema,
    successKey: "lab",
  },
};
