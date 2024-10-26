// File: /src/components/ui/Modal.jsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { handleViewFile } from "@/lib/utils"; // Make sure the helper is imported

const filterFinalExamKeys = (examObject) => {
  const relevantKeys = ["question", "highest", "average", "marginal"];
  return Object.keys(examObject)
    .filter((key) => relevantKeys.includes(key) && examObject[key])
    .reduce((obj, key) => {
      obj[key] = examObject[key];
      return obj;
    }, {});
};

const extractExamLabel = (fileName) => {
  const midPattern = /MID-(\d+)/;
  const quizPattern = /QUIZ-(\d+)/;
  const midMatch = fileName.match(midPattern);
  const quizMatch = fileName.match(quizPattern);

  if (midMatch) {
    return `Mid Exam ${midMatch[1]}`;
  }
  if (quizMatch) {
    return `Quiz Exam ${quizMatch[1]}`;
  }
  return "Exam";
};

export default function Modal({ isOpen, onClose, title, examFiles }) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        {/* Centered Modal */}
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                >
                  {title}
                </Dialog.Title>

                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full table-auto border border-gray-300 dark:border-gray-700">
                    <thead className="bg-gray-100 dark:bg-zinc-800">
                      <tr>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                          Exam
                        </th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                          Question
                        </th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                          Highest
                        </th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                          Average
                        </th>
                        <th className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-400">
                          Marginal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(examFiles) ? (
                        examFiles.map((exam, index) => (
                          <tr
                            key={index}
                            className={`${
                              index % 2 === 0
                                ? "bg-gray-100 dark:bg-zinc-800"
                                : "bg-white dark:bg-zinc-700"
                            }`}
                          >
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white">
                              {extractExamLabel(exam.question)}
                            </td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              <a
                                href="#"
                                onClick={() => handleViewFile(exam.question)}
                              >
                                View File
                              </a>
                            </td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              <a
                                href="#"
                                onClick={() => handleViewFile(exam.highest)}
                              >
                                View File
                              </a>
                            </td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              <a
                                href="#"
                                onClick={() => handleViewFile(exam.average)}
                              >
                                View File
                              </a>
                            </td>
                            <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                              <a
                                href="#"
                                onClick={() => handleViewFile(exam.marginal)}
                              >
                                View File
                              </a>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-gray-100 dark:bg-zinc-800">
                          <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-gray-900 dark:text-white">
                            Final Exam
                          </td>
                          {Object.entries(filterFinalExamKeys(examFiles)).map(
                            ([key, value], index) => (
                              <td
                                key={index}
                                className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                              >
                                <a
                                  href="#"
                                  onClick={() => handleViewFile(value)}
                                >
                                  View File
                                </a>
                              </td>
                            ),
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 dark:bg-blue-500 px-4 py-2 text-sm font-medium text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-600"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
