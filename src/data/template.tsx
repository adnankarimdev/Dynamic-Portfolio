import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "",
  initials: "",
  url: "",
  location: "",
  locationLink: "",
  description: "",
  summary: "",
  avatarUrl: "",
  skills: [],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "",
        icon: Icons.x,
        navbar: true,
      },
      Youtube: {
        name: "Youtube",
        url: "",
        icon: Icons.youtube,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "",
        icon: Icons.email,
        navbar: false,
      },
    },
  },
  work: [
    {
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
  ],
  education: [
    {
      school: "",
      href: "",
      degree: "",
      logoUrl: "",
      start: "",
      end: "",
    },
  ],
  projects: [
    {
      title: "",
      href: "",
      dates: "",
      active: false,
      description: "",
      technologies: [],
      links: [
        {
          type: "",
          href: "",
          icon: null,
        },
      ],
      image: "",
      video: "",
    },
  ],
  //we'll probs want to make different keys; not hackathon perse. but all sorts of tech resumes
  hackathons: [
    {
      title: "",
      dates: "",
      location: "",
      description: "",
      image: "",
      mlh: "", // Optional
      win: "", // Optional
      links: [
        {
          title: "",
          icon: null,
          href: "",
        },
      ],
    },
  ],
} as const;
