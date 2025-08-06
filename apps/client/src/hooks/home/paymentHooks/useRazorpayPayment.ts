import api from '@client/configs/axios';
import { VerifyInType } from '@bro/shared';
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
  const startPayment = async ({
    amount,
    feature,
    recipientName,
    recipientEmail,
    userId,
    conversationId,
  }: Omit<VerifyInType, 'paymentId' | 'orderId' | 'signature'>) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
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
          handler: async (response: any) => {
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
              });

              resolve(true);
            } catch (verifyErr) {
              console.error('Verification failed:', verifyErr);
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
              resolve(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      });
    } catch (err) {
      console.error('Razorpay error:', err);
      return false;
    }
  };

  return { startPayment };
}
