import api from '@client/configs/axios';
import { VerifyInType } from '@bro/shared';
import { useSelector } from 'react-redux';
import { RootState } from '@client/redux/store';
import { useAppDispatch } from '@client/hooks/commonHooks/useAppDispatch';
import {
  setPaymentInProgress,
  setPaymentNotInProgress,
} from '@client/redux/features/userSlices/homeSlices/paymentSlice/paymentWindowSlice';
import { toast } from 'react-toastify';
const PAYMENT_API = '/user/payment';

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function useRazorpayPayment() {
  const isPaymentInProgress = useSelector(
    (state: RootState) => state.paymentWindow.inProgress
  );
  const dispatch = useAppDispatch();

  const startPayment = async ({
    amount,
    feature,
    recipientName,
    recipientEmail,
    userId,
    conversationId,
    planName,
    duration,
    exclusiveUserId,
  }: Omit<VerifyInType, 'paymentId' | 'orderId' | 'signature'>) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      return false;
    }

    if (isPaymentInProgress) {
      toast.error('Payment already in progress Please wait.');
      return false;
    }

    try {
      // Step 1: Create order
      const { data } = await api.post(PAYMENT_API + '/createorder', {
        amount,
      });

      const order = data.order;

      // Step 2: Return a promise that resolves after Razorpay result
      return new Promise((resolve) => {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY || '',
          amount: order.amount,
          currency: order.currency,
          name: 'BroChat Payment',
          description: `Unlock access to ${feature}`,
          order_id: order.id,
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // Step 3: Verify on backend
              await api.post(PAYMENT_API + '/verify', {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                feature,
                amount,
                recipientName,
                recipientEmail,
                userId,
                conversationId,
                planName,
                duration,
                exclusiveUserId,
              });

              dispatch(setPaymentNotInProgress());
              resolve(true);
            } catch (verifyErr) {
              console.error('Verification failed:', verifyErr);
              dispatch(setPaymentNotInProgress());
              resolve(false);
            }
          },
          prefill: {
            name: recipientName,
            email: recipientEmail,
          },
          theme: { color: '#3399cc' },
          modal: {
            ondismiss: () => {
              dispatch(setPaymentNotInProgress());
              resolve(false);
            },
          },
        };
        dispatch(setPaymentInProgress());

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      });
    } catch (err) {
      console.error('Razorpay error:', err);
      dispatch(setPaymentNotInProgress());
      return false;
    }
  };

  return { startPayment };
}
