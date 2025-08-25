import { ExclusiveUserPaymentsType } from '@bro/shared';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@client/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@client/components/ui/table';
import ConfirmActionButton from '@client/components/customUi/commonElemets/ConfirmActionButton';
import { LuMenu } from 'react-icons/lu';

type Props = {
  transaction: ExclusiveUserPaymentsType;
};

export default function ExclusiveDetailsModalContent({ transaction }: Props) {
  return (
    <div className="space-y-6">
      {/* Top summary card */}
      <Card>
        <CardHeader>
          <CardTitle>Exclusive User Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2">
          <div>
            <strong>Name:</strong> {transaction.exclusiveUser?.name}
          </div>
          <div>
            <strong>UserName:</strong> {transaction.exclusiveUser?.username}
          </div>
          <div>
            <strong>Total Customers:</strong> {transaction.totalCustomers}
          </div>
          <div>
            <strong>Total Amount:</strong> ₹{transaction.totalAmount}
          </div>
          <div>
            <strong>User Share:</strong> ₹{transaction.userShare}
          </div>
          <div>
            <strong>Admin Share:</strong> ₹{transaction.adminShare}
          </div>
        </CardContent>
      </Card>

      {/* Customers table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>User Share</TableHead>
                <TableHead>Admin Share</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction.customers.map((cust, index) => (
                <TableRow key={cust.paymentId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{cust.recipientName}</TableCell>
                  <TableCell>{cust.paymentId}</TableCell>
                  <TableCell>₹{cust.amount}</TableCell>
                  <TableCell>₹{cust.userShare}</TableCell>
                  <TableCell>₹{cust.adminShare}</TableCell>
                  <TableCell>
                    <ConfirmActionButton
                      buttonIcon={LuMenu}
                      buttonClassName="bg-blue-700 hover:bg-blue-800"
                      buttonContent="Details"
                      modalTitle={`Customer Payment Details`}
                      dialogClassName="sm:max-w-[600px]"
                      isConfirmButtonDisabled={true}
                      onConfirm={() => {}}
                    >
                      <div className="space-y-2">
                        <div>
                          <strong>Name:</strong> {cust.recipientName}
                        </div>
                        <div>
                          <strong>Email:</strong> {cust.recipientEmail}
                        </div>
                        <div>
                          <strong>Order ID:</strong> {cust.orderId}
                        </div>
                        <div>
                          <strong>Payment ID:</strong> {cust.paymentId}
                        </div>
                        <div>
                          <strong>Amount:</strong> ₹{cust.amount}
                        </div>
                        <div>
                          <strong>User Share:</strong> ₹{cust.userShare}
                        </div>
                        <div>
                          <strong>Admin Share:</strong> ₹{cust.adminShare}
                        </div>
                        <div>
                          <strong>Date:</strong>{' '}
                          {new Date(cust.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </ConfirmActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
