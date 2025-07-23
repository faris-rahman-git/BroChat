import { AllUsersType } from '@bro/shared';

function DetailsModalContent({ rowData }: { rowData: AllUsersType }) {
  return (
    <div className="flex flex-col gap-4 py-4 text-sm">
      {/* Avatar and Name */}
      <div className="flex items-center gap-4">
        <img
          src={rowData.avatar}
          alt="User Avatar"
          className="w-14 h-14 rounded-[6px] object-cover border"
        />
        <div>
          <p className="font-semibold text-base">{rowData.name}</p>
          <p className="text-gray-500">@{rowData.username}</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div className="break-words">
          <strong>Email:</strong> {rowData.email || '—'}
        </div>
        <div>
          <strong>Phone:</strong> {rowData.phoneNumber || '—'}
        </div>
        <div>
          <strong>Blocked:</strong>{' '}
          <span
            className={rowData.isBlocked ? 'text-red-600' : 'text-green-600'}
          >
            {rowData.isBlocked ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <strong>Blocked At:</strong>{' '}
          {rowData.blockedAt
            ? new Date(rowData.blockedAt).toLocaleString()
            : '—'}
        </div>
        <div>
          <strong>Deleted:</strong>{' '}
          <span
            className={rowData.isDeleted ? 'text-red-600' : 'text-green-600'}
          >
            {rowData.isDeleted ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <strong>Deleted At:</strong>{' '}
          {rowData.deletedAt
            ? new Date(rowData.deletedAt).toLocaleString()
            : '—'}
        </div>
        <div>
          <strong>Deleted By:</strong> {rowData.deletedBy || '—'}
        </div>
        <div>
          <strong>Created At:</strong>{' '}
          {rowData.createdAt
            ? new Date(rowData.createdAt).toLocaleString()
            : '—'}
        </div>
      </div>
    </div>
  );
}

export default DetailsModalContent;
