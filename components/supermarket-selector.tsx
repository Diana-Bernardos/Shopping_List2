"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Supermarket } from "@/lib/types"

interface SupermarketSelectorProps {
  supermarkets: Supermarket[]
  selectedSupermarket: string | null
  setSelectedSupermarket: (id: string) => void
  addSupermarket: (name: string) => void
}

export default function SupermarketSelector({
  supermarkets,
  selectedSupermarket,
  setSelectedSupermarket,
  addSupermarket,
}: SupermarketSelectorProps) {
  const [newSupermarketName, setNewSupermarketName] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleAddSupermarket = () => {
    if (newSupermarketName.trim()) {
      addSupermarket(newSupermarketName)
      setNewSupermarketName("")
      setDialogOpen(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Supermercados</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-vegetable-green hover:bg-vegetable-green/90">
              <Plus className="h-4 w-4 mr-2" />
              Añadir Supermercado
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-vegetable-green">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Supermercado</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                placeholder="Nombre del supermercado"
                value={newSupermarketName}
                onChange={(e) => setNewSupermarketName(e.target.value)}
              />
              <Button onClick={handleAddSupermarket} className="w-full">
                Añadir
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {supermarkets.length > 0 ? (
        <Select value={selectedSupermarket || ""} onValueChange={(value) => setSelectedSupermarket(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un supermercado" />
          </SelectTrigger>
          <SelectContent>
            {supermarkets.map((supermarket) => (
              <SelectItem key={supermarket.id} value={supermarket.id}>
                {supermarket.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="text-center py-4 text-muted-foreground">No hay supermercados. ¡Añade uno para comenzar!</div>
      )}
    </div>
  )
}

