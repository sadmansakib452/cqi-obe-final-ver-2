// File: /courseFiles/_components/services/courseService.js

import offeredCourses from "../data/offeredCourses.json";
import formConfig from "../config/formConfig.json"
/**
 * Fetches offered courses.
 *
 * @returns {Promise<Object>} A promise that resolves to the offered courses data.
 */
export const fetchOfferedCourses = () => {
  return new Promise((resolve, reject) => {
    try {
      if (formConfig.dataFetch.useAPI) {
        // Implement actual API call here
        fetch(formConfig.dataFetch.endpoints.semester)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => resolve(data))
          .catch((error) => reject(error));
      } else {
        // Use local data without delay
        resolve(offeredCourses);
      }
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Fetches courses based on department and semester.
 *
 * @param {string} department - The selected department.
 * @param {string} semester - The selected semester.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of course names.
 */
export const fetchCoursesByDepartmentAndSemester = (department, semester) => {
  return new Promise((resolve, reject) => {
    try {
      // Map semester to JSON key
      const semesterKey = mapSemesterToKey(semester);
      if (!semesterKey || !offeredCourses[semesterKey]) {
        resolve([]);
        return;
      }

      // Filter courses based on department
      const filteredCourses = offeredCourses[semesterKey]
        .filter((course) => course["Dedicated department"] === department)
        .map((course) => generateCourseFileName(course, semester));

      resolve(filteredCourses);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Generates a course file name based on course details and semester.
 *
 * @param {Object} course - The course object.
 * @param {string} semester - The semester string.
 * @returns {string} The generated course file name.
 */
export const generateCourseFileName = (course, semester) => {
  const [season, yearSuffix] = semester.split("-");
  const year =
    parseInt(yearSuffix, 10) >= 50 ? `${yearSuffix}` : `20${yearSuffix}`;
  const semesterNumber = getSemesterNumber(season);

  // Ensure section is a number
  const sectionNumber = Number.isInteger(course.Section)
    ? course.Section
    : parseInt(course.Section, 10);

  const courseFileName = `${year}.${semesterNumber}.${course.Course}-${sectionNumber}`;

  return courseFileName;
};

/**
 * Maps the semester name to a JSON key.
 *
 * @param {string} semester - The semester string (e.g., "Fall-2024").
 * @returns {string} The mapped semester key (e.g., "fall-24").
 */
const mapSemesterToKey = (semester) => {
  const [season, year] = semester.split("-");
  const yearSuffix = year.slice(-2);
  return `${season.toLowerCase()}-${yearSuffix}`;
};

/**
 * Returns the semester number based on the season.
 *
 * @param {string} season - The season string (e.g., "Fall").
 * @returns {number} The semester number.
 */
const getSemesterNumber = (season) => {
  const mapping = {
    Fall: 1,
    Spring: 2,
    Summer: 3,
  };
  return mapping[season] || 0;
};
