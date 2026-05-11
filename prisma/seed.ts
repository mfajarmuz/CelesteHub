import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const templates = [
  {
    name: "PRD Umum",
    description:
      "Template PRD standar yang cocok untuk berbagai jenis produk digital.",
    category: "umum",
    structure: JSON.stringify({
      sections: [
        "executive_summary",
        "background_problem",
        "target_users",
        "goals_metrics",
        "scope",
        "functional_requirements",
        "non_functional_requirements",
        "user_stories",
        "risk_analysis",
        "roadmap",
      ],
    }),
  },
  {
    name: "PRD Fintech",
    description:
      "Template PRD khusus untuk produk fintech dengan fokus pada compliance, keamanan, dan regulasi.",
    category: "fintech",
    structure: JSON.stringify({
      sections: [
        "executive_summary",
        "market_analysis",
        "regulatory_compliance",
        "target_users",
        "goals_metrics",
        "scope",
        "functional_requirements",
        "security_requirements",
        "user_stories",
        "risk_analysis",
        "roadmap",
      ],
    }),
  },
  {
    name: "PRD E-commerce",
    description:
      "Template PRD untuk platform e-commerce dengan fokus pada customer journey dan conversion.",
    category: "ecommerce",
    structure: JSON.stringify({
      sections: [
        "executive_summary",
        "market_opportunity",
        "customer_journey",
        "target_users",
        "goals_metrics",
        "scope",
        "functional_requirements",
        "payment_requirements",
        "user_stories",
        "risk_analysis",
        "roadmap",
      ],
    }),
  },
  {
    name: "PRD SaaS B2B",
    description:
      "Template PRD untuk produk SaaS enterprise dengan fokus pada multi-tenant, onboarding, dan billing.",
    category: "saas",
    structure: JSON.stringify({
      sections: [
        "executive_summary",
        "problem_statement",
        "target_market",
        "personas",
        "goals_metrics",
        "scope",
        "functional_requirements",
        "integration_requirements",
        "user_stories",
        "pricing_considerations",
        "risk_analysis",
        "roadmap",
      ],
    }),
  },
  {
    name: "PRD Mobile App",
    description:
      "Template PRD untuk aplikasi mobile dengan fokus pada platform-specific requirements dan UX.",
    category: "mobile",
    structure: JSON.stringify({
      sections: [
        "executive_summary",
        "problem_statement",
        "target_users",
        "goals_metrics",
        "platform_requirements",
        "scope",
        "functional_requirements",
        "ui_ux_requirements",
        "user_stories",
        "performance_requirements",
        "risk_analysis",
        "roadmap",
      ],
    }),
  },
];

async function main() {
  console.log("Seeding database...");

  for (const template of templates) {
    const existing = await prisma.template.findFirst({
      where: { name: template.name },
    });

    if (!existing) {
      await prisma.template.create({ data: template });
      console.log(`  ✓ Template created: ${template.name}`);
    } else {
      console.log(`  - Template exists: ${template.name}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
