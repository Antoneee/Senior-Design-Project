export function DateToDateTimeParser(timeStr) {
  const [hour, minute] = timeStr.split(":");
  const now = new Date(); // Use the current date or set a specific date as needed
  now.setHours(parseInt(hour, 10));
  now.setMinutes(parseInt(minute, 10));
  now.setSeconds(0); // Optionally set seconds to 0
  return now;
}

export function DateTimeToDateParser(timeStr) {
  const date = new Date(timeStr);
  const formattedDate = date.toISOString().split("T")[0];
  return formattedDate;
}
