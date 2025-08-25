import { TransactionsArrayType } from '@client/types/profileType/TransactionsType';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import React from 'react';

function TransactionsTab({
  transactions,
}: {
  transactions: TransactionsArrayType;
}) {
  return (
    <div className="w-full px-2 text-sm text-gray-700 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Payment Transactions</h2>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white shadow-sm border rounded-md p-4 flex flex-col items-start">
          <p className="text-xs text-gray-500">Total Amount</p>
          <p className="text-lg font-semibold text-green-600">
            ₹{transactions.totalAmount}
          </p>
        </div>
        <div className="bg-white shadow-sm border rounded-md p-4 flex flex-col items-start">
          <p className="text-xs text-gray-500">Total Users</p>
          <p className="text-lg font-semibold">{transactions.totalCount}</p>
        </div>
      </div>

      {transactions.list.length === 0 ? (
        <p className="text-gray-500">No transactions found.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {transactions.list.map((tx) => (
            <div
              key={tx.createdAt.toString()}
              className="flex items-center justify-between border p-3 rounded-md bg-white shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-[45px] rounded-[6px] overflow-hidden flex justify-center items-center bg-[#c9c9c9]">
                  <AvatarImage
                    src={tx.userDetails.avatar}
                    alt={tx.userDetails.name}
                    className="object-cover size-full"
                  />
                  <AvatarFallback className="text-center">
                    {tx.userDetails.name.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{tx.userDetails.name}</p>
                  <p className="text-xs text-gray-500">
                    @{tx.userDetails.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="font-semibold text-green-600">₹{tx.amount}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(TransactionsTab);
