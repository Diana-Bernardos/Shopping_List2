"use client"

import { useState } from "react"
import { Plus, Share2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import type { ShoppingList } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface ShoppingListsProps {
  lists: ShoppingList[]
  supermarketId: string
  addList: (name: string, supermarketId: string) => void
  addItemToList: (listId: string, itemName: string) => void
  toggleItemCompletion: (listId: string, itemId: string) => void
  removeItem: (listId: string, itemId: string) => void
  toggleListSharing: (listId: string) => void
}

export default function ShoppingLists({
  lists,
  supermarketId,
  addList,
  addItemToList,
  toggleItemCompletion,
  removeItem,
  toggleListSharing,
}: ShoppingListsProps) {
  const [newListName, setNewListName] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const [activeListId, setActiveListId] = useState<string | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState("")

  const handleAddList = () => {
    if (newListName.trim()) {
      addList(newListName, supermarketId)
      setNewListName("")
    }
  }

  const handleAddItem = (listId: string) => {
    if (newItemName.trim()) {
      addItemToList(listId, newItemName)
      setNewItemName("")
    }
  }

  const handleShare = (listId: string) => {
    toggleListSharing(listId)
    const list = lists.find((l) => l.id === listId)
    if (list) {
      // Generate a shareable URL (in a real app, this would be a proper URL)
      const shareableData = JSON.stringify(list)
      const encodedData = encodeURIComponent(shareableData)
      setShareUrl(`${window.location.origin}/share?data=${encodedData}`)
      setShareDialogOpen(true)
    }
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Nombre de nueva lista"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAddList}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Lista
        </Button>
      </div>

      {lists.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No hay listas para este supermercado. ¡Crea una nueva!
        </div>
      ) : (
        <div className="space-y-4">
          {lists.map((list) => (
            <Card key={list.id} className="shadow-sm border-vegetable-green">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{list.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleShare(list.id)}
                    className={list.shared ? "text-green-500" : ""}
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Compartir</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {list.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`item-${item.id}`}
                            checked={item.completed}
                            onCheckedChange={() => toggleItemCompletion(list.id, item.id)}
                          />
                          <label
                            htmlFor={`item-${item.id}`}
                            className={`${item.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {item.name}
                          </label>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => removeItem(list.id, item.id)}>
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Eliminar</span>
                        </Button>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Añadir producto"
                      value={activeListId === list.id ? newItemName : ""}
                      onChange={(e) => {
                        setActiveListId(list.id)
                        setNewItemName(e.target.value)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleAddItem(list.id)
                        }
                      }}
                      className="flex-1"
                    />
                    <Button
                      onClick={() => handleAddItem(list.id)}
                      className="bg-vegetable-green hover:bg-vegetable-green/90"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="sr-only">Añadir</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Compartir Lista</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Enlace para compartir</Label>
              <div className="flex items-center space-x-2">
                <Input value={shareUrl} readOnly />
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl)
                    alert("¡Enlace copiado al portapapeles!")
                  }}
                >
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

