import React, { useRef, useState } from "react";
import "../styles/activitymodal.scss";
import { MdAttachFile } from "react-icons/md";
import axios from "axios";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import Attachment from "./Attachment";

interface ActivityModalProps {
  closeModal: () => void;
  classId: number;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

interface Attachments {
  id: number;
  file: string;
  link: string;
  user: string;
  title: string;
  favicon: string;
}

interface Activity {
  id: number;
  className: string;
  title: string;
  content: string;
  start_date: string;
  due_date: string;
  status: string;
  points: number;
  created_at: string;
  class_instance: number;
  teacher: string;
  attachments_details: Attachments[];
}

function ActivityModal({
  closeModal,
  classId,
  setActivities,
}: ActivityModalProps) {
  const user = useAppSelector(selectUser);
  const [aType, setAType] = useState("file");
  const [file, setFile] = useState<File | null>();
  const [attachments, setAttachments] = useState<Attachments[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const pointsRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createActivity();
  };

  const createActivity = async () => {
    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const start = startRef.current?.value;
    const end = endRef.current?.value;
    const points = pointsRef.current?.value;
    const attachs = attachments.map((attachment) => attachment.id);
    const data = {
      title,
      content: description,
      start_date: start,
      due_date: end,
      status: "Not Started",
      points,
      class_instance: classId,
      teacher: user.token.id,
      attachments: attachs,
    };
    const response = await axios.post(
      "http://127.0.0.1:8000/activities/",
      data
    );
    setActivities((prevActivities) => [...prevActivities, response.data]);
    closeModal();
  };

  const handleChangeAType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAType(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
  };

  const addAttachment = async () => {
    try {
      const formData = new FormData();
      if (aType === "file") {
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
          setAttachments([...attachments, response.data]);
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
        setAttachments([...attachments, response.data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAttachment = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    addAttachment();
  };

  return (
    <div id="modal" className="modal">
      <div className="activity-modal">
        <div className="modal-header">
          <div className="h1">Create Activity</div>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
        </div>
        <form className="activity-form" onSubmit={handleSubmit}>
          <div className="half">
            <div className="left-half">
              <label htmlFor="title">Activity Title</label>
              <input
                type="text"
                id="title"
                placeholder="Activity Title"
                ref={titleRef}
              />
              <label htmlFor="content">Activity Content</label>
              <textarea
                placeholder="Activity Content"
                id="content"
                ref={descriptionRef}
              />
              <label htmlFor="start">Start Date</label>
              <input
                type="text"
                id="start"
                placeholder="Start Date"
                onFocus={(e) => (e.target.type = "datetime-local")}
                onBlur={(e) => (e.target.type = "text")}
                ref={startRef}
              />
            </div>
            <div className="right-half">
              <label htmlFor="end">End Date</label>
              <input
                type="date"
                id="end"
                placeholder="End Date"
                onFocus={(e) => (e.target.type = "datetime-local")}
                onBlur={(e) => (e.target.type = "text")}
                ref={endRef}
              />
              <label htmlFor="points">Points</label>
              <input
                type="number"
                id="points"
                placeholder="Points"
                ref={pointsRef}
              />
              <label htmlFor="attachments">Attachments</label>
              <div id="attachments">
                {attachments.map((attachment) => (
                  <Attachment
                    attachment={attachment}
                    setAttachments={setAttachments}
                  />
                ))}
              </div>
              <div className="radios" onChange={handleChangeAType}>
                <input
                  type="radio"
                  name="attachtype"
                  id="file"
                  value="file"
                  defaultChecked
                />
                <label htmlFor="file">File</label>
                <input type="radio" name="attachtype" id="link" value="link" />
                <label htmlFor="file">Link</label>
              </div>
              {aType === "file" ? (
                <input type="file" id="file" onChange={handleFileChange} />
              ) : (
                <input type="text" id="link" placeholder="Link" ref={linkRef} />
              )}
              <div className="add-attachment" onClick={handleAddAttachment}>
                <MdAttachFile />
                Add Attachment
              </div>
            </div>
          </div>
          <button type="submit">Create Activity</button>
        </form>
      </div>
    </div>
  );
}

export default ActivityModal;
