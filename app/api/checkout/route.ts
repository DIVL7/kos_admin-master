import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const POST = async (req: NextRequest) => {
  try {
    const { cartItems, customer } = await req.json();

    const lineItems = cartItems.map((cartItem: any) => {
      return {
        price_data: {
          currency: "usd", // Change to your preferred currency
          product_data: {
            name: cartItem.item.title,
            metadata: {
              productId: cartItem.item._id,
              ...(cartItem.size && { size: cartItem.size }),
              ...(cartItem.color && { color: cartItem.color }),
            },
          },
          unit_amount: cartItem.item.price * 100,
          recurring: cartItem.item.recurring ? { interval: "month" } : undefined, // Handle subscriptions
        },
        quantity: cartItem.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription", // Handle mixed carts
      line_items: lineItems,
      customer_email: customer.email,
      success_url: `${process.env.ECOMMERCE_STORE_URL}/payment_success`,
      cancel_url: `${process.env.ECOMMERCE_STORE_URL}/cart`,
    });

    return NextResponse.json({ url: session.url }, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "https://kos-store-master.vercel.app",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  } catch (err) {
    console.error("[/api/checkout] Error occurred:", err);
    return new NextResponse("Failed to create the order", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "https://kos-store-master.vercel.app",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }
};
