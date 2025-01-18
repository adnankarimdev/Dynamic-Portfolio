"use client";

import { Project, ProjectLink } from "@/components/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";

interface ProjectFormProps {
  onSubmit: (data: Project) => void;
  editingItem?: Project;
}

export function ProjectForm({ onSubmit, editingItem }: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>(
    editingItem || {
      title: "",
      href: "",
      dates: "",
      active: false,
      description: "",
      technologies: [],
      links: [],
      image: "",
      video: "",
    }
  );

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    }
  }, [editingItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTechnologiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      technologies: e.target.value.split(", "),
    }));
  };

  const handleLinksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const links: ProjectLink[] = JSON.parse(e.target.value);
      setFormData((prev) => ({ ...prev, links }));
    } catch (error) {
      console.error("Invalid JSON for links");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="href">Project URL</Label>
        <Input
          id="href"
          name="href"
          type="url"
          value={formData.href}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="dates">Dates</Label>
        <Input
          id="dates"
          name="dates"
          value={formData.dates}
          onChange={handleChange}
          required
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="active"
          checked={formData.active}
          onCheckedChange={(checked) =>
            setFormData((prev) => ({ ...prev, active: checked }))
          }
        />
        <Label htmlFor="active">Active Project</Label>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          name="technologies"
          value={(formData.technologies || []).join(", ")}
          onChange={handleTechnologiesChange}
        />
      </div>
      <div>
        <Label htmlFor="links">Links (JSON format)</Label>
        <Textarea
          id="links"
          name="links"
          value={JSON.stringify(formData.links, null, 2)}
          onChange={handleLinksChange}
        />
      </div>
      <div>
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          name="image"
          type="url"
          value={formData.image}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="video">Video URL</Label>
        <Input
          id="video"
          name="video"
          type="url"
          value={formData.video}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">
        {editingItem ? "Update Project" : "Add Project"}
      </Button>
    </form>
  );
}
