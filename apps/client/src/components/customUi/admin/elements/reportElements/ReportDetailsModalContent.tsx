import { ReportResponse } from '@bro/shared';

function ReportDetailsModalContent({
  report,
  isShowActions = false,
}: {
  report: ReportResponse;
  isShowActions?: boolean;
}) {
  console.log(report);

  return (
    <div className="flex flex-col gap-4 py-4 text-sm">
      {/* Reporter Info */}
      <div>
        <h2 className="text-base font-semibold mb-2">Reporter</h2>
        <div className="bg-gray-50 border rounded p-3">
          <p>
            <strong>Username:</strong> @{report.reporterId.username}
          </p>
          <p>
            <strong>User ID:</strong> {report.reporterId._id}
          </p>
        </div>
      </div>

      {/* Reported User Info */}
      <div>
        <h2 className="text-base font-semibold mb-2">Reported User</h2>
        <div className="bg-gray-50 border rounded p-3">
          <p>
            <strong>Username:</strong> @{report.reportedUserId.username}
          </p>
          <p>
            <strong>User ID:</strong> {report.reportedUserId._id}
          </p>
          <p>
            <strong>Blocked:</strong>{' '}
            <span
              className={
                report.reportedUserId.isBlocked
                  ? 'text-red-600'
                  : 'text-green-600'
              }
            >
              {report.reportedUserId.isBlocked ? 'Yes' : 'No'}
            </span>
          </p>
          <p>
            <strong>Deleted:</strong>{' '}
            <span
              className={
                report.reportedUserId.isDeleted
                  ? 'text-red-600'
                  : 'text-green-600'
              }
            >
              {report.reportedUserId.isDeleted ? 'Yes' : 'No'}
            </span>
          </p>
        </div>
      </div>

      {/* Report Details */}
      <div>
        <h2 className="text-base font-semibold mb-2">Report Details</h2>
        <div className="bg-gray-50 border rounded p-3">
          <p>
            <strong>Reason:</strong> {report.reason}
          </p>
          <p>
            <strong>Conversation ID:</strong> {report.conversationId || '—'}
          </p>
          <p>
            <strong>Reported At:</strong>{' '}
            {new Date(report.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Action Details */}
      {isShowActions && (
        <div>
          <h2 className="text-base font-semibold mb-2">Report Details</h2>
          <div className="bg-gray-50 border rounded p-3">
            <p>
              <strong>Action Taken:</strong> {report.takenAction}
            </p>
            <p>
              <strong>Action Note:</strong> {report.note || '—'}
            </p>
            <p>
              <strong>Take At: </strong>
              {new Date(report.actionTakeAt!).toLocaleString() || '—'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportDetailsModalContent;
