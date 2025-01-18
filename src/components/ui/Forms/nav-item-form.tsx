"use client";

import { NavItem } from "@/components/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

interface NavItemFormProps {
  onSubmit: (data: NavItem) => void;
  editingItem?: NavItem;
}

export function NavItemForm({ onSubmit, editingItem }: NavItemFormProps) {
  const [formData, setFormData] = useState<NavItem>(
    editingItem || {
      href: "",
      icon: "",
      label: "",
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
        <Label htmlFor="href">Link</Label>
        <Input
          id="href"
          name="href"
          type="url"
          value={formData.href}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="icon">Icon</Label>
        <Input
          id="icon"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          name="label"
          value={formData.label}
          onChange={handleChange}
          required
        />
      </div>
      <Button type="submit">
        {editingItem ? "Update Navigation Item" : "Add Navigation Item"}
      </Button>
    </form>
  );
}
