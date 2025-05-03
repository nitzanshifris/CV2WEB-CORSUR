import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";
import { showToast } from "./toast-utils";

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "succeeded" | "failed";
  client_secret: string;
}

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export async function createPaymentIntent(
  amount: number,
  currency: string = "ILS"
): Promise<PaymentIntent> {
  try {
    const { data, error } = await supabase.functions.invoke("create-payment-intent", {
      body: { amount, currency },
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
}

export async function confirmPayment(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("confirm-payment", {
      body: { paymentIntentId, paymentMethodId },
    });

    if (error) throw error;

    showToast({
      title: "התשלום בוצע בהצלחה",
      description: "תודה על רכישתך",
      variant: "success",
    });
  } catch (error) {
    console.error("Error confirming payment:", error);
    showToast({
      title: "שגיאה בתשלום",
      description: "אירעה שגיאה בעיבוד התשלום. אנא נסה שוב.",
      variant: "destructive",
    });
    throw error;
  }
}

export async function getPaymentMethods(
  userId: string
): Promise<PaymentMethod[]> {
  try {
    const { data, error } = await supabase.functions.invoke("get-payment-methods", {
      body: { userId },
    });

    if (error) throw error;

    return data;
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    throw error;
  }
}

export async function addPaymentMethod(
  userId: string,
  paymentMethodId: string
): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("add-payment-method", {
      body: { userId, paymentMethodId },
    });

    if (error) throw error;

    showToast({
      title: "אמצעי תשלום נוסף בהצלחה",
      description: "אמצעי התשלום החדש זמין כעת לשימוש",
      variant: "success",
    });
  } catch (error) {
    console.error("Error adding payment method:", error);
    showToast({
      title: "שגיאה בהוספת אמצעי תשלום",
      description: "אירעה שגיאה בהוספת אמצעי התשלום. אנא נסה שוב.",
      variant: "destructive",
    });
    throw error;
  }
}

export async function removePaymentMethod(
  userId: string,
  paymentMethodId: string
): Promise<void> {
  try {
    const { error } = await supabase.functions.invoke("remove-payment-method", {
      body: { userId, paymentMethodId },
    });

    if (error) throw error;

    showToast({
      title: "אמצעי תשלום הוסר",
      description: "אמצעי התשלום הוסר בהצלחה",
      variant: "success",
    });
  } catch (error) {
    console.error("Error removing payment method:", error);
    showToast({
      title: "שגיאה בהסרת אמצעי תשלום",
      description: "אירעה שגיאה בהסרת אמצעי התשלום. אנא נסה שוב.",
      variant: "destructive",
    });
    throw error;
  }
}

export async function getPaymentHistory(
  userId: string,
  limit: number = 10
): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error("Error fetching payment history:", error);
    throw error;
  }
} 