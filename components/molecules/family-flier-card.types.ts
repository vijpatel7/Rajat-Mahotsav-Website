export type FlierVariant = "spotlight" | "triptych" | "featured" | "polaroid"

export interface FamilyFlierCardProps {
  variant: FlierVariant
  familyName: string
  message: string
  images: string[]
  location?: string
  yearsAttending?: string
  className?: string
}

export const FLIER_LIMITS: Record<
  FlierVariant,
  { name: number; message: number; location: number; images: [number, number] }
> = {
  spotlight: { name: 36, message: 90, location: 28, images: [1, 1] },
  triptych: { name: 36, message: 140, location: 28, images: [3, 3] },
  featured: { name: 36, message: 200, location: 28, images: [3, 3] },
  polaroid: { name: 32, message: 70, location: 24, images: [1, 3] },
}
