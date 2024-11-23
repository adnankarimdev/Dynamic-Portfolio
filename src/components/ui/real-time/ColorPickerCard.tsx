'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AnimatedLayout from '../Animations/AnimatedLayout'

interface Color {
  name: string
  hex: string
}


interface CardData {
    title: string;
    summary: string;
    color: string;
    textColor: string;
  }

  type ColorCardProps = {
    cardData: CardData; // The prop should match the `CardData` type
  };

const colors: Color[] = [
  { name: "Blush", hex: "#FFEDEB" },
  { name: "Lilac", hex: "#FFD7FF" },
  { name: "Dark Lilac", hex: "#FF45FF" },
  { name: "Lemon", hex: "#FFFF8F" },
  { name: "Mint", hex: "#D9FFD8" },
  { name: "Seafoam", hex: "#A6FFA3" },
  { name: "Sky", hex: "#E5F1FF" },
  { name: "Celeste", hex: "#CAFFFF" },
  { name: "Olive", hex: "#6D6837" },
  { name: "Charcoal", hex: "#393939" },
  { name: "Maroon", hex: "#512D0D" },
  { name: "Turquoise", hex: "#005454" },
  { name: "Terracotta", hex: "#C45600" },
  { name: "Indigo", hex: "#28044A" },
  { name: "Forest", hex: "#193918" },
  { name: "Kelly", hex: "#2D712A" }
]

export default function ColorPickerCard({cardData}:ColorCardProps) {
  const [selectedColor, setSelectedColor] = useState<Color>(colors[0])

  const handleColorChange = (value: string) => {
    const color = colors.find(c => c.name === value)
    if (color) {
      setSelectedColor(color)
    }
  }

  const isDarkColor = ['Charcoal', 'Maroon', 'Turquoise', 'Indigo', 'Forest', 'Kelly'].includes(selectedColor.name)

  return (
    <AnimatedLayout>
    <Card className="w-full p-6 transition-colors duration-300" style={{ backgroundColor: cardData.color}}>
      <CardHeader>
        <CardTitle className={`text-3xl mb-4 ${isDarkColor ? 'text-white' : 'text-black'}`}>
         {cardData.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {cardData.summary}
        {/* <Select onValueChange={handleColorChange} defaultValue={selectedColor.name}>
          <SelectTrigger className={`w-full text-lg p-4 ${isDarkColor ? 'text-white bg-gray-800' : 'text-black bg-white'}`}>
            <SelectValue placeholder="Select a color" />
          </SelectTrigger>
          <SelectContent>
            {colors.map((color) => (
              <SelectItem key={color.name} value={color.name} className="text-lg p-3">
                <div className="flex items-center">
                  <div 
                    className="w-6 h-6 rounded-full mr-3" 
                    style={{ backgroundColor: color.hex }}
                    aria-hidden="true"
                  />
                  {color.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select> */}
      </CardContent>
    </Card>
    </AnimatedLayout>
  )
}

