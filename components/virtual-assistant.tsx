"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Send } from "lucide-react"
import type { ShoppingList, Supermarket } from "@/lib/types"

interface VirtualAssistantProps {
  lists: ShoppingList[]
  setLists: React.Dispatch<React.SetStateAction<ShoppingList[]>>
  supermarkets: Supermarket[]
}

export default function VirtualAssistant({ lists, setLists, supermarkets }: VirtualAssistantProps) {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [conversation, setConversation] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "¡Hola! Soy tu asistente virtual. Puedo ayudarte a crear menús y listas de compra. ¿En qué puedo ayudarte hoy?",
    },
  ])
  const [generatedMenu, setGeneratedMenu] = useState<string[]>([])
  const [generatedList, setGeneratedList] = useState<{ name: string; items: string[] }[]>([])

  const handleSendMessage = async () => {
    if (!query.trim()) return

    // Add user message to conversation
    const userMessage = { role: "user" as const, content: query }
    setConversation([...conversation, userMessage])

    // Clear input and show loading
    setQuery("")
    setLoading(true)

    try {
      // In a real implementation, this would call the Ollama API
      // For this demo, we'll simulate a response
      await simulateOllamaResponse(query)
    } catch (error) {
      console.error("Error calling assistant:", error)
      setConversation([
        ...conversation,
        userMessage,
        {
          role: "assistant",
          content: "Lo siento, ha ocurrido un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  // This function simulates a call to the Ollama API
  const simulateOllamaResponse = async (userQuery: string) => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const lowerQuery = userQuery.toLowerCase()
    let response = ""

    // Generate different responses based on user query
    if (lowerQuery.includes("menú") || lowerQuery.includes("menu") || lowerQuery.includes("comida")) {
      response = "Aquí tienes un menú semanal que he preparado para ti:"

      const menu = [
        "Lunes: Pasta con verduras y pollo a la plancha",
        "Martes: Ensalada de garbanzos y pescado al horno",
        "Miércoles: Arroz con verduras y tortilla española",
        "Jueves: Crema de calabacín y hamburguesas caseras",
        "Viernes: Lentejas con verduras y pescado a la plancha",
        "Sábado: Pizza casera con ensalada",
        "Domingo: Paella de mariscos",
      ]

      setGeneratedMenu(menu)

      // Add option to create shopping list
      response += "\n\n¿Quieres que cree una lista de la compra basada en este menú?"
    } else if (lowerQuery.includes("lista") || lowerQuery.includes("compra")) {
      response = "He creado una lista de compra para ti:"

      // Generate a shopping list
      const groceryList = {
        name: "Lista semanal",
        items: [
          "Pasta",
          "Arroz",
          "Garbanzos",
          "Lentejas",
          "Pollo",
          "Pescado blanco",
          "Carne picada",
          "Mariscos",
          "Calabacín",
          "Tomates",
          "Cebolla",
          "Pimiento",
          "Lechuga",
          "Huevos",
          "Leche",
          "Queso",
          "Pan",
          "Aceite de oliva",
        ],
      }

      setGeneratedList([groceryList])

      // Add option to save to a supermarket
      if (supermarkets.length > 0) {
        response += "\n\n¿Quieres guardar esta lista en alguno de tus supermercados?"
      }
    } else if (lowerQuery.includes("sí") || lowerQuery.includes("si") || lowerQuery.includes("guardar")) {
      if (generatedList.length > 0) {
        // If there are supermarkets, suggest saving the list
        if (supermarkets.length > 0) {
          const supermarket = supermarkets[0]
          const newList: ShoppingList = {
            id: Date.now().toString(),
            name: generatedList[0].name,
            supermarketId: supermarket.id,
            items: generatedList[0].items.map((item) => ({
              id: Date.now() + Math.random().toString(),
              name: item,
              completed: false,
            })),
            shared: false,
          }

          setLists([...lists, newList])
          response = `¡Perfecto! He guardado la lista "${generatedList[0].name}" en el supermercado "${supermarket.name}".`
        } else {
          response = "Primero necesitas añadir un supermercado para poder guardar la lista."
        }
      } else if (generatedMenu.length > 0) {
        // Create a shopping list from the menu
        const groceryItems = [
          "Pasta",
          "Pollo",
          "Verduras variadas",
          "Garbanzos",
          "Pescado",
          "Arroz",
          "Huevos",
          "Patatas",
          "Calabacín",
          "Carne picada",
          "Lentejas",
          "Ingredientes para pizza",
          "Mariscos",
        ]

        const groceryList = {
          name: "Lista para menú semanal",
          items: groceryItems,
        }

        setGeneratedList([groceryList])

        response =
          "He creado una lista de la compra basada en el menú. ¿Quieres guardarla en alguno de tus supermercados?"
      } else {
        response = "Lo siento, no tengo ninguna lista o menú generado para guardar. ¿Quieres que te ayude a crear uno?"
      }
    } else {
      response =
        "Puedo ayudarte a crear menús semanales y listas de compra. Prueba a pedirme algo como 'Crea un menú semanal' o 'Haz una lista de la compra'."
    }

    // Add assistant response to conversation
    setConversation((prev) => [...prev, { role: "assistant", content: response }])
  }

  return (
    <div className="space-y-4">
      <Card className="border-vegetable-green">
        <CardHeader className="bg-muted/50">
          <CardTitle className="text-primary">Asistente Virtual</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="chat">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="results">Resultados</TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="space-y-4 pt-4">
              <div className="h-[400px] overflow-y-auto border rounded-md p-4 space-y-4">
                {conversation.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-vegetable-green/30"
                      }`}
                    >
                      {message.content.split("\n").map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Pensando...
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Escribe tu mensaje..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <Button onClick={handleSendMessage} disabled={loading}>
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Enviar</span>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="results" className="pt-4">
              <div className="space-y-6">
                {generatedMenu.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Menú Generado:</h3>
                    <ul className="space-y-1 list-disc pl-5">
                      {generatedMenu.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {generatedList.length > 0 && (
                  <div className="space-y-4">
                    {generatedList.map((list, listIndex) => (
                      <div key={listIndex} className="space-y-2">
                        <h3 className="font-medium">{list.name}:</h3>
                        <ul className="grid grid-cols-2 gap-1">
                          {list.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center">
                              <span className="text-sm">• {item}</span>
                            </li>
                          ))}
                        </ul>
                        {supermarkets.length > 0 && (
                          <Button
                            onClick={() => {
                              const supermarket = supermarkets[0]
                              const newList: ShoppingList = {
                                id: Date.now().toString(),
                                name: list.name,
                                supermarketId: supermarket.id,
                                items: list.items.map((item) => ({
                                  id: Date.now() + Math.random().toString(),
                                  name: item,
                                  completed: false,
                                })),
                                shared: false,
                              }

                              setLists([...lists, newList])
                              alert(`Lista guardada en ${supermarket.name}`)
                            }}
                            className="mt-2"
                          >
                            Guardar en Supermercado
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {generatedMenu.length === 0 && generatedList.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay resultados generados. Habla con el asistente para crear menús o listas.
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

