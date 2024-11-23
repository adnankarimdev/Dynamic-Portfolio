'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/cardshad"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AnimatedLayout from '../Animations/AnimatedLayout'
import { Space_Mono } from 'next/font/google';
import BoxReveal from '../box-reveal'
import LetterPullup from '../letter-pullup'

// Load Space Mono font
const spaceMono = Space_Mono({
    subsets: ['latin'], // Choose the subsets you need
    weight: ['400'], // Specify weights (normal, bold, etc.)
  });

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
    <Card className={`w-full p-20 transition-colors duration-300 ${spaceMono.className}`} style={{ backgroundColor: cardData.color}}>
      <CardHeader>
        <CardTitle className={`text-xl mb-4 ${cardData.textColor}`}>
         
         <LetterPullup words={cardData.title} delay={0.05} className={`text-sm ${cardData.textColor}`}/>
        </CardTitle>
      </CardHeader>
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
      <CardContent>
        {cardData.summary}
      </CardContent>
      </BoxReveal>
    </Card>
    </AnimatedLayout>
  )
}

