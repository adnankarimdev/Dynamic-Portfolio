"use client";

import { Paper } from "@/components/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface PaperFormProps {
  paper?: Paper;
  onSubmit: (paper: Paper) => void;
}

export function PaperForm({ paper, onSubmit }: PaperFormProps) {
  const [formData, setFormData] = useState<Paper>(
    paper || {
      title: "",
      coAuthors: [],
      publicationDate: "",
      conference: "",
      journal: "",
      doi: "",
      abstract: "",
      link: "",
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
        <Label htmlFor="coAuthors">Co-Authors (comma-separated)</Label>
        <Input
          id="coAuthors"
          name="coAuthors"
          value={formData.coAuthors.join(", ")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              coAuthors: e.target.value.split(", "),
            }))
          }
        />
      </div>
      <div>
        <Label htmlFor="publicationDate">Publication Date</Label>
        <Input
          id="publicationDate"
          name="publicationDate"
          type="date"
          value={formData.publicationDate}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="conference">Conference</Label>
        <Input
          id="conference"
          name="conference"
          value={formData.conference}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="journal">Journal</Label>
        <Input
          id="journal"
          name="journal"
          value={formData.journal}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="doi">DOI</Label>
        <Input
          id="doi"
          name="doi"
          value={formData.doi}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="abstract">Abstract</Label>
        <Textarea
          id="abstract"
          name="abstract"
          value={formData.abstract}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="link">Link to Full Paper</Label>
        <Input
          id="link"
          name="link"
          value={formData.link}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">{paper ? "Update Paper" : "Add Paper"}</Button>
    </form>
  );
}
