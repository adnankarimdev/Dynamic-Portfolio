"use client";

import { ChangeEvent, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRightIcon,
  Edit2Icon,
  Info,
  SaveIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PortfolioData } from "./types/types";
import { title } from "process";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
  readOnly: boolean;
  data?: PortfolioData;
  setData?: React.Dispatch<React.SetStateAction<PortfolioData>>;
  targetId?: BigInt;
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
  readOnly,
  data,
  setData,
  targetId,
}: ResumeCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [logoUrl, setLogoUrl] = useState(initialLogoUrl);
  const [inputUrlValue, setInputUrlValue] = useState("");
  const [altText, setAltText] = useState(initialAltText);
  const [company, setCompany] = useState(initialTitle);
  const [subtitle, setSubtitle] = useState(initialSubtitle || "");
  const [href, setHref] = useState(initialHref || "");
  const [badges, setBadges] = useState(initialBadges?.join(", ") || "");
  const [period, setPeriod] = useState(initialPeriod);
  const [description, setDescription] = useState(initialDescription || "");

  const handleSave = () => {
    setIsEditing(false);
    if (logoUrl === "https://logo.clearbit.com/") {
      setLogoUrl(initialLogoUrl);
    }

    const newData = {
      logoUrl,
      altText,
      company: company,
      title: subtitle,
      href: href || undefined,
      badges: badges.split(",").map((badge) => badge.trim()),
      period,
      description: description || undefined,
    };

    console.log("Target ID:", targetId); // Debug log

    if (setData) {
      setData((prevData) => ({
        ...prevData,
        work: prevData.work.map((experience) => {
          if (experience.id === targetId) {
            console.log("Condition met for ID:", targetId, newData); // Log matched experience and new data
            return {
              ...experience, // Spread existing experience properties
              ...newData, // Overwrite with updated fields
            };
          }
          return experience; // Return unchanged for non-matching IDs
        }),
      }));
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (description && !isEditing) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };

  const getUrlWithoutProtocol = (inputUrl: string) => {
    const match = inputUrl.match(/(?:https?|ftp):\/\/(.*)/); // Matches "http", "https", or "ftp" protocols
    if (match) {
      return match[1]; // This will give the URL part after the protocol
    }
    return inputUrl; // If no protocol, return the original URL
  };

  const handleInputLocalUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value;
    console.log("emptyyy", e.target.value);
    const cleanedUrl = getUrlWithoutProtocol(newInputValue);
    setInputUrlValue(cleanedUrl);
    console.log("https://logo.clearbit.com/" + cleanedUrl);
    setLogoUrl("https://logo.clearbit.com/" + cleanedUrl); // Append the domain
  };

  return (
    <Card className="flex relative">
      <div className="flex justify-end">
        <div className="flex items-center space-x-4 mb-2">
          {!readOnly && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
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
                <Check className="h-4 w-4" />
              ) : (
                <Edit2Icon className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      <div className="flex-none">
        <Avatar className="border size-12 m-auto bg-muted-background dark:bg-foreground">
          <AvatarImage
            src={
              logoUrl.trim() == "https://logo.clearbit.com/"
                ? initialLogoUrl
                : logoUrl
            }
            alt={altText}
            className="object-contain"
          />
          <AvatarFallback>{altText[0]}</AvatarFallback>
        </Avatar>
        {isEditing && (
          <div className="relative w-full py-4">
            <Input
              type="text"
              value={
                inputUrlValue === ""
                  ? logoUrl.replace("https://logo.clearbit.com/", "")
                  : inputUrlValue
              }
              onChange={handleInputLocalUrlChange}
              className="mt-2 w-full pl-4 pr-10" // Add padding for the icon space
              placeholder="Logo URL"
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="absolute right-2 top-1/2 transform -translate-y-1/2 mt-1" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{"Paste company url"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Adjust positioning of the Info icon */}
          </div>
        )}
      </div>
      <div
        className="flex-grow ml-4 items-center flex-col group"
        onClick={handleClick}
      >
        <CardHeader>
          <div className="flex items-center justify-between gap-x-2 text-base">
            <h3 className="inline-flex items-center justify-center font-semibold leading-none text-xs sm:text-sm">
              {isEditing ? (
                <Input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full"
                />
              ) : (
                company
              )}
              {!isEditing && badges && (
                <span className="inline-flex gap-x-1 ml-2">
                  {badges.split(",").map((badge, index) => (
                    <Badge
                      variant="secondary"
                      className="align-middle text-xs"
                      key={index}
                    >
                      {badge.trim()}
                    </Badge>
                  ))}
                </span>
              )}
              {!isEditing && (
                <ChevronRightIcon
                  className={cn(
                    "size-4 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                    isExpanded ? "rotate-90" : "rotate-0",
                  )}
                />
              )}
            </h3>
            <div className="text-xs sm:text-sm tabular-nums text-muted-foreground text-right">
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
            </div>
          </div>
          {isEditing ? (
            <Input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full mt-2"
              placeholder="Subtitle"
            />
          ) : (
            subtitle && <div className="font-sans text-xs">{subtitle}</div>
          )}
          {isEditing && (
            <div className="mt-2">
              <Input
                type="text"
                value={badges}
                onChange={(e) => setBadges(e.target.value)}
                className="w-full"
                placeholder="Badges (comma-separated)"
              />
            </div>
          )}
        </CardHeader>
        {(description || isEditing) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{
              opacity: isExpanded || isEditing ? 1 : 0,
              height: isExpanded || isEditing ? "auto" : 0,
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-2 text-xs sm:text-sm"
          >
            {isEditing ? (
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
                placeholder="Description"
              />
            ) : (
              description
            )}
          </motion.div>
        )}
      </div>
    </Card>
  );
};
