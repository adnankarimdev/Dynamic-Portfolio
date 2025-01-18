"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { ChevronDown, Edit2Icon, ExternalLink, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
  onSave?: (updatedData: Partial<ResumeCardProps>) => void;
  readOnly: boolean;
}

export const ResumeCard = ({
  logoUrl: initialLogoUrl,
  altText: initialAltText,
  title: initialTitle,
  subtitle: initialSubtitle,
  href: initialHref,
  badges: initialBadges,
  period: initialPeriod,
  description: initialDescription,
  onSave,
  readOnly,
}: ResumeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [altText, setAltText] = useState(initialAltText);
  const [title, setTitle] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle || "");
  const [href, setHref] = useState(initialHref || "");
  const [badges, setBadges] = useState(initialBadges?.join(", ") || "");
  const [period, setPeriod] = useState(initialPeriod);
  const [description, setDescription] = useState(initialDescription || "");

  const handleSave = () => {
    setIsEditing(false);
    if (onSave) {
      onSave({
        logoUrl,
        altText,
        title,
        subtitle: subtitle || undefined,
        href: href || undefined,
        badges: badges.split(",").map((badge) => badge.trim()),
        period,
        description: description || undefined,
      });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (description && !isEditing) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <Avatar className="w-16 h-16 border-2 border-primary">
            {isEditing ? (
              <Input
                type="text"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full h-full"
                placeholder="Logo URL"
              />
            ) : (
              <AvatarImage src={logoUrl} alt={altText} />
            )}
            <AvatarFallback>{altText[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {isEditing ? (
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  title
                )}
              </h3>
              <span className="text-sm text-muted-foreground">
                {isEditing ? (
                  <Input
                    type="text"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full"
                  />
                ) : (
                  period
                )}
              </span>
            </div>
            {(subtitle || isEditing) && (
              <p className="text-sm text-muted-foreground">
                {isEditing ? (
                  <Input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    className="w-full"
                    placeholder="Subtitle"
                  />
                ) : (
                  subtitle
                )}
              </p>
            )}
            {(badges || isEditing) && (
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  <Input
                    type="text"
                    value={badges}
                    onChange={(e) => setBadges(e.target.value)}
                    className="w-full"
                    placeholder="Badges (comma-separated)"
                  />
                ) : (
                  badges.split(",").map((badge, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {badge.trim()}
                    </Badge>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        {(description || isEditing) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: isExpanded || isEditing ? "auto" : 0,
              opacity: isExpanded || isEditing ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
            className="mt-4 overflow-hidden"
          >
            {isEditing ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
                placeholder="Description"
              />
            ) : (
              <p className="text-sm leading-relaxed">{description}</p>
            )}
          </motion.div>
        )}
        <div className="flex justify-between items-center mt-4">
          {!readOnly && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                if (isEditing) {
                  handleSave();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
                <SaveIcon className="h-4 w-4 mr-2" />
              ) : (
                <Edit2Icon className="h-4 w-4 mr-2" />
              )}
              {isEditing ? "Save" : "Edit"}
            </Button>
          )}
          {href && !isEditing && (
            <Link href={href} passHref>
              <Button variant="outline" size="sm" className="text-primary">
                <ExternalLink className="w-4 h-4 mr-2" />
                Visit
              </Button>
            </Link>
          )}
          {description && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="ml-auto"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-300 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
              {isExpanded ? "Less" : "More"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
