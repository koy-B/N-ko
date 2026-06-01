import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    minimumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("fr-FR").format(num)
}

export function calculateCO2Saved(kg: number): number {
  return kg * 0.6
}

export function calculateLandfillDiverted(kg: number): number {
  return kg * 0.95
}

export function calculateEnergySaved(kg: number): number {
  return kg * 2.5
}

export function calculateBricksFromPlastic(kg: number): number {
  return Math.floor(kg / 0.5)
}

export function getLevel(points: number): { name: string; icon: string; min: number; max: number } {
  const levels = [
    { name: "Eco Starter", icon: "🌱", min: 0, max: 100 },
    { name: "Eco Citizen", icon: "🌿", min: 100, max: 500 },
    { name: "Eco Hero", icon: "🌳", min: 500, max: 2000 },
    { name: "Eco Champion", icon: "🏆", min: 2000, max: Infinity },
  ]
  return levels.find((l) => points >= l.min && points < l.max) || levels[0]
}
