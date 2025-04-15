
// Update the AttendanceRecords component to use the correct userMetadata property
import { useUserMetadata } from "@/hooks/use-user-metadata";

export const AttendanceRecords = ({ siteId }: { siteId?: number }) => {
  // Replace the problematic line
  const { userMetadata } = useUserMetadata();
  const parsedMetadata = userMetadata ? JSON.parse(userMetadata) : null;

  return (
    <div>
      <h2>Attendance Records</h2>
      {siteId && <p>Site ID: {siteId}</p>}
      {parsedMetadata && (
        <pre>{JSON.stringify(parsedMetadata, null, 2)}</pre>
      )}
    </div>
  );
};

export default AttendanceRecords;
