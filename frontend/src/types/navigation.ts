export interface DashboardNavItem {
  id: string
  title: string
  description?: string
  to: string
  icon?: string
  badge?: string
  isExternal?: boolean
}

export interface DashboardNavSection {
  id: string
  title?: string
  items: DashboardNavItem[]
}
