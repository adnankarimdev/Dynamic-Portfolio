'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronRightIcon, Edit2Icon, SaveIcon } from 'lucide-react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ResumeCardProps {
  logoUrl: string
  altText: string
  title: string
  subtitle?: string
  href?: string
  badges?: readonly string[]
  period: string
  description?: string
  onSave?: (updatedData: Partial<ResumeCardProps>) => void
}

export const ResumeCard = ({
  logoUrl: initialLogoUrl,
  altText: initialAltText,
  title: initialTitle,
  subtitle: initialSubtitle,
  href: initialHref,
  badges: initialBadges,
  period: initialPeriod,
  description: initialDescription,
  onSave,
}: ResumeCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl)
  const [altText, setAltText] = useState(initialAltText)
  const [title, setTitle] = useState(initialTitle)
  const [subtitle, setSubtitle] = useState(initialSubtitle || '')
  const [href, setHref] = useState(initialHref || '')
  const [badges, setBadges] = useState(initialBadges?.join(', ') || '')
  const [period, setPeriod] = useState(initialPeriod)
  const [description, setDescription] = useState(initialDescription || '')

  const handleSave = () => {
    setIsEditing(false)
    if (onSave) {
      onSave({
        logoUrl,
        altText,
        title,
        subtitle: subtitle || undefined,
        href: href || undefined,
        badges: badges.split(',').map(badge => badge.trim()),
        period,
        description: description || undefined,
      })
    }
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (description && !isEditing) {
      e.preventDefault()
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <Card className="flex relative">
<div className="flex justify-end">
  <div className="flex items-center space-x-4">
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        if (isEditing) {
          handleSave();
        } else {
          setIsEditing(true);
        }
      }}
    >
      {isEditing ? <SaveIcon className="h-4 w-4" /> : <Edit2Icon className="h-4 w-4" />}
    </Button>
  </div>
</div>
      <div className="flex-none">
        <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
          {isEditing ? (
            <Input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full h-full"
              placeholder="Logo URL"
            />
          ) : (
            <AvatarImage src={logoUrl} alt={altText} className="object-contain" />
          )}
          <AvatarFallback>{altText[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-grow ml-4 items-center flex-col group" onClick={handleClick}>
        <CardHeader>
          <div className="flex items-center justify-between gap-x-2 text-base">
            <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
              {isEditing ? (
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                />
              ) : (
                title
              )}
              {!isEditing && badges && (
                <span className="inline-flex gap-x-1 ml-2">
                  {badges.split(',').map((badge, index) => (
                    <Badge variant="secondary" className="align-middle text-xs" key={index}>
                      {badge.trim()}
                    </Badge>
                  ))}
                </span>
              )}
              {!isEditing && (
                <ChevronRightIcon
                  className={cn(
                    "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                    isExpanded ? "rotate-90" : "rotate-0"
                  )}
                />
              )}
            </h3>
            <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
              {isEditing ? (
                <Input
                  type="text"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full"
                />
              ) : (
                period
              )}
            </div>
          </div>
          {isEditing ? (
            <Input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full mt-2"
              placeholder="Subtitle"
            />
          ) : (
            subtitle && <div className="font-sans text-xs">{subtitle}</div>
          )}
          {isEditing && (
            <div className="mt-2">
              <Input
                type="text"
                value={badges}
                onChange={(e) => setBadges(e.target.value)}
                className="w-full"
                placeholder="Badges (comma-separated)"
              />
            </div>
          )}
        </CardHeader>
        {(description || isEditing) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isExpanded || isEditing ? 1 : 0,
              height: isExpanded || isEditing ? "auto" : 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-2 text-xs sm:text-sm"
          >
            {isEditing ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
                placeholder="Description"
              />
            ) : (
              description
            )}
          </motion.div>
        )}
      </div>
    </Card>
  )
}