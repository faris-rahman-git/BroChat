import { Button } from '@client/components/ui/button';
import React from 'react';

function HelpTab({
  setOpenDeleteModal,
}: {
  setOpenDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div className="w-full px-2 text-sm text-gray-700 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Help & Support</h2>

      <div>
        <p className="mb-2">
          Welcome to BroChat support. If you have any questions or issues using
          the app, check the information below or reach out to our support team.
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>
            Make sure your app is up to date for the latest features and
            security.
          </li>
          <li>Your chats are encrypted and private.</li>
          <li>Having trouble logging in? Try resetting your password.</li>
          <li>
            For technical support, email us at{' '}
            <strong>support@brochat.app</strong>.
          </li>
        </ul>
      </div>

      <div className="mt-6 border-t pt-4">
        <p className="text-xs text-gray-500">
          © {new Date().getFullYear()} BroChat. All rights reserved.
        </p>
      </div>

      <div className="mt-6">
        <Button
          variant="destructive"
          className="w-full text-sm"
          onClick={() => setOpenDeleteModal(true)}
        >
          Delete my account permanently
        </Button>
      </div>
    </div>
  );
}

export default React.memo(HelpTab);
