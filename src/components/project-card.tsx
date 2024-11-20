'use client'

import { useState } from 'react'
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import Markdown from "react-markdown"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Edit2Icon, SaveIcon, XIcon } from 'lucide-react'

interface ProjectCardProps {
  title: string
  href?: string
  description: string
  dates: string
  tags: string[]
  link?: string
  image?: string
  video?: string
  links?: {
    icon: React.ReactNode
    type: string
    href: string
  }[]
  className?: string
  onSave?: (updatedData: Partial<ProjectCardProps>) => void
}

export default function ProjectCard({
  title: initialTitle,
  href: initialHref,
  description: initialDescription,
  dates: initialDates,
  tags: initialTags,
  link: initialLink,
  image: initialImage,
  video: initialVideo,
  links: initialLinks,
  className,
  onSave,
}: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [href, setHref] = useState(initialHref || '')
  const [description, setDescription] = useState(initialDescription)
  const [dates, setDates] = useState(initialDates)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [link, setLink] = useState(initialLink || '')
  const [image, setImage] = useState(initialImage || '')
  const [video, setVideo] = useState(initialVideo || '')

  const handleSave = () => {
    setIsEditing(false)
    if (onSave) {
      onSave({
        title,
        href: href || undefined,
        description,
        dates,
        tags,
        link: link || undefined,
        image: image || undefined,
        video: video || undefined,
      })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setTitle(initialTitle)
    setHref(initialHref || '')
    setDescription(initialDescription)
    setDates(initialDates)
    setTags(initialTags)
    setLink(initialLink || '')
    setImage(initialImage || '')
    setVideo(initialVideo || '')
  }

  return (
    <Card className="flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full relative">
      <div className="absolute top-2 right-2 z-10 flex">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              aria-label="Save changes"
            >
              <SaveIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancel}
              aria-label="Cancel editing"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEditing(true)}
            aria-label="Edit project card"
          >
            <Edit2Icon className="h-4 w-4" />
          </Button>
        )}
      </div>
      {isEditing ? (
        <div className="p-2">
          <Input
            type="text"
            value={video || image}
            onChange={(e) => video ? setVideo(e.target.value) : setImage(e.target.value)}
            placeholder={video ? "Video URL" : "Image URL"}
            className="mb-2"
          />
        </div>
      ) : (
        <Link href={href || "#"} className={cn("block cursor-pointer", className)}>
          {video && (
            <video
              src={video}
              autoPlay
              loop
              muted
              playsInline
              className="pointer-events-none mx-auto h-40 w-full object-cover object-top"
            />
          )}
          {image && (
            <Image
              src={image}
              alt={title}
              width={500}
              height={300}
              className="h-40 w-full overflow-hidden object-cover object-top"
            />
          )}
        </Link>
      )}
      <CardHeader className="px-2">
        <div className="space-y-1">
          <CardTitle className="mt-1 text-base">
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
          </CardTitle>
          <time className="font-sans text-xs">
            {isEditing ? (
              <Input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full"
              />
            ) : (
              dates
            )}
          </time>
          <div className="hidden font-sans text-xs underline print:visible">
            {isEditing ? (
              <Input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full"
                placeholder="Link URL"
              />
            ) : (
              link?.replace("https://", "").replace("www.", "").replace("/", "")
            )}
          </div>
          {isEditing ? (
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full"
              placeholder="Description"
            />
          ) : (
            <Markdown className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert">
              {description}
            </Markdown>
          )}
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-2">
        {isEditing ? (
          <Input
            type="text"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()))}
            className="w-full"
            placeholder="Tags (comma-separated)"
          />
        ) : (
          tags.map((tag) => (
            <Badge
              className="px-1 py-0 text-[10px] mr-1 mb-1"
              variant="secondary"
              key={tag}
            >
              {tag}
            </Badge>
          ))
        )}
      </CardContent>
      <CardFooter className="px-2 pb-2">
        {initialLinks && initialLinks.length > 0 && !isEditing && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {initialLinks.map((link, idx) => (
              <Link href={link?.href} key={idx} target="_blank">
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}