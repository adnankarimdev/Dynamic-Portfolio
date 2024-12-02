"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SocialPlatformForm from "./social-platform-form";
import { NavItemForm } from "./nav-item-form";
import { ContactForm } from "./contact-form";
import { WorkExperienceForm } from "./work-experience-form";
import { EducationForm } from "./education-form";
import { ProjectForm } from "./project-form";
import { CertificationForm } from "./certification-form";
import { HackathonForm } from "./hackathon-form";
import { PaperForm } from "./paper-form";
import { AwardForm } from "./award-form";
import { PortfolioData } from "@/components/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { Separator } from "../separator";

interface PortfolioFormSelectorProps {
  data: PortfolioData;
  setData: React.Dispatch<React.SetStateAction<PortfolioData>>;
}

export function PortfolioFormSelector({
  data,
  setData,
}: PortfolioFormSelectorProps) {
  const [selectedForm, setSelectedForm] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const formComponents: { [key: string]: React.ComponentType<any> } = {
    socialPlatform: SocialPlatformForm,
    navItem: NavItemForm,
    contact: ContactForm,
    workExperience: WorkExperienceForm,
    education: EducationForm,
    project: ProjectForm,
    certification: CertificationForm,
    hackathon: HackathonForm,
    paper: PaperForm,
    award: AwardForm,
  };

  const handleSubmit = (formData: any) => {
    setData((prevData) => {
      const newData = { ...prevData };
      switch (selectedForm) {
        case "socialPlatform":
          newData.contact.social = {
            ...newData.contact.social,
            [formData.name]: formData,
          };
          break;
        case "navItem":
          if (editingItem) {
            newData.navbar = newData.navbar.map((item) =>
              item.href === editingItem.href ? formData : item,
            );
          } else {
            newData.navbar = [...newData.navbar, formData];
          }
          break;
        case "contact":
          newData.contact = { ...newData.contact, ...formData };
          break;
        case "workExperience":
          if (editingItem) {
            newData.work = newData.work.map((item) =>
              item.id === editingItem.id ? { ...formData, id: item.id } : item,
            );
          } else {
            newData.work = [
              ...newData.work,
              { ...formData, id: BigInt(Date.now()) },
            ];
          }
          break;
        case "education":
          if (editingItem) {
            newData.education = newData.education.map((item) =>
              item.school === editingItem.school ? formData : item,
            );
          } else {
            newData.education = [...newData.education, formData];
          }
          break;
        case "project":
          if (editingItem) {
            newData.projects = newData.projects.map((item) =>
              item.title === editingItem.title ? formData : item,
            );
          } else {
            newData.projects = [...newData.projects, formData];
          }
          break;
        case "certification":
          if (editingItem) {
            newData.certifications = newData.certifications.map((item) =>
              item.title === editingItem.title ? formData : item,
            );
          } else {
            newData.certifications = [...newData.certifications, formData];
          }
          break;
        case "hackathon":
          if (editingItem) {
            newData.hackathons = newData.hackathons.map((item) =>
              item.title === editingItem.title ? formData : item,
            );
          } else {
            newData.hackathons = [...newData.hackathons, formData];
          }
          break;
        case "paper":
          if (editingItem) {
            newData.papers = newData.papers.map((item) =>
              item.title === editingItem.title ? formData : item,
            );
          } else {
            newData.papers = [...newData.papers, formData];
          }
          break;
        case "award":
          if (editingItem) {
            newData.awards = newData.awards.map((item) =>
              item.title === editingItem.title ? formData : item,
            );
          } else {
            newData.awards = [...newData.awards, formData];
          }
          break;
      }
      return newData;
    });
    setEditingItem(null);
  };

  const handleDelete = (type: string, item: any) => {
    setData((prevData) => {
      const newData = { ...prevData };
      switch (type) {
        case "socialPlatform":
          delete newData.contact.social[
            item.name as keyof typeof newData.contact.social
          ];
          break;
        case "navItem":
          newData.navbar = newData.navbar.filter(
            (navItem) => navItem.href !== item.href,
          );
          break;
        case "workExperience":
          newData.work = newData.work.filter((work) => work.id !== item.id);
          break;
        case "education":
          newData.education = newData.education.filter(
            (edu) => edu.school !== item.school,
          );
          break;
        case "project":
          newData.projects = newData.projects.filter(
            (project) => project.title !== item.title,
          );
          break;
        case "certification":
          newData.certifications = newData.certifications.filter(
            (cert) => cert.title !== item.title,
          );
          break;
        case "hackathon":
          newData.hackathons = newData.hackathons.filter(
            (hackathon) => hackathon.title !== hackathon.title,
          );
          break;
        case "paper":
          newData.papers = newData.papers.filter(
            (paper) => paper.title !== item.title,
          );
          break;
        case "award":
          newData.awards = newData.awards.filter(
            (award) => award.title !== item.title,
          );
          break;
      }
      return newData;
    });
  };

  const SelectedForm = selectedForm ? formComponents[selectedForm] : null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">Add/Edit Portfolio Data</Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add/Edit Portfolio Data</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Select
            onValueChange={setSelectedForm}
            value={selectedForm || undefined}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select data type to add/edit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="socialPlatform">Social Platform</SelectItem>
              {/* <SelectItem value="navItem">Navigation Item</SelectItem> */}
              <SelectItem value="contact">Contact Information</SelectItem>
              <SelectItem value="workExperience">Work Experience</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="project">Project</SelectItem>
              <SelectItem value="certification">Certification</SelectItem>
              <SelectItem value="hackathon">Hackathon</SelectItem>
              <SelectItem value="paper">Paper</SelectItem>
              <SelectItem value="award">Award</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Separator className="mt-2 mb-2" />

        <ScrollArea className="h-[calc(100vh-180px)]">
          {SelectedForm && (
            <SelectedForm
              onSubmit={handleSubmit}
              editingItem={editingItem}
              key={editingItem ? "editing" : "adding"}
            />
          )}
          {selectedForm && (
            <div className="mt-6">
              <h3 className="mb-4 text-lg font-semibold">Existing Items</h3>
              {selectedForm === "socialPlatform" && (
                <>
                  {Object.entries(data.contact.social).map(([key, value]) => (
                    <ExistingItemCard
                      key={key}
                      item={value}
                      onEdit={() => setEditingItem(value)}
                      onDelete={() => handleDelete("socialPlatform", value)}
                    />
                  ))}
                </>
              )}
              {selectedForm === "navItem" && (
                <>
                  {data.navbar.map((item) => (
                    <ExistingItemCard
                      key={item.href}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                      onDelete={() => handleDelete("navItem", item)}
                    />
                  ))}
                </>
              )}
              {selectedForm === "workExperience" && (
                <>
                  {data.work.map((item) => (
                    <ExistingItemCard
                      key={item.id.toString()}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                      onDelete={() => handleDelete("workExperience", item)}
                    />
                  ))}
                </>
              )}
              {selectedForm === "education" && (
                <>
                  {data.education.map((item) => (
                    <ExistingItemCard
                      key={item.school}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                      onDelete={() => handleDelete("education", item)}
                    />
                  ))}
                </>
              )}
              {selectedForm === "project" && (
                <>
                  {data.projects.map((item) => (
                    <ExistingItemCard
                      key={item.title}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                      onDelete={() => handleDelete("project", item)}
                    />
                  ))}
                </>
              )}
              {selectedForm === "certification" && (
                <>
                  {data.certifications.map((item) => (
                    <ExistingItemCard
                      key={item.title}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                      onDelete={() => handleDelete("certification", item)}
                    />
                  ))}
                </>
              )}
              {selectedForm === "hackathon" && (
                <>
                  {data.hackathons.map((item) => (
                    <ExistingItemCard
                      key={item.title}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                      onDelete={() => handleDelete("hackathon", item)}
                    />
                  ))}
                </>
              )}
              {selectedForm === "paper" && (
                <>
                  {data.papers.map((item) => (
                    <ExistingItemCard
                      key={item.title}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                      onDelete={() => handleDelete("paper", item)}
                    />
                  ))}
                </>
              )}
              {selectedForm === "award" && (
                <>
                  {data.awards.map((item) => (
                    <ExistingItemCard
                      key={item.title}
                      item={item}
                      onEdit={() => setEditingItem(item)}
                      onDelete={() => handleDelete("award", item)}
                    />
                  ))}
                </>
              )}
            </div>
          )}
          <Button
            variant="outline"
            onClick={() => setEditingItem(null)}
            className="mt-4"
          >
            Cancel Editing
          </Button>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function ExistingItemCard({
  item,
  onEdit,
  onDelete,
}: {
  item: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>
          {item.title || item.name || item.company || item.school}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          {item.description ||
            item.dates ||
            item.location ||
            item.degree ||
            item.issuingOrganization ||
            ""}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="destructive" onClick={onDelete}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
