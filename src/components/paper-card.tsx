import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Edit, Trash } from 'lucide-react'
import Link from "next/link"
import Markdown from "react-markdown"

interface Paper {
  title: string
  coAuthors: string[]
  publicationDate: string
  conference?: string
  journal?: string
  doi?: string
  abstract: string
  link?: string
  className?: string
  onEdit?: () => void
  onDelete?: () => void
}

export function PaperCard({
  title,
  coAuthors,
  publicationDate,
  conference,
  journal,
  doi,
  abstract,
  link,
  className,
  onEdit,
  onDelete,
}: Paper) {
  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden border hover:shadow-lg transition-all duration-300 ease-out h-full",
        className,
      )}
    >
      <CardHeader className="px-4 py-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <time className="font-sans text-xs text-muted-foreground">
          {publicationDate}
        </time>
        <div className="mt-1 flex flex-wrap gap-1">
          {coAuthors.map((author, index) => (
            <Badge key={index} className="text-[10px]" variant="secondary">
              {author}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-4 py-2">
        {abstract && (
          <Markdown className="prose max-w-full text-sm text-muted-foreground dark:prose-invert">
            {abstract}
          </Markdown>
        )}
        {conference && (
          <p className="mt-2 text-xs font-medium text-muted-foreground">
            Presented at: {conference}
          </p>
        )}
        {journal && (
          <p className="text-xs font-medium text-muted-foreground">
            Published in: {journal}
          </p>
        )}
        {doi && (
          <p className="mt-1 text-xs">
            DOI:{" "}
            <Link
              href={`https://doi.org/${doi}`}
              target="_blank"
              className="text-primary underline"
            >
              {doi}
            </Link>
          </p>
        )}
      </CardContent>
      <CardFooter className="px-4 py-2 flex justify-between items-center">
        {link && (
          <Link
            href={link}
            target="_blank"
            className="text-sm font-medium text-primary underline"
          >
            View Full Paper
          </Link>
        )}
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit paper</span>
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash className="h-4 w-4" />
            <span className="sr-only">Delete paper</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

