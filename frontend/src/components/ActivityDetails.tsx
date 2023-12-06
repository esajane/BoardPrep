import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import "../styles/activitydetails.scss";
import { dueDateify } from "../functions";
import Attachment from "./Attachment";

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
  const [attachments, setAttachments] = React.useState<Attachments[]>(
    activityDetails.attachments_details
  );
  const statusColor =
    activityDetails.status === "In Progress"
      ? "orange"
      : activityDetails.status === "Completed"
      ? "#00d15e"
      : "grey";

  const handleBackClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setActivityDetails(undefined);
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
        <button className="activity-details--header__button">Submit</button>
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
      <div className="activity-details--work-area">
        <div className="subheader">My Work</div>
      </div>
      <div className="activity-details--points">
        <div className="subheader">Points</div>
        {activityDetails.points > 0 ? activityDetails.points : "No"} points
      </div>
    </div>
  );
}

export default ActivityDetails;
