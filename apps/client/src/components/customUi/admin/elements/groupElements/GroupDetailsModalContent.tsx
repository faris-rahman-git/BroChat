import { DeleteGroupsReturnType, GroupChatType } from '@bro/shared';

function GroupDetailsModalContent({
  group,
}: {
  group: GroupChatType | DeleteGroupsReturnType;
}) {
  const isAdmin = (userId: string) => group.Admins.includes(userId);

  return (
    <div className="flex flex-col gap-4 py-4 text-sm">
      {/* Group Avatar & Name */}
      <div className="flex items-center gap-4">
        <img
          src={group.avatar || '/default-group-avatar.png'}
          alt="Group Avatar"
          className="w-14 h-14 rounded-[6px] object-cover border"
        />
        <div>
          <p className="font-semibold text-base">{group.groupName || '—'}</p>
          <p className="text-gray-500 text-sm">
            {group.about || 'No description'}
          </p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
        <div>
          <strong>Created At:</strong>{' '}
          {group.createdAt ? new Date(group.createdAt).toLocaleString() : '—'}
        </div>
        <div>
          <strong>Paid Group:</strong>{' '}
          <span className={group.isPaid ? 'text-green-600' : 'text-gray-600'}>
            {group.isPaid ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <strong>Blocked:</strong>{' '}
          <span className={group.isBlocked ? 'text-red-600' : 'text-green-600'}>
            {group.isBlocked ? 'Yes' : 'No'}
          </span>
        </div>
        <div>
          <strong>Blocked At:</strong>{' '}
          {group.blockedAt ? new Date(group.blockedAt).toLocaleString() : '—'}
        </div>

        {'isDeleted' in group && (
          <>
            <div>
              <strong>Deleted:</strong>{' '}
              <span
                className={group.isDeleted ? 'text-red-600' : 'text-green-600'}
              >
                {group.isDeleted ? 'Yes' : 'No'}
              </span>
            </div>
            <div>
              <strong>Deleted At:</strong>{' '}
              {group.deletedAt
                ? new Date(group.deletedAt).toLocaleString()
                : '—'}
            </div>
          </>
        )}

        <div>
          <strong>Total Participants:</strong> {group.participants.length}
        </div>
        <div>
          <strong>Total Admins:</strong> {group.Admins.length}
        </div>
      </div>

      {/* Creator Info */}
      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold text-base mb-2">Created By</h4>
        <div className="flex items-center gap-3">
          <img
            src={group.createdBy.avatar}
            alt={group.createdBy.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium">{group.createdBy.name}</p>
            <p className="text-gray-500 text-xs">@{group.createdBy.username}</p>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="mt-6 border-t pt-4">
        <h4 className="font-semibold text-base mb-2">Participants</h4>
        <ul className="space-y-2 max-h-52 overflow-y-auto pr-2">
          {group.participants.map((user) => (
            <li key={user._id} className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <span className="font-medium flex items-center gap-2">
                  {user.name}
                  {isAdmin(user._id) && (
                    <span className="text-xs px-2 py-[2px] rounded bg-yellow-100 text-yellow-800 border border-yellow-300">
                      Admin
                    </span>
                  )}
                </span>
                <span className="text-gray-500 text-xs">@{user.username}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default GroupDetailsModalContent;
