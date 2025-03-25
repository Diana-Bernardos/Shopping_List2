import { NextResponse } from "next/server"

// Esta es una simulación de la API de Ollama
// En una implementación real, se conectaría con el modelo Ollama
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { prompt } = body

    // Simular un tiempo de respuesta
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Procesar el prompt y generar una respuesta
    let response = ""
    const lowerPrompt = prompt.toLowerCase()

    if (lowerPrompt.includes("menú") || lowerPrompt.includes("menu") || lowerPrompt.includes("comida")) {
      response =
        "Aquí tienes un menú semanal que he preparado para ti:\n\n" +
        "Lunes: Pasta con verduras y pollo a la plancha\n" +
        "Martes: Ensalada de garbanzos y pescado al horno\n" +
        "Miércoles: Arroz con verduras y tortilla española\n" +
        "Jueves: Crema de calabacín y hamburguesas caseras\n" +
        "Viernes: Lentejas con verduras y pescado a la plancha\n" +
        "Sábado: Pizza casera con ensalada\n" +
        "Domingo: Paella de mariscos"
    } else if (lowerPrompt.includes("lista") || lowerPrompt.includes("compra")) {
      response =
        "He creado una lista de compra para ti:\n\n" +
        "- Pasta\n- Arroz\n- Garbanzos\n- Lentejas\n" +
        "- Pollo\n- Pescado blanco\n- Carne picada\n- Mariscos\n" +
        "- Calabacín\n- Tomates\n- Cebolla\n- Pimiento\n- Lechuga\n" +
        "- Huevos\n- Leche\n- Queso\n- Pan\n- Aceite de oliva"
    } else {
      response =
        "Puedo ayudarte a crear menús semanales y listas de compra. Prueba a pedirme algo como 'Crea un menú semanal' o 'Haz una lista de la compra'."
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error("Error en la API de Ollama:", error)
    return NextResponse.json({ error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

