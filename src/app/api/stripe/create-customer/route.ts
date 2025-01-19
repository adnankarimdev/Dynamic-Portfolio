import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { email, userId } = await req.json();

    const customer = await stripe.customers.create({
      email: email,
      metadata: {
        supabase_user_id: userId,
      },
    });

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
