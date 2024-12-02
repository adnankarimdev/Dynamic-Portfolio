import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

interface SocialPlatform {
  name: string;
  url: string;
  icon: string;
  navbar: boolean;
}

interface SocialPlatformFormProps {
  onSubmit: (data: SocialPlatform) => void;
  editingItem?: SocialPlatform;
}

const SocialPlatformForm: React.FC<SocialPlatformFormProps> = ({
  onSubmit,
  editingItem,
}) => {
  const [formData, setFormData] = useState<SocialPlatform>(
    editingItem || {
      name: "",
      url: "",
      icon: "",
      navbar: false,
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mb-2 mt-2">
          {editingItem ? "Edit Social Platform" : "Add Social Platform"}
        </CardTitle>
        <CardDescription>
          Enter the details of the social platform you want to add or edit.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Platform Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="icon">Icon</Label>
            <Input
              id="icon"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="navbar"
              checked={formData.navbar}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, navbar: checked as boolean }))
              }
            />
            <Label htmlFor="navbar">Show in Navbar</Label>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit">
            {editingItem ? "Update Social Platform" : "Add Social Platform"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SocialPlatformForm;
