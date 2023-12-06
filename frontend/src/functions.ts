export const convertToPHTime = (
  timestamp: string,
  withYear: boolean = false
) => {
  const utcDate = new Date(timestamp);
  const phTime = new Date(utcDate.getTime());
  const formattedDate = phTime.toLocaleDateString("en-US", {
    month: withYear ? "long" : "2-digit",
    day: "2-digit",
    year: withYear ? "numeric" : undefined,
  });
  const formattedTime = phTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} ${formattedTime}`;
};

export const dueDateify = (time: string) => {
  const currentDate = new Date();
  const dueDate = new Date(time);
  const daysLeft = Math.floor(
    (dueDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24)
  );
  if (daysLeft >= -1 && daysLeft <= 1) {
    let due = "";

    if (daysLeft === -1) {
      due = "yesterday";
    } else if (daysLeft === 0) {
      due = "today";
    } else if (daysLeft === 1) {
      due = "tomorrow";
    }

    return (
      due +
      " at " +
      dueDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  } else {
    return convertToPHTime(time, true);
  }
};
