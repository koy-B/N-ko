import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { hash } from "bcryptjs"

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" })
const prisma = new PrismaClient({ adapter })

async function main() {
  const adminPassword = await hash("Admin123!", 12)

  const admin = await prisma.user.upsert({
    where: { email: "admin@nekogreen.com" },
    update: {},
    create: {
      name: "Admin Neko Green",
      email: "admin@nekogreen.com",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
  })

  console.log("Admin user created:", admin.email)

  const categoriesData = [
    { name: "Pavés Standard", slug: "paves-standard" },
    { name: "Pavés Autobloquants", slug: "paves-autobloquants" },
    { name: "Pavés Décoratifs", slug: "paves-decoratifs" },
    { name: "Bordures", slug: "bordures" },
  ]

  const categories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  )

  console.log(`${categories.length} categories created`)

  const productsData = [
    {
      name: "Pavé Standard",
      slug: "pave-standard",
      description: "Pavé écologique fabriqué à partir de plastique recyclé. Idéal pour les trottoirs et les allées piétonnes. Résistant et durable.",
      price: 1500,
      categoryId: categories[0].id,
      stock: 500,
      weight: 2.5,
      dimensions: "20x10x6 cm",
      colors: '["Gris","Noir","Vert"]',
      images: '["/images/products/pave-standard.jpg"]',
    },
    {
      name: "Pavé Autobloquant",
      slug: "pave-autobloquant",
      description: "Pavé autobloquant en plastique recyclé pour les parkings et les voies d'accès. Haute résistance à la charge.",
      price: 2500,
      categoryId: categories[1].id,
      stock: 300,
      weight: 3.2,
      dimensions: "25x12x8 cm",
      colors: '["Gris foncé","Noir","Bordeaux"]',
      images: '["/images/products/pave-autobloquant.jpg"]',
    },
    {
      name: "Pavé Décoratif",
      slug: "pave-decoratif",
      description: "Pavé décoratif en plastique recyclé pour les jardins et espaces paysagers. Design moderne et écologique.",
      price: 3500,
      categoryId: categories[2].id,
      stock: 200,
      weight: 2.0,
      dimensions: "20x20x5 cm",
      colors: '["Rouge","Jaune","Bleu","Vert"]',
      images: '["/images/products/pave-decoratif.jpg"]',
    },
    {
      name: "Bordures de Jardin",
      slug: "bordures-de-jardin",
      description: "Bordures de jardin en plastique recyclé pour délimiter vos espaces verts. Faciles à installer et écologiques.",
      price: 2000,
      categoryId: categories[3].id,
      stock: 400,
      weight: 1.8,
      dimensions: "50x10x4 cm",
      colors: '["Marron","Gris","Noir"]',
      images: '["/images/products/bordures-jardin.jpg"]',
    },
  ]

  const products = await Promise.all(
    productsData.map((prod) =>
      prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: prod,
      })
    )
  )

  console.log(`${products.length} products created`)

  const faqsData = [
    {
      question: "Comment sont fabriqués les pavés Neko Green ?",
      answer: "Nos pavés sont fabriqués à partir de déchets plastiques recyclés collectés localement. Le plastique est trié, nettoyé, broyé puis transformé en pavés solides et durables grâce à un processus de compression à chaud.",
      category: "Produits",
      order: 1,
    },
    {
      question: "Quel est l'impact environnemental de vos produits ?",
      answer: "Chaque pavé Neko Green permet de recycler l'équivalent de 500g de déchets plastiques. En choisissant nos produits, vous contribuez à réduire la pollution plastique et à diminuer les émissions de CO2.",
      category: "Environnement",
      order: 2,
    },
    {
      question: "Comment puis-je commander une collecte de plastique ?",
      answer: "Vous pouvez programmer une collecte directement depuis votre tableau de bord client. Sélectionnez le type de déchet, le poids estimé et votre adresse. Un collecteur agréé viendra récupérer votre plastique recyclable.",
      category: "Service",
      order: 3,
    },
  ]

  await Promise.all(
    faqsData.map((faq) =>
      prisma.fAQ.create({ data: faq })
    )
  )

  console.log(`${faqsData.length} FAQs created`)

  const blogPostsData = [
    {
      title: "Le recyclage du plastique au Sénégal : une solution innovante",
      slug: "recyclage-plastique-senegal-solution-innovante",
      excerpt: "Découvrez comment le Sénégal transforme ses déchets plastiques en pavés écologiques et crée des emplois durables.",
      content: "Le Sénégal produit chaque année des milliers de tonnes de déchets plastiques. Face à ce défi environnemental, Neko Green propose une solution innovante : transformer ces déchets en pavés écologiques pour la construction.\n\nCette approche permet non seulement de réduire la pollution plastique mais aussi de créer des emplois locaux dans la collecte et le recyclage. Les pavés Neko Green sont aussi résistants que le béton, tout en étant plus légers et moins chers.\n\nNotre processus de recyclage comprend plusieurs étapes : la collecte des déchets plastiques, le tri et le nettoyage, le broyage en granulés, et enfin la compression à chaud pour former des pavés solides et durables.",
      image: "/images/blog/plastique-senegal.jpg",
      author: "Admin Neko Green",
      published: true,
    },
    {
      title: "5 raisons de choisir des pavés écologiques pour votre projet",
      slug: "5-raisons-choisir-paves-ecologiques",
      excerpt: "Les pavés écologiques offrent de nombreux avantages : durabilité, esthétique et impact environnemental réduit.",
      content: "Les pavés écologiques fabriqués à partir de plastique recyclé sont une excellente alternative aux matériaux de construction traditionnels.\n\n1. Durabilité exceptionnelle : nos pavés résistent aux intempéries, aux UV et à l'usure du temps.\n\n2. Impact environnemental réduit : chaque pavé recycle l'équivalent de 500g de plastique.\n\n3. Facilité d'installation : plus légers que le béton, ils sont faciles à transporter et à poser.\n\n4. Esthétique variée : disponibles en plusieurs couleurs et finitions.\n\n5. Prix compétitifs : moins chers que les pavés en béton traditionnels.",
      image: "/images/blog/paves-ecologiques.jpg",
      author: "Admin Neko Green",
      published: true,
    },
  ]

  await Promise.all(
    blogPostsData.map((post) =>
      prisma.blogPost.create({ data: post })
    )
  )

  console.log(`${blogPostsData.length} blog posts created`)

  const rewardsData = [
    {
      name: "Bon d'achat 5000 XOF",
      description: "Un bon d'achat de 5000 XOF utilisable sur la boutique Neko Green",
      pointsCost: 500,
      type: "VOUCHER",
      value: 5000,
    },
    {
      name: "Sac en toile Neko Green",
      description: "Un sac en toile réutilisable aux couleurs de Neko Green",
      pointsCost: 200,
      type: "MERCHANDISE",
      value: 3000,
    },
    {
      name: "Visite guidée du centre de recyclage",
      description: "Une visite guidée de notre centre de recyclage pour découvrir le processus de transformation",
      pointsCost: 1000,
      type: "EXPERIENCE",
    },
    {
      name: "Plantation d'un arbre",
      description: "Nous plantons un arbre en votre nom dans le cadre de notre programme de reforestation",
      pointsCost: 150,
      type: "DONATION",
    },
  ]

  await Promise.all(
    rewardsData.map((reward) =>
      prisma.reward.create({ data: reward })
    )
  )

  console.log(`${rewardsData.length} rewards created`)
  console.log("Seed completed successfully!")
}

main()
  .catch((e) => {
    console.error("Seed error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
