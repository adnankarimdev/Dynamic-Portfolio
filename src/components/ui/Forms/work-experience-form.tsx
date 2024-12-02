"use client";

import { useState, useEffect } from "react";
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
import { WorkExperience } from "@/components/types/types";

interface WorkExperienceFormProps {
  onSubmit: (data: WorkExperience) => void;
  editingItem?: WorkExperience;
}

export function WorkExperienceForm({
  onSubmit,
  editingItem,
}: WorkExperienceFormProps) {
  const [formData, setFormData] = useState<WorkExperience>(
    editingItem || {
      id: BigInt(0),
      company: "",
      href: "",
      badges: [],
      location: "",
      title: "",
      logoUrl: "",
      start: "",
      end: "",
      description: "",
    },
  );

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    }
  }, [editingItem]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined, field: "start" | "end") => {
    if (date) {
      setFormData((prev) => ({ ...prev, [field]: format(date, "yyyy-MM-dd") }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="href">Company Website</Label>
        <Input
          id="href"
          name="href"
          type="url"
          value={formData.href}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="badges">Badges (comma-separated)</Label>
        <Input
          id="badges"
          name="badges"
          value={(formData.badges || []).join(", ")}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              badges: e.target.value.split(", "),
            }))
          }
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
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="logoUrl">Logo URL</Label>
        <Input
          id="logoUrl"
          name="logoUrl"
          type="url"
          value={formData.logoUrl}
          onChange={handleChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Start Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.start && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.start ? (
                format(new Date(formData.start), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.start ? new Date(formData.start) : undefined}
              onSelect={(date) => handleDateChange(date, "start")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label>End Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.end && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.end ? (
                format(new Date(formData.end), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.end ? new Date(formData.end) : undefined}
              onSelect={(date) => handleDateChange(date, "end")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">
        {editingItem ? "Update Work Experience" : "Add Work Experience"}
      </Button>
    </form>
  );
}
