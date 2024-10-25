// File: /src/components/ui/Modal.jsx
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { handleViewFile } from "@/lib/utils"; // Make sure the helper is imported

export default function Modal({ isOpen, onClose, title, examFiles }) {
  // Helper to filter final exam keys (only show relevant keys)
  const filterFinalExamKeys = (examObject) => {
    const relevantKeys = ["question", "highest", "average", "marginal"];
    return Object.keys(examObject)
      .filter((key) => relevantKeys.includes(key) && examObject[key])
      .reduce((obj, key) => {
        obj[key] = examObject[key];
        return obj;
      }, {});
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  {title}
                </Dialog.Title>
                <div className="mt-4">
                  {/* Check if examFiles is an array (for Mid/Quiz exams) */}
                  {Array.isArray(examFiles) ? (
                    <ul>
                      {examFiles.map((exam, index) => (
                        <Fragment key={index}>
                          <li>
                            <a
                              href="#"
                              onClick={() => handleViewFile(exam.question)}
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {exam.question.split("/").pop()}
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              onClick={() => handleViewFile(exam.highest)}
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {exam.highest.split("/").pop()}
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              onClick={() => handleViewFile(exam.average)}
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {exam.average.split("/").pop()}
                            </a>
                          </li>
                          <li>
                            <a
                              href="#"
                              onClick={() => handleViewFile(exam.marginal)}
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              {exam.marginal.split("/").pop()}
                            </a>
                          </li>
                        </Fragment>
                      ))}
                    </ul>
                  ) : (
                    // Handle Final Exam: examFiles is an object
                    <ul>
                      {Object.entries(filterFinalExamKeys(examFiles)).map(
                        ([key, value], index) => {
                          // Extract the actual filename from the path
                          const fileName = value.split("/").pop();
                          return (
                            <li key={index}>
                              <a
                                href="#"
                                onClick={() => handleViewFile(value)}
                                className="text-blue-600 underline hover:text-blue-800"
                              >
                                {fileName}
                              </a>
                            </li>
                          );
                        },
                      )}
                    </ul>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200"
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
