export function convertTimestamp(timestamp: number): number {
  console.log("timestamp", timestamp);
  const date = new Date(timestamp);

  const offset = 7 * 60; // Múi giờ UTC+7
  const localDate = new Date(date.getTime() + offset * 60 * 1000);

  console.log("Local Date:", localDate);

  const convertToTimestamp = localDate.getTime();
  console.log("convertToTimestamp", convertToTimestamp);
  return convertToTimestamp;
}
