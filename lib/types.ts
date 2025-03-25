export interface Supermarket {
  id: string
  name: string
}

export interface ShoppingItem {
  id: string
  name: string
  completed: boolean
}

export interface ShoppingList {
  id: string
  name: string
  supermarketId: string
  items: ShoppingItem[]
  shared: boolean
}

