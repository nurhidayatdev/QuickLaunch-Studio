import { NextResponse } from "next/server";
import { PAYMENT_PACKAGES, getDynamicPaymentConfig } from "@/lib/payment-config";

export async function GET() {
  const { paymentMethods, adminContact } = await getDynamicPaymentConfig();
  return NextResponse.json({
    packages: PAYMENT_PACKAGES,
    paymentMethods,
    adminContact,
  });
}

