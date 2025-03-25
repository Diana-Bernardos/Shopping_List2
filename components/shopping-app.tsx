"use client"

import { useState, useEffect } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import ShoppingLists from "./shopping-lists"
import VirtualAssistant from "./virtual-assistant"
import SupermarketSelector from "./supermarket-selector"
import type { Supermarket, ShoppingList } from "@/lib/types"

export default function ShoppingApp() {
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([])
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [selectedSupermarket, setSelectedSupermarket] = useState<string | null>(null)
  const [showAssistant, setShowAssistant] = useState(false)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedSupermarkets = localStorage.getItem("supermarkets")
    const savedLists = localStorage.getItem("shoppingLists")

    if (savedSupermarkets) {
      setSupermarkets(JSON.parse(savedSupermarkets))
    }

    if (savedLists) {
      setLists(JSON.parse(savedLists))
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("supermarkets", JSON.stringify(supermarkets))
  }, [supermarkets])

  useEffect(() => {
    localStorage.setItem("shoppingLists", JSON.stringify(lists))
  }, [lists])

  const addSupermarket = (name: string) => {
    const newSupermarket: Supermarket = {
      id: Date.now().toString(),
      name,
    }
    setSupermarkets([...supermarkets, newSupermarket])
    if (!selectedSupermarket) {
      setSelectedSupermarket(newSupermarket.id)
    }
  }

  const addList = (name: string, supermarketId: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      supermarketId,
      items: [],
      shared: false,
    }
    setLists([...lists, newList])
  }

  const addItemToList = (listId: string, itemName: string) => {
    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: [...list.items, { id: Date.now().toString(), name: itemName, completed: false }],
          }
        }
        return list
      }),
    )
  }

  const toggleItemCompletion = (listId: string, itemId: string) => {
    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, completed: !item.completed }
              }
              return item
            }),
          }
        }
        return list
      }),
    )
  }

  const removeItem = (listId: string, itemId: string) => {
    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
          }
        }
        return list
      }),
    )
  }

  const toggleListSharing = (listId: string) => {
    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            shared: !list.shared,
          }
        }
        return list
      }),
    )
  }

  const getFilteredLists = () => {
    if (!selectedSupermarket) return []
    return lists.filter((list) => list.supermarketId === selectedSupermarket)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-gradient-pastel text-primary p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <img src="/logo.png" alt="Logo de Mi Lista de Compra" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl font-bold">Mi Lista de Compra</h1>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menú</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-card">
            <div className="py-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img src="/logo.png" alt="Logo de Mi Lista de Compra" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-lg font-semibold">Mi Lista de Compra</h2>
              </div>
              <nav className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setShowAssistant(false)}>
                  Mis Listas
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setShowAssistant(true)}>
                  Asistente Virtual
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 overflow-auto p-4">
        {showAssistant ? (
          <VirtualAssistant lists={lists} setLists={setLists} supermarkets={supermarkets} />
        ) : (
          <>
            <SupermarketSelector
              supermarkets={supermarkets}
              selectedSupermarket={selectedSupermarket}
              setSelectedSupermarket={setSelectedSupermarket}
              addSupermarket={addSupermarket}
            />

            {selectedSupermarket && (
              <ShoppingLists
                lists={getFilteredLists()}
                addList={addList}
                addItemToList={addItemToList}
                toggleItemCompletion={toggleItemCompletion}
                removeItem={removeItem}
                toggleListSharing={toggleListSharing}
                supermarketId={selectedSupermarket}
              />
            )}
          </>
        )}
      </main>
    </div>
  )
}

