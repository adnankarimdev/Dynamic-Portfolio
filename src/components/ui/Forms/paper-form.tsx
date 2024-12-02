"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Paper } from "@/components/types/types";

interface PaperFormProps {
  onSubmit: (data: Paper) => void;
}

export function PaperForm({ onSubmit }: PaperFormProps) {
  const [formData, setFormData] = useState<Paper>({
    title: "",
    coAuthors: [],
    publicationDate: "",
    conference: "",
    journal: "",
    doi: "",
    abstract: "",
    link: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoAuthorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, coAuthors: e.target.value.split(", ") }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        publicationDate: format(date, "yyyy-MM-dd"),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Paper Title</Label>
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
          onChange={handleCoAuthorsChange}
        />
      </div>
      <div className="space-y-2">
        <Label>Publication Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.publicationDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.publicationDate ? (
                format(new Date(formData.publicationDate), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={
                formData.publicationDate
                  ? new Date(formData.publicationDate)
                  : undefined
              }
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
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
          required
        />
      </div>
      <div>
        <Label htmlFor="link">Paper URL</Label>
        <Input
          id="link"
          name="link"
          type="url"
          value={formData.link}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">Add Paper</Button>
    </form>
  );
}
