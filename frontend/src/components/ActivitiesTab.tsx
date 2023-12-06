import React, { useEffect, useState } from "react";
import "../styles/activitiestab.scss";
import axios from "axios";
import ActivityRow from "./ActivityRow";
import ActivityDetails from "./ActivityDetails";
import { IoCreateOutline } from "react-icons/io5";
import ActivityModal from "./ActivityModal";
import { useAppSelector } from "../redux/hooks";
import { selectUser } from "../redux/slices/authSlice";

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

interface ActivitiesTabProps {
  classId: number;
}

function ActivitiesTab({ classId }: ActivitiesTabProps) {
  const user = useAppSelector(selectUser);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityDetails, setActivityDetails] = useState<Activity>();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/activities/?class_id=${classId}`
        );
        setActivities(await response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchActivities();
  }, [classId]);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="activities-tab">
      <div className="activities-tab--center">
        {activityDetails ? (
          <ActivityDetails
            activityDetails={activityDetails}
            setActivityDetails={setActivityDetails}
          />
        ) : activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityRow
              key={activity.id}
              activity={activity}
              setActivityDetails={setActivityDetails}
            />
          ))
        ) : (
          <div>No activities yet.</div>
        )}
        {!activityDetails && user.token.type === "T" && (
          <button className="activities-tab--center--add" onClick={openModal}>
            <IoCreateOutline />
            Create Activity
          </button>
        )}
        {modalOpen && (
          <ActivityModal
            classId={classId}
            closeModal={closeModal}
            setActivities={setActivities}
          />
        )}
      </div>
    </div>
  );
}

export default ActivitiesTab;
