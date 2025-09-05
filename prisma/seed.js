const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const product = await prisma.product.create({
    data: {
      sku: "necklace-001",
      name: "THALASSA Bohemian Macramé Necklace",
      description: "Handcrafted macramé necklace with bohemian design",
      price: 28,
      category: "necklaces",
      images: [
        "https://i.ytimg.com/vi/gur1Oga_Cao/sddefault.jpg",
        "https://i.ytimg.com/vi/UKf9b37KKaw/maxresdefault.jpg"
      ],
      featured: true,
      inStock: true,
      materials: ["Cotton cord", "Wooden beads"],
      dimensions: "Adjustable length: 45-55cm",
      care_instructions: "Hand wash gently with mild soap. Air dry away from direct sunlight."
    },
  });

  console.log("✅ Producto insertado:", product);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });