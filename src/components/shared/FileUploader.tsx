/* eslint-disable react-hooks/exhaustive-deps */
import  { useCallback, useState } from "react";

import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      // Do something with the files
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", "", ".jpeg", ".jpg", ".svg", ".webp"] },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
            <img
              height={300}
              src={fileUrl}
              alt="post-image"
              className="file_uploader-image"
            />
          </div>
          <p className="file_uploader-label">
            Click or drag new photo to replace
          </p>
        </>
      ) : (
        <div className="file_uploader-box">
          <img
            width={96}
            height={77}
            src="/assets/icons/file-upload.svg"
            alt="uploader icon"
          />

          <h3 className="base medium text-light-2 mt-6 mb-2">
            Drag photo here
          </h3>
          <p className="text-light-4 small-regular">SVP, PNG, JPG</p>
          <Button className="shad-button_dark_4 mt-12">
            Select from your device
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
