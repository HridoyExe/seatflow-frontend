import authApiClient from "../services/authApiClient";

/**
 * Payment API hook to handle SSL Commerz integration.
 * Includes initiation, success, failure, and cancellation handlers.
 */
const paymentApi = () => {
  
  // 1. Initiate Payment - gets the SSL Commerz gateway URL
  const initiatePayment = async (paymentData) => {
    try {
      // paymentData expects: { amount, orderId, numItems }
      const response = await authApiClient.post("/api/payment/initiate/", paymentData);
      return response.data;
    } catch (error) {
      console.error("Payment Initiation Failed:", error.response?.data || error.message);
      throw error;
    }
  };

  // 2. Acknowledge Payment Success
  const paymentSuccess = async (tranId) => {
    try {
      const response = await authApiClient.post("/api/payment/success/", { tran_id: tranId });
      return response.data;
    } catch (error) {
      console.error("Success Notification Failed:", error.response?.data || error.message);
      throw error;
    }
  };

  // 3. Acknowledge Payment Failure
  const paymentFail = async (tranId) => {
    try {
      const response = await authApiClient.post("/api/payment/fail/", { tran_id: tranId });
      return response.data;
    } catch (error) {
      console.error("Failure Notification Failed:", error.response?.data || error.message);
      throw error;
    }
  };

  // 4. Acknowledge Payment Cancellation
  const paymentCancel = async (tranId) => {
    try {
      const response = await authApiClient.post("/api/payment/cancel/", { tran_id: tranId });
      return response.data;
    } catch (error) {
      console.error("Cancellation Notification Failed:", error.response?.data || error.message);
      throw error;
    }
  };

  return {
    initiatePayment,
    paymentSuccess,
    paymentFail,
    paymentCancel,
  };
};

// Exporting an instance for easy use throughout the app
export default paymentApi();
