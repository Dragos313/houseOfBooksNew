import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With"
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
    try {
        const { editionIds } = await req.json();

        if (!editionIds || editionIds.length === 0) {
            return new NextResponse("Edition ids are required", { status: 400 });
        }

        const editions = await prismadb.edition.findMany({
            where: {
                id: {
                    in: editionIds
                }
            }
        });

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = editions.map((edition) => ({
            quantity: 1,
            price_data: {
                currency: 'USD',
                product_data: {
                    name: edition.name,
                },
                unit_amount: Number(edition.price) * 100
            }
        }));

        const order = await prismadb.order.create({
            data: {
                storeId: params.storeId,
                isPaid: false,
                orderItems: {
                    create: editionIds.map((editionId: string) => ({
                        edition: {
                            connect: {
                                id: editionId
                            }
                        }
                    }))
                }
            }
        });

        const session = await stripe.checkout.sessions.create({
            line_items,
            mode: "payment",
            billing_address_collection: "required",
            phone_number_collection: {
                enabled: true,
            },
            success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
            cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?cancelled=1`,
            metadata: {
                orderId: order.id
            }
        });

        return NextResponse.json({ url: session.url }, { headers: corsHeaders });
    } catch (error) {
        console.error(error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
