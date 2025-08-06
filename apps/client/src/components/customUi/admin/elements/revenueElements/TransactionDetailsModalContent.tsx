import { AllTransactionsOutType } from '@bro/shared';

function TransactionDetailsModalContent({
  transaction,
}: {
  transaction: AllTransactionsOutType;
}) {
  return (
    <div className="flex flex-col gap-4 py-4 text-sm">
      {/* User Info */}
      <div>
        <h2 className="text-base font-semibold mb-2">User</h2>
        <div className="bg-gray-50 border rounded p-3">
          <p>
            <strong>User ID:</strong> {transaction.userId || '—'}
          </p>
          <p>
            <strong>Conversation ID:</strong> {transaction.conversationId || '—'}
          </p>
        </div>
      </div>

      {/* Transaction Info */}
      <div>
        <h2 className="text-base font-semibold mb-2">Transaction Info</h2>
        <div className="bg-gray-50 border rounded p-3">
          <p>
            <strong>Feature:</strong> {transaction.feature}
          </p>
          <p>
            <strong>Amount:</strong> ₹{transaction.amount}
          </p>
          <p>
            <strong>Created At:</strong>{' '}
            {new Date(transaction.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Payment Info */}
      <div>
        <h2 className="text-base font-semibold mb-2">Payment Details</h2>
        <div className="bg-gray-50 border rounded p-3">
          <p>
            <strong>Order ID:</strong> {transaction.orderId}
          </p>
          <p>
            <strong>Payment ID:</strong> {transaction.paymentId}
          </p>
          <p>
            <strong>Signature:</strong> {transaction.signature}
          </p>
        </div>
      </div>

      {/* Recipient Info */}
      <div>
        <h2 className="text-base font-semibold mb-2">Recipient</h2>
        <div className="bg-gray-50 border rounded p-3">
          <p>
            <strong>Name:</strong> {transaction.recipientName}
          </p>
          <p>
            <strong>Email:</strong> {transaction.recipientEmail}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TransactionDetailsModalContent;
