import errorResponse, { APIError } from "@/lib/error";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { validateBody, validateSearchParams } from "@/lib/validation/api";
import { CreateProductSchema } from "@/lib/validation/product";
import { Inventory, MtgCard, Product, ProductType } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

const geProductsQuerySchema = z.object({
    page: z.preprocess(
        (val) => val ? parseInt(String(val), 10) : undefined,
        z.number().min(1).default(1)
    ),
    limit: z.preprocess(
        (val) => val ? parseInt(String(val), 10) : undefined,
        z.number().min(1).max(100).default(50)
    ),
    search: z.string().default(""),
});

export type GetProductsResponse = {
    products: (Product & { mtgCard: MtgCard | null } & { inventory: Inventory[] })[],
    pagination: {
        limit: number,
        page: number,
        total: number,
        totalPages: number
    }
}

export async function GET(req: NextRequest): Promise<NextResponse<APIError> | NextResponse<GetProductsResponse>> {
    const validation = validateSearchParams(
        geProductsQuerySchema,
        req.nextUrl.searchParams
    )

    if (!validation.success) {
        return errorResponse(400, "Failed to validate", [validation.error])
    }

    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: validation.data.search, mode: "insensitive" } },
                    { slug: { contains: validation.data.search, mode: "insensitive" } }
                ]
            },
            include: {
                mtgCard: true,
                inventory: true,
                _count: {
                    select: { orderItems: true },
                },
            },
            orderBy: { createdAt: "desc" },
            take: validation.data.limit,
            skip: (validation.data.page - 1) * validation.data.limit,
        }),
        prisma.product.count({
            where: {
                OR: [
                    { name: { contains: validation.data.search, mode: "insensitive" } },
                    { slug: { contains: validation.data.search, mode: "insensitive" } }
                ]
            },
        }),
    ])

    return NextResponse.json({
        products,
        pagination: {
            limit: validation.data.limit,
            page: validation.data.page,
            total: totalCount,
            totalPages: Math.ceil(totalCount / validation.data.limit),
        },
    }, {
        status: 200
    })
}

export async function POST(req: NextRequest) {
    const body = await req.json()

    const validation = validateBody(CreateProductSchema, body)
    if (!validation.success) {
        return errorResponse(400, "Failed to validate", [validation.error])
    }
    const { data } = validation;

    if (data.mtgCard && data.type != ProductType.MTG_SINGLE) {
        return errorResponse(400, "Cannot create an MTG single without product type of MTG_SINGLE")
    }

    var mtgRequest = undefined
    if (data.mtgCard && data.type == ProductType.MTG_SINGLE) {
        mtgRequest = {
            create: {
                scryfallId: data.mtgCard.scryfallId,
                oracleId: data.mtgCard.oracleId,
                setCode: data.mtgCard.setCode,
                setName: data.mtgCard.setName,
                collectorNumber: data.mtgCard.collectorNumber,
                rarity: data.mtgCard.rarity,
                manaCost: data.mtgCard.manaCost,
                cmc: data.mtgCard.cmc,
                colors: data.mtgCard.colors,
                colorIdentity: data.mtgCard.colorIdentity,
                typeLine: data.mtgCard.typeLine,
                oracleText: data.mtgCard.oracleText,
                power: data.mtgCard.power,
                toughness: data.mtgCard.toughness,
                loyalty: data.mtgCard.loyalty,
                legalities: data.mtgCard.legalities,
                artist: data.mtgCard.artist,
                flavorText: data.mtgCard.flavorText,
            },
        }
    }

    try {
        const product = await prisma.product.create({
            data: {
                type: data.type,
                name: data.name,
                slug: data.slug ? data.slug : slugify(data.name),
                category: data.category,
                imageUrl: data.imageUrl,
                mtgCard: mtgRequest,
                ...(data.inventory && {
                    inventory: {
                        create: data.inventory.map((inv: any) => ({
                            condition: inv.condition,
                            quantity: inv.quantity,
                            price: inv.price,
                            costBasis: inv.costBasis,
                        })),
                    },
                }),
            },
            include: {
                mtgCard: true,
                inventory: true,
            },
        })

        return NextResponse.json({ product }, { status: 201 })
    } catch (error) {
        console.error("Error creating product:", error)
        return errorResponse(500, "Failed to create product", [error])
    }
}