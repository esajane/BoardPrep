import React, { useEffect } from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import "../styles/activitydetails.scss";
import { dueDateify } from "../functions";
import Attachment from "./Attachment";
import { MdAttachFile } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";
import SmallAttachmentModal from "./SmallAttachmentModal";
import axios from "axios";
import SubmissionsModal from "./SubmissionsModal";

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

interface Submission {
  id: number;
  submission_text: string;
  activity: number;
  student: string;
  student_name: string;
  submission_date: string;
  score: number;
  is_returned: boolean;
  feedback: string;
  attachments: number[];
  attachments_details: Attachments[];
}

interface ActivityDetailsProps {
  activityDetails: Activity;
  setActivityDetails: React.Dispatch<
    React.SetStateAction<Activity | undefined>
  >;
}

function ActivityDetails({
  activityDetails,
  setActivityDetails,
}: ActivityDetailsProps) {
  const user = useAppSelector(selectUser);
  const [modal, setModalOpen] = React.useState(false);
  const [submissionModalOpen, setSubmissionModalOpen] = React.useState(false);
  const [isFile, setIsFile] = React.useState(false);
  const [attachments, setAttachments] = React.useState<Attachments[]>(
    activityDetails.attachments_details
  );
  const [subAttachments, setSubAttachments] = React.useState<Attachments[]>([]);
  const [submissions, setSubmissions] = React.useState<Submission[]>([]);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [studSubmission, setStudSubmission] = React.useState<Submission>();
  const statusColor =
    activityDetails.status === "In Progress"
      ? "orange"
      : activityDetails.status === "Completed"
      ? "#00d15e"
      : "grey";

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/submissions/?${
            user.token.type === "T" ? "activity_id" : "student_id"
          }=${user.token.type === "T" ? activityDetails.id : user.token.id}`
        );
        setSubmissions(response.data);
        response.data.forEach((submission: Submission) => {
          if (submission.activity === activityDetails.id) {
            setIsSubmitted(true);
            setSubAttachments(submission.attachments_details);
            setStudSubmission(submission);
          }
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubmissions();
  }, []);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openSubmissionModal = () => {
    setSubmissionModalOpen(true);
  };

  const closeSubmissionModal = () => {
    setSubmissionModalOpen(false);
  };

  const handleBackClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setActivityDetails(undefined);
  };

  const handleModalClick = (
    e: React.MouseEvent<HTMLElement>,
    open: boolean
  ) => {
    e.stopPropagation();
    if (isSubmitted || activityDetails.status === "Completed") return;
    setIsFile(open);
    openModal();
  };

  const submitActivity = async () => {
    try {
      const attachs = subAttachments.map((attachment) => attachment.id);
      const response = await axios.post("http://127.0.0.1:8000/submissions/", {
        submission_text: "test",
        activity: activityDetails.id,
        student: user.token.id,
        attachments: attachs,
      });
      setSubmissions([...submissions, response.data]);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (user.token.type === "T") {
      openSubmissionModal();
    } else {
      submitActivity();
    }
  };

  return (
    <div className="activity-details">
      <div className="activity-details--header">
        <div
          className="activity-details--header__left"
          onClick={handleBackClick}
        >
          <IoChevronBackOutline />
          <div className="activity-details--header__left--back">Back</div>
        </div>
        <button
          className="activity-details--header__button"
          onClick={handleSubmitClick}
          disabled={
            user.token.type === "S" &&
            (isSubmitted || activityDetails.status === "Completed")
          }
        >
          {user.token.type === "T"
            ? "See Submissions"
            : isSubmitted
            ? "Submitted"
            : "Submit"}
        </button>
      </div>
      <div className="activity-details--title">
        <div className="flexify">
          <h2>{activityDetails.title}</h2>{" "}
          <span className="status" style={{ backgroundColor: statusColor }}>
            {activityDetails.status}
          </span>
        </div>
        <div className="due_date">
          Due {dueDateify(activityDetails.due_date)}
        </div>
      </div>
      <div className="activity-details--instructions">
        <div className="subheader">Instructions</div>
        <div className="activity-details--instructions__content">
          {activityDetails.content}
        </div>
      </div>
      <div className="activity-details--attachments">
        {activityDetails.attachments_details.length > 0 && (
          <>
            <div className="subheader">Attachments</div>
            {attachments.map((attachment) => (
              <Attachment
                key={attachment.id}
                attachment={attachment}
                setAttachments={setAttachments}
              />
            ))}
          </>
        )}
      </div>
      {user.token.type === "S" && (
        <div className="activity-details--work-area">
          <div className="subheader">Work Area</div>
          {subAttachments.map((attachment) => (
            <Attachment
              key={attachment.id}
              attachment={attachment}
              setAttachments={setAttachments}
            />
          ))}
          <div
            className="attach-file"
            onClick={(e) => handleModalClick(e, true)}
          >
            <MdAttachFile />
            Add Attachment
          </div>
          <div
            className="attach-link"
            onClick={(e) => handleModalClick(e, false)}
          >
            <GoPlus /> Add Link
          </div>
          {modal && (
            <SmallAttachmentModal
              closeModal={closeModal}
              setSubAttachments={setSubAttachments}
              isFile={isFile}
            />
          )}
        </div>
      )}
      {submissionModalOpen && (
        <SubmissionsModal
          closeSubmissionModal={closeSubmissionModal}
          activityPoints={activityDetails.points}
          submissions={submissions}
          setSubmissions={setSubmissions}
        />
      )}
      <div className="activity-details--points">
        <div className="subheader">Points</div>
        {user.token.type === "S" &&
          isSubmitted &&
          studSubmission?.score + " / "}
        {activityDetails.points > 0 ? activityDetails.points : "No"} points
      </div>
      {user.token.type === "S" &&
        isSubmitted &&
        studSubmission?.feedback &&
        studSubmission.feedback !== "" && (
          <div className="activity-details--points">
            <div className="subheader">Feedback</div>
            {studSubmission.feedback}
          </div>
        )}
    </div>
  );
}

export default ActivityDetails;
