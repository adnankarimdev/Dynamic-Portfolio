"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "../calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Certification } from "@/components/types/types";

interface CertificationFormProps {
  onSubmit: (data: Certification) => void;
  editingItem?: Certification;
}

export function CertificationForm({
  onSubmit,
  editingItem,
}: CertificationFormProps) {
  const [formData, setFormData] = useState<Certification>(
    editingItem || {
      title: "",
      issuingOrganization: "",
      logoUrl: "",
      dateIssued: "",
      credentialId: "",
      url: "",
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

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        dateIssued: format(date, "yyyy-MM-dd"),
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
        <Label htmlFor="title">Certification Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="issuingOrganization">Issuing Organization</Label>
        <Input
          id="issuingOrganization"
          name="issuingOrganization"
          value={formData.issuingOrganization}
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
          
        />
      </div>
      <div className="space-y-2">
        <Label>Date Issued</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.dateIssued && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dateIssued ? (
                format(new Date(formData.dateIssued), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={
                formData.dateIssued ? new Date(formData.dateIssued) : undefined
              }
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="credentialId">Credential ID</Label>
        <Input
          id="credentialId"
          name="credentialId"
          value={formData.credentialId}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="url">Certification URL</Label>
        <Input
          id="url"
          name="url"
          type="url"
          value={formData.url}
          onChange={handleChange}
        />
      </div>
      <Button type="submit">
        {editingItem ? "Update Certification" : "Add Certification"}
      </Button>
    </form>
  );
}
