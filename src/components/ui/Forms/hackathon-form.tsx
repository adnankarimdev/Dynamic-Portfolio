"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Hackathon, HackathonLink } from "@/components/types/types";

interface HackathonFormProps {
  onSubmit: (data: Hackathon) => void;
}

export function HackathonForm({ onSubmit }: HackathonFormProps) {
  const [formData, setFormData] = useState<Hackathon>({
    title: "",
    dates: "",
    location: "",
    description: "",
    image: "",
    mlh: "",
    win: "",
    links: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const links: HackathonLink[] = JSON.parse(e.target.value);
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
        <Label htmlFor="title">Hackathon Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
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
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />
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
        <Label htmlFor="mlh">MLH Event URL</Label>
        <Input
          id="mlh"
          name="mlh"
          type="url"
          value={formData.mlh}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="win">Win Details</Label>
        <Input
          id="win"
          name="win"
          value={formData.win}
          onChange={handleChange}
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
      <Button type="submit">Add Hackathon</Button>
    </form>
  );
}
