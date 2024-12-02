"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Education } from "@/components/types/types";

interface EducationFormProps {
  onSubmit: (data: Education) => void;
  editingItem?: Education;
}

export function EducationForm({ onSubmit, editingItem }: EducationFormProps) {
  const [formData, setFormData] = useState<Education>(
    editingItem || {
      school: "",
      href: "",
      degree: "",
      logoUrl: "",
      start: "",
      end: "",
    },
  );

  useEffect(() => {
    if (editingItem) {
      setFormData(editingItem);
    }
  }, [editingItem]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <Label htmlFor="school">School</Label>
        <Input
          id="school"
          name="school"
          value={formData.school}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="href">School Website</Label>
        <Input
          id="href"
          name="href"
          type="url"
          value={formData.href}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="degree">Degree</Label>
        <Input
          id="degree"
          name="degree"
          value={formData.degree}
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
      <Button type="submit">
        {editingItem ? "Update Education" : "Add Education"}
      </Button>
    </form>
  );
}
