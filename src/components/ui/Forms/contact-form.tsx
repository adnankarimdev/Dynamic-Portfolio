"use client";

import { Contact } from "@/components/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface ContactFormProps {
  onSubmit: (data: Contact) => void;
  editingItem?: Contact;
}

export function ContactForm({ onSubmit, editingItem }: ContactFormProps) {
  const [formData, setFormData] = useState<Contact>(
    editingItem || {
      email: "",
      tel: "",
      social: {
        GitHub: { name: "GitHub", url: "", icon: "", navbar: false },
        LinkedIn: { name: "LinkedIn", url: "", icon: "", navbar: false },
        X: { name: "X", url: "", icon: "", navbar: false },
        Youtube: { name: "Youtube", url: "", icon: "", navbar: false },
        email: { name: "email", url: "", icon: "", navbar: false },
      },
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="tel">Telephone</Label>
        <Input
          id="tel"
          name="tel"
          type="tel"
          value={formData.tel}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">
        {editingItem ? "Update Contact Information" : "Add Contact Information"}
      </Button>
    </form>
  );
}
