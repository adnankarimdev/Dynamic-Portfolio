"use client"

import { useState } from "react"
import { Project } from "@/components/types/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface ProjectFormProps {
  project?: Project
  onSubmit: (project: Project) => void
}

export function ProjectForm({ project, onSubmit }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(
    project || {
      title: "",
      href: "",
      dates: "",
      active: true,
      description: "",
      technologies: [],
      links: [],
      image: "",
      video: "",
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="href">Link</Label>
        <Input id="href" name="href" value={formData.href} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="dates">Dates</Label>
        <Input id="dates" name="dates" value={formData.dates} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          name="technologies"
          value={formData.technologies.join(", ")}
          onChange={(e) => setFormData((prev) => ({ ...prev, technologies: e.target.value.split(", ") }))}
        />
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" name="image" value={formData.image} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="video">Video URL</Label>
        <Input id="video" name="video" value={formData.video} onChange={handleChange} />
      </div>
      <Button type="submit">{project ? "Update Project" : "Add Project"}</Button>
    </form>
  )
}

