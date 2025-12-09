import { CardCondition, ProductType } from "@prisma/client";
import { z } from "zod"

export const MTGCardSchema = z.object({
  scryfallId: z.uuid(),
  oracleId: z.uuid(),
  setCode: z.string().min(1).max(10),
  setName: z.string().min(1),
  collectorNumber: z.string().min(1),
  rarity: z.string().min(1),
  manaCost: z.string().optional(),
  cmc: z.number().min(0),
  colors: z.array(z.string()),
  colorIdentity: z.array(z.string()),
  typeLine: z.string().min(1),
  oracleText: z.string().optional(),
  power: z.string().optional().nullable(),
  toughness: z.string().optional().nullable(),
  loyalty: z.string().optional().nullable(),
  legalities: z.object(),
  artist: z.string().optional(),
  flavorText: z.string().optional().nullable(),
})

export const InventoryItemSchema = z.object({
  condition: z.enum(CardCondition),
  quantity: z.number().int().min(0),
  price: z.number().min(0),
  costBasis: z.number().min(0).optional().nullable(),
})

export const CreateProductSchema = z.object({
    name: z.string().min(1).max(255),
    type: z.enum(ProductType),
    slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/).optional(),
    category: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    imageUrl: z.url().optional(),
    mtgCard: MTGCardSchema.optional(),
    inventory: z.array(InventoryItemSchema).optional().default([]),
});

// Type exports
export type CreateProductInput = z.infer<typeof CreateProductSchema>