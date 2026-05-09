import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tree Plantation Program — 25 Years of Roots",
  description:
    "Honoring 25 years of Shree Swaminarayan Temple Secaucus with a community tree plantation program. A celebration of stewardship, service, and the seeds we plant for the next generation.",
  alternates: {
    canonical: "/tree-planting",
  },
  openGraph: {
    title: "Tree Plantation Program — 25 Years of Roots",
    description:
      "A community tree plantation program marking the 25th anniversary of Shree Swaminarayan Temple Secaucus.",
    url: "/tree-planting",
    type: "article",
  },
}

export default function TreePlantingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
