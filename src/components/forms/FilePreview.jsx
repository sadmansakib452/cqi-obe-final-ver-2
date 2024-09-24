import { useState, useRef } from "react";
import Lightbox from "yet-another-react-lightbox";
import {
  HiOutlineExternalLink,
  HiOutlineEye,
  HiOutlinePaperClip,
  HiOutlinePhotograph,
  HiX,
} from "react-icons/hi";
import UnstyledLink from "../UnstyledLink";
import "yet-another-react-lightbox/plugins/captions.css";
import 'yet-another-react-lightbox/styles.css'


export const FilePreview = ({ deleteFile, file, readOnly }) => {
  const captionsRef = useRef(null);
  const fullscreenRef = useRef(null);

  const [index, setIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const images = [file.preview];
  console.log(images)

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteFile?.(e, file);
  };

  const imagesType = ["image/png", "image/jpg", "image/jpeg"];

  return imagesType.includes(file.type) ? (
    <>
      <li
        className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
        key={file.name}
      >
        <div className="flex items-center flex-1 w-0">
          <HiOutlinePhotograph
            className="flex-shrink-0 w-5 h-5 text-gray-400"
            aria-hidden="true"
          />
          <span className="flex-1 w-0 ml-2 truncate">{file.name}</span>
        </div>
        <div className="flex items-center flex-shrink-0 ml-4 space-x-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-block text-xl font-medium text-gray-500 rounded focus:ring focus:ring-primary-500 focus:outline-none hover:text-gray-700"
          >
            <HiOutlineEye />
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={handleDelete}
              className="text-xl font-medium text-red-500 rounded focus:ring focus:ring-red-500 focus:outline-none hover:text-red-700"
            >
              <HiX />
            </button>
          )}
        </div>
      </li>
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={[{
            src: images
          },
        ]}
        />
      )}
    </>
  ) : (
    <li
      key={file.name}
      className="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
    >
      <div className="flex items-center flex-1 w-0">
        <HiOutlinePaperClip
          className="flex-shrink-0 w-5 h-5 text-gray-400"
          aria-hidden="true"
        />
        <span className="flex-1 w-0 ml-2 truncate">{file.name}</span>
      </div>
      <div className="flex items-center flex-shrink-0 ml-4 space-x-2">
        <UnstyledLink
          href={file.preview}
          className="text-gray-500 rounded focus:ring focus:ring-primary-500 focus:outline-none hover:text-gray-700"
        >
          <HiOutlineExternalLink size={20} />
        </UnstyledLink>
        {!readOnly && (
          <button
            className="text-red-500 rounded cursor-pointer hover:text-red-700 focus:ring focus:ring-red-500 focus:outline-none"
            type="button"
            onClick={(e) => deleteFile?.(e, file)}
          >
            <HiX size={24} />
          </button>
        )}
      </div>
    </li>
  );
};
