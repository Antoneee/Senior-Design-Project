export default function DateTimeParser(timeStr) {
  const [hour, minute] = timeStr.split(":");
  const now = new Date(); // Use the current date or set a specific date as needed
  now.setHours(parseInt(hour, 10));
  now.setMinutes(parseInt(minute, 10));
  now.setSeconds(0); // Optionally set seconds to 0
  return now;
}
