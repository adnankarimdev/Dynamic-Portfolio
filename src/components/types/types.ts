interface SocialPlatform {
    name: string;
    url: string;
    icon: string;
    navbar: boolean;
  }
  
  interface NavItem {
    href: string;
    icon: string;
    label: string;
  }
  
  interface Contact {
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
  
  interface WorkExperience {
    company: string;
    href: string;
    badges: string[];
    location: string;
    title: string;
    logoUrl: string;
    start: string;
    end: string;
    description: string;
  }
  
  interface Education {
    school: string;
    href: string;
    degree: string;
    logoUrl: string;
    start: string;
    end: string;
  }
  
  interface ProjectLink {
    type: string;
    href: string;
    icon: string | null;
  }
  
  interface Project {
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
  
  interface HackathonLink {
    title: string;
    icon: string | null;
    href: string;
  }
  
  interface Hackathon {
    title: string;
    dates: string;
    location: string;
    description: string;
    image: string;
    mlh?: string;
    win?: string;
    links: HackathonLink[];
  }
  
  export interface PortfolioData {
    name: string;
    initials: string;
    url: string;
    location: string;
    locationLink: string;
    description: string;
    summary: string;
    avatarUrl: string;
    skills: string[];
    navbar: NavItem[];
    contact: Contact;
    work: WorkExperience[];
    education: Education[];
    projects: Project[];
    hackathons: Hackathon[];
  }