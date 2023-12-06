import axios from "axios";
import React, { useState, useRef } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import "../styles/smallattachmentmodal.scss";

interface SmallAttachmentModalProps {
  closeModal: () => void;
  setSubAttachments: React.Dispatch<React.SetStateAction<any[]>>;
  isFile: boolean;
}

function SmallAttachmentModal({
  closeModal,
  setSubAttachments,
  isFile,
}: SmallAttachmentModalProps) {
  const user = useAppSelector(selectUser);
  const [file, setFile] = useState<File | null>();
  const linkRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const addAttachment = async () => {
    try {
      const formData = new FormData();
      if (isFile) {
        if (file) {
          formData.append("file", file);
          formData.append("user", user.token.id);
          const response = await axios.post(
            "http://127.0.0.1:8000/attachments/",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
          setSubAttachments((prevAttachments) => [
            ...prevAttachments,
            response.data,
          ]);
        }
      } else {
        formData.append("link", linkRef.current?.value as string);
        formData.append("user", user.token.id);
        const response = await axios.post(
          "http://127.0.0.1:8000/attachments/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setSubAttachments((prevAttachments) => [
          ...prevAttachments,
          response.data,
        ]);
      }
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAttachment();
  };
  return (
    <div id="modal" className="modal">
      <div className="attachment-modal">
        <div className="modal-header">
          <div className="h1">Attach {isFile ? "File" : "Link"}</div>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
        </div>
        <form className="activity-form" onSubmit={handleSubmit}>
          <div className="half">
            <div className="right-half">
              {isFile ? (
                <input type="file" id="file" onChange={handleFileChange} />
              ) : (
                <input type="text" id="link" placeholder="Link" ref={linkRef} />
              )}
            </div>
          </div>
          <button type="submit">Attach {isFile ? "File" : "Link"}</button>
        </form>
      </div>
    </div>
  );
}

export default SmallAttachmentModal;
