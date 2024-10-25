// File: /src/components/ui/table/TableModal.jsx

export default function TableModal({ examFiles, closeModal, title }) {
  return (
    <div className="modal fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <ul className="list-disc ml-5">
          {examFiles.map((file, index) => (
            <li key={index}>
              <a href={file.path} className="text-blue-600 hover:text-blue-800">
                {file.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          onClick={closeModal}
          className="mt-4 text-red-600 hover:text-red-800"
        >
          Close
        </button>
      </div>
    </div>
  );
}
