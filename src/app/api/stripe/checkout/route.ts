import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY!);
const PRICE_ID = "price_1QOdku00k5Gv8VrIJhm4YPyE"; // Your subscription price ID

export async function POST(req: NextRequest) {
  try {
    const { stripe_customer_id } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url:
        "http://localhost:5000/home?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:5000/login",
      customer: stripe_customer_id,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 }
    );
  }
}
