import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Parking & Transportation",
  description:
    "Parking and transportation guidelines for the NJ Rajat Mahotsav 2026 — temple drop-off instructions, Harmon Meadow parking deck directions, tow-zone rules, and shuttle and bus schedules between the temple, hotels, and parking.",
  alternates: {
    canonical: "/parking",
  },
}

export default function ParkingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
