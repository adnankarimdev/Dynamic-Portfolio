import React, { useState } from 'react';
import { Button } from '../button';
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

const SocialPlatformForm: React.FC<SocialPlatformFormProps> = ({ onSubmit, editingItem }) => {
  const [formData, setFormData] = useState<SocialPlatform>(
    editingItem || {
      name: "",
      url: "",
      icon: "",
      navbar: false,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="url">URL:</label>
        <input type="text" id="url" name="url" value={formData.url} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="icon">Icon:</label>
        <input type="text" id="icon" name="icon" value={formData.icon} onChange={handleChange} />
      </div>
      <div>
        <label htmlFor="navbar">Navbar:</label>
        <input type="checkbox" id="navbar" name="navbar" checked={formData.navbar} onChange={handleChange} />
      </div>
      <Button type="submit">
        {editingItem ? "Update Social Platform" : "Add Social Platform"}
      </Button>
    </form>
  );
};

export default SocialPlatformForm;

