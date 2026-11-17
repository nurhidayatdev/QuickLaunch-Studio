import { NextResponse } from "next/server";
import { PAYMENT_PACKAGES, getDynamicPaymentConfig } from "@/lib/payment-config";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const { paymentMethods, adminContact } = await getDynamicPaymentConfig();
  return NextResponse.json(
    {
      packages: PAYMENT_PACKAGES,
      paymentMethods,
      adminContact,
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}


