import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-11-20.acacia" as any, // Forçamos compatibilidade
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return new NextResponse(`Webhook Error`, { status: 400 });
  }

  switch (event.type) {
    case "invoice.paid": {
      const invoice = event.data.object as any; // Usamos any para navegar na estrutura dinâmica

      const customerId = invoice.customer as string;

      // No seu JSON, a subscription está dentro de parent.subscription_details
      const subscriptionId =
        invoice.subscription ||
        invoice.parent?.subscription_details?.subscription;

      // Buscamos o ID nos 3 lugares possíveis (Estrutura nova, Metadata da Invoice e Metadata do Item)
      const clerkUserId =
        invoice.parent?.subscription_details?.metadata?.clerk_user_id ||
        invoice.metadata?.clerk_user_id ||
        invoice.lines?.data[0]?.metadata?.clerk_user_id;

      if (!clerkUserId) {
        console.error(
          "Clerk User ID não encontrado em nenhuma estrutura do evento",
        );
        return NextResponse.json({ error: "User ID missing" }, { status: 400 });
      }

      const client = await clerkClient();
      await client.users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: customerId,
          stripeSubscriptionId: subscriptionId,
        },
        publicMetadata: {
          subscriptionPlan: "premium",
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const clerkUserId = subscription.metadata?.clerk_user_id;

      if (!clerkUserId) break;

      const client = await clerkClient();
      await client.users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
        publicMetadata: {
          subscriptionPlan: "free", // Mudado de null para "free" para evitar erros de renderização
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
};
