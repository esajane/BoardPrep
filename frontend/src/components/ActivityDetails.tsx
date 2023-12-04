import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import "../styles/activitydetails.scss";
import { dueDateify } from "../functions";

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
  attachments: number[];
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
        <h2>{activityDetails.title}</h2>
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
        <div className="subheader">Attachments</div>
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
