export type UserRole = "ADMIN" | "CLIENT" | "COLLECTOR"

export interface SessionUser {
  id: string
  name?: string | null
  email?: string | null
  image?: string | null
  role: UserRole
}

export interface DashboardStats {
  totalCollections: number
  totalCollected: number
  totalSaved: number
  totalPoints: number
  totalOrders: number
  monthlyData: { month: string; amount: number }[]
  impactData: { label: string; value: number }[]
}

export interface CollectionRequestForm {
  address: string
  latitude?: number
  longitude?: number
  wasteType: string
  estimatedWeight: number
  photos?: string[]
  comment?: string
  scheduledDate?: Date
}

export interface ProductData {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: { id: string; name: string }
  images: string[]
  stock: number
}

export interface OrderData {
  id: string
  total: number
  status: string
  paymentStatus: string
  createdAt: Date
  items: {
    id: string
    quantity: number
    price: number
    product: { name: string }
  }[]
}

export interface NotificationData {
  id: string
  title: string
  message: string
  type: string
  read: boolean
  createdAt: Date
  link?: string | null
}

export interface CollectorStats {
  totalMissions: number
  totalEarned: number
  totalCollected: number
  rating: number
  todayMissions: number
  weeklyEarnings: number
  recentMissions: {
    id: string
    address: string
    wasteType: string
    actualWeight: number | null
    status: string
    completedAt: Date | null
  }[]
}

export interface AdminStats {
  totalUsers: number
  totalCollectors: number
  totalCollections: number
  totalCollected: number
  totalBricksProduced: number
  totalRevenue: number
  totalOrders: number
  monthlyRevenue: { month: string; revenue: number }[]
  wasteCollectionData: { month: string; weight: number }[]
  productionData: { month: string; bricks: number }[]
  recentActivities: {
    id: string
    action: string
    user: string
    date: Date
  }[]
}
