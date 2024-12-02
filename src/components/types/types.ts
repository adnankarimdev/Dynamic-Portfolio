export interface SocialPlatform {
  name: string;
  url: string;
  icon: string;
  navbar: boolean;
}

export interface NavItem {
  href: string;
  icon: string;
  label: string;
}

export interface Contact {
  email: string;
  tel: string;
  social: {
    GitHub: SocialPlatform;
    LinkedIn: SocialPlatform;
    X: SocialPlatform;
    Youtube: SocialPlatform;
    email: SocialPlatform;
  };
}

export interface WorkExperience {
  id: BigInt;
  company: string;
  href?: string;
  badges: string[];
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  description?: string;
}

export interface Education {
  school: string;
  href: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
}

export interface ProjectLink {
  type: string;
  href: string;
  icon: string | null;
}

export interface Project {
  title: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: string[];
  links: ProjectLink[];
  image: string;
  video: string;
}

export interface Certification {
  title: string;
  issuingOrganization: string;
  logoUrl: string;
  dateIssued: string;
  credentialId: string;
  url: string;
}

export interface HackathonLink {
  title: string;
  icon: string | null;
  href: string;
}

export interface Hackathon {
  title: string;
  dates: string;
  location: string;
  description: string;
  image: string;
  mlh?: string;
  win?: string;
  links: HackathonLink[];
}

export interface Paper {
  title: string;
  coAuthors: string[];
  publicationDate: string;
  conference?: string;
  journal?: string;
  doi?: string;
  abstract: string;
  link?: string;
  className?: string;
}

export interface Award {
  title: string;
  organization: string;
  dateAwarded: string;
  description: string;
  image?: string;
}

export interface PortfolioData {
  name: string;
  initials: string;
  url: string;
  location: string;
  locationLink: string;
  description: string;
  certifications: Certification[];
  summary: string;
  avatarUrl: string;
  skills: string[];
  navbar: NavItem[];
  contact: Contact;
  work: WorkExperience[];
  education: Education[];
  projects: Project[];
  hackathons: Hackathon[];
  papers: Paper[];
  awards: Award[];
  papersWebsiteHeader?: string;
  papersWebsiteSubtitle?: string;
  projectsWebsiteHeader?: string;
  projectsWebsiteSubtitle?: string;
  hackathonWebsiteHeader?: string;
  hackathonWebsiteSubtitle?: string;
}
