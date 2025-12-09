import { CreateProductSchema } from "@/lib/validation/product"

describe("Product validation", () => {
  it("should validate valid product", () => {
    const validProduct = {
      type: "MTG_SINGLE",
      name: "Sol Ring",
      slug: "sol-ring-cmr-276",
      // ...
    }

    expect(() => CreateProductSchema.parse(validProduct)).not.toThrow()
  })

  it("should reject invalid slug", () => {
    const invalidProduct = {
      type: "MTG_SINGLE",
      name: "Sol Ring",
      slug: "Invalid Slug!", // Has spaces and special chars
    }

    expect(() => CreateProductSchema.parse(invalidProduct)).toThrow()
  })
})