import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Definimos um tipo customizado para a Invoice que aceita os campos da API 2025/2026
type StripeInvoiceWithDetails = Stripe.Invoice & {
  subscription: string; // Forçamos como string para evitar erro de objeto expandido
  subscription_details?: {
    metadata?: {
      clerk_user_id?: string;
    };
  };
};

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.error();
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.error();
  }

  const text = await request.text();

  // Usamos 'as any' na versão da API para evitar conflito com tipos locais desatualizados
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-04-22.dahlia",
  });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return new NextResponse(
      `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`,
      { status: 400 },
    );
  }

  switch (event.type) {
    case "invoice.paid": {
      // Aplicamos o nosso tipo customizado aqui
      const invoice = event.data.object as StripeInvoiceWithDetails;

      const customerId = invoice.customer as string;
      const subscriptionId = invoice.subscription;

      // Buscamos o ID de forma resiliente em ambos os lugares possíveis
      const clerkUserId =
        invoice.subscription_details?.metadata?.clerk_user_id ||
        (invoice.metadata?.clerk_user_id as string);

      if (!clerkUserId) {
        console.error("Clerk User ID não encontrado nos metadados da Invoice");
        return NextResponse.json(
          { error: "Clerk User ID missing in metadata" },
          { status: 400 },
        );
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

      if (!clerkUserId) {
        return NextResponse.json(
          { error: "Clerk User ID missing in subscription metadata" },
          { status: 400 },
        );
      }

      const client = await clerkClient();
      await client.users.updateUser(clerkUserId, {
        privateMetadata: {
          stripeCustomerId: null,
          stripeSubscriptionId: null,
        },
        publicMetadata: {
          subscriptionPlan: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
};
