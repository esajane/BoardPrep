export const convertToPHTime = (timestamp: string) => {
  const utcDate = new Date(timestamp);
  const phTime = new Date(utcDate.getTime());
  const formattedDate = phTime.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
  });
  const formattedTime = phTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${formattedDate} ${formattedTime}`;
};
