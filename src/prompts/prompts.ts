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
  navbar: {
    href: string;
    icon: string;
    label: string;
  }[];
  contact: {
    email: string;
    tel: string;
    social: {
      [key: string]: {
        name: string;
        url: string;
        icon: string;
        navbar: boolean;
      };
    };
  };
  work: {
    id: number;
    company: string;
    href: string;
    badges: string[];
    location: string;
    title: string;
    logoUrl: string;
    start: string;
    end: string;
    description: string;
  }[];
  education: {
    school: string;
    href: string;
    degree: string;
    logoUrl: string;
    start: string;
    end: string;
  }[];
  projects: {
    title: string;
    href: string;
    dates: string;
    active: boolean;
    description: string;
    technologies: string[];
    links: {
      type: string;
      href: string;
      icon: string | null;
    }[];
    image: string;
    video: string;
  }[];
  projectsWebsiteHeader: string;
  projectsWebsiteSubtitle: string;
  hackathons: {
    title: string;
    dates: string;
    location: string;
    description: string;
    image: string;
    mlh: string;
    win: string;
    links: {
      title: string;
      icon: string | null;
      href: string;
    }[];
  }[];
  hackathonWebsiteHeader: string;
  hackathonWebsiteSubtitle: string;
  papers: {
    title: string;
    coAuthors: string[];
    publicationDate: string;
    conference: string;
    journal: string;
    doi: string;
    abstract: string;
    link: string;
  }[];
  papersWebsiteHeader: string;
  papersWebsiteSubtitle: string;
  certifications: {
    title: string;
    issuingOrganization: string;
    logoUrl: string;
    dateIssued: string;
    credentialId: string;
    url: string;
  }[];
  volunteerWork: {
    organization: string;
    role: string;
    location: string;
    start: string;
    end: string;
    description: string;
  }[];
  awards: {
    title: string;
    organization: string;
    dateAwarded: string;
    description: string;
  }[];
  languages: {
    name: string;
    proficiency: string;
  }[];
  interests: {
    name: string;
    icon: string;
  }[];
  testimonials: {
    name: string;
    role: string;
    quote: string;
    organization: string;
    avatarUrl: string;
  }[];
  openSourceContributions: {
    project: string;
    repository: string;
    role: string;
    description: string;
    contributionDate: string;
  }[];
  speakingEngagements: {
    title: string;
    event: string;
    location: string;
    date: string;
    slidesLink: string;
    description: string;
  }[];
  patents: {
    title: string;
    patentId: string;
    description: string;
    dateFiled: string;
    status: string;
    url: string;
  }[];
}

export const RESUME_PROMPT = `I will be giving you a resume/cv. Everything should be in first person for where it's relevant. 
Note: Certifications does not imply awards. They are two different things. For example, scholarships and grants fall under awards.
You must not take any shortcuts or skip any details present in the CV unless it does not match the format below. Your goal is to extract the information and put it into this exact format:

[Portfolio Data Structure as defined above]

Fill in the fields with appropriate information. You should also generate the description and summary field based on the resume/cv. Return ONLY the JSON object with no additional text or formatting. All string values must be wrapped in double quotes. For all logos, like logoUrl, use this format: https://logo.clearbit.com/<full_company_name>.com. 
Ensure the response can be parsed by json.loads() in Python.
Note: for coAuthors, also include the name of the person who submitted this resume. Awards can be grants too. Please use your reasoning to figure out what should be included in the awards section. Finally, make sure anything in the same section that has dates is ordered from most recent (first) to earliest (last).`;

export const portfolioSchema = {
  type: "object",
  required: [
    "name",
    "initials",
    "url",
    "location",
    "locationLink",
    "description",
    "summary",
    "avatarUrl",
    "skills",
    "navbar",
    "contact",
    "work",
    "education",
    "projects",
    "projectsWebsiteHeader",
    "projectsWebsiteSubtitle",
    "hackathons",
    "hackathonWebsiteHeader",
    "hackathonWebsiteSubtitle",
    "papers",
    "papersWebsiteHeader",
    "papersWebsiteSubtitle",
    "certifications",
    "volunteerWork",
    "awards",
    "languages",
    "interests",
    "testimonials",
    "openSourceContributions",
    "speakingEngagements",
    "patents",
  ],
  properties: {
    name: { type: "string" },
    initials: { type: "string" },
    url: { type: "string" },
    location: { type: "string" },
    locationLink: { type: "string" },
    description: { type: "string" },
    summary: { type: "string" },
    avatarUrl: { type: "string" },
    skills: {
      type: "array",
      items: { type: "string" },
    },
    navbar: {
      type: "array",
      items: {
        type: "object",
        required: ["href", "icon", "label"],
        properties: {
          href: { type: "string" },
          icon: { type: "string" },
          label: { type: "string" },
        },
      },
    },
    contact: {
      type: "object",
      required: ["email", "tel"],
      properties: {
        email: { type: "string" },
        tel: { type: "string" },
        social: {
          type: "object",
          additionalProperties: {
            type: "object",
            required: ["name", "url", "icon", "navbar"],
            properties: {
              name: { type: "string" },
              url: { type: "string" },
              icon: { type: "string" },
              navbar: { type: "boolean" },
            },
          },
        },
      },
    },
    work: {
      type: "array",
      items: {
        type: "object",
        required: [
          "id",
          "company",
          "href",
          "badges",
          "location",
          "title",
          "logoUrl",
          "start",
          "end",
          "description",
        ],
        properties: {
          id: { type: "number" },
          company: { type: "string" },
          href: { type: "string" },
          badges: {
            type: "array",
            items: { type: "string" },
          },
          location: { type: "string" },
          title: { type: "string" },
          logoUrl: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        required: ["school", "href", "degree", "logoUrl", "start", "end"],
        properties: {
          school: { type: "string" },
          href: { type: "string" },
          degree: { type: "string" },
          logoUrl: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
        },
      },
    },
    projects: {
      type: "array",
      items: {
        type: "object",
        required: [
          "title",
          "href",
          "dates",
          "active",
          "description",
          "technologies",
          "links",
          "image",
          "video",
        ],
        properties: {
          title: { type: "string" },
          href: { type: "string" },
          dates: { type: "string" },
          active: { type: "boolean" },
          description: { type: "string" },
          technologies: {
            type: "array",
            items: { type: "string" },
          },
          links: {
            type: "array",
            items: {
              type: "object",
              required: ["type", "href", "icon"],
              properties: {
                type: { type: "string" },
                href: { type: "string" },
                icon: { type: ["string", "null"] },
              },
            },
          },
          image: { type: "string" },
          video: { type: "string" },
        },
      },
    },
    projectsWebsiteHeader: { type: "string" },
    projectsWebsiteSubtitle: { type: "string" },
    hackathons: {
      type: "array",
      items: {
        type: "object",
        required: [
          "title",
          "dates",
          "location",
          "description",
          "image",
          "mlh",
          "win",
          "links",
        ],
        properties: {
          title: { type: "string" },
          dates: { type: "string" },
          location: { type: "string" },
          description: { type: "string" },
          image: { type: "string" },
          mlh: { type: "string" },
          win: { type: "string" },
          links: {
            type: "array",
            items: {
              type: "object",
              required: ["title", "icon", "href"],
              properties: {
                title: { type: "string" },
                icon: { type: ["string", "null"] },
                href: { type: "string" },
              },
            },
          },
        },
      },
    },
    hackathonWebsiteHeader: { type: "string" },
    hackathonWebsiteSubtitle: { type: "string" },
    papers: {
      type: "array",
      items: {
        type: "object",
        required: [
          "title",
          "coAuthors",
          "publicationDate",
          "conference",
          "journal",
          "doi",
          "abstract",
          "link",
        ],
        properties: {
          title: { type: "string" },
          coAuthors: {
            type: "array",
            items: { type: "string" },
          },
          publicationDate: { type: "string" },
          conference: { type: "string" },
          journal: { type: "string" },
          doi: { type: "string" },
          abstract: { type: "string" },
          link: { type: "string" },
        },
      },
    },
    papersWebsiteHeader: { type: "string" },
    papersWebsiteSubtitle: { type: "string" },
    certifications: {
      type: "array",
      items: {
        type: "object",
        required: [
          "title",
          "issuingOrganization",
          "logoUrl",
          "dateIssued",
          "credentialId",
          "url",
        ],
        properties: {
          title: { type: "string" },
          issuingOrganization: { type: "string" },
          logoUrl: { type: "string" },
          dateIssued: { type: "string" },
          credentialId: { type: "string" },
          url: { type: "string" },
        },
      },
    },
    volunteerWork: {
      type: "array",
      items: {
        type: "object",
        required: [
          "organization",
          "role",
          "location",
          "start",
          "end",
          "description",
        ],
        properties: {
          organization: { type: "string" },
          role: { type: "string" },
          location: { type: "string" },
          start: { type: "string" },
          end: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    awards: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "organization", "dateAwarded", "description"],
        properties: {
          title: { type: "string" },
          organization: { type: "string" },
          dateAwarded: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    languages: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "proficiency"],
        properties: {
          name: { type: "string" },
          proficiency: { type: "string" },
        },
      },
    },
    interests: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "icon"],
        properties: {
          name: { type: "string" },
          icon: { type: "string" },
        },
      },
    },
    testimonials: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "role", "quote", "organization", "avatarUrl"],
        properties: {
          name: { type: "string" },
          role: { type: "string" },
          quote: { type: "string" },
          organization: { type: "string" },
          avatarUrl: { type: "string" },
        },
      },
    },
    openSourceContributions: {
      type: "array",
      items: {
        type: "object",
        required: [
          "project",
          "repository",
          "role",
          "description",
          "contributionDate",
        ],
        properties: {
          project: { type: "string" },
          repository: { type: "string" },
          role: { type: "string" },
          description: { type: "string" },
          contributionDate: { type: "string" },
        },
      },
    },
    speakingEngagements: {
      type: "array",
      items: {
        type: "object",
        required: [
          "title",
          "event",
          "location",
          "date",
          "slidesLink",
          "description",
        ],
        properties: {
          title: { type: "string" },
          event: { type: "string" },
          location: { type: "string" },
          date: { type: "string" },
          slidesLink: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    patents: {
      type: "array",
      items: {
        type: "object",
        required: [
          "title",
          "patentId",
          "description",
          "dateFiled",
          "status",
          "url",
        ],
        properties: {
          title: { type: "string" },
          patentId: { type: "string" },
          description: { type: "string" },
          dateFiled: { type: "string" },
          status: { type: "string" },
          url: { type: "string" },
        },
      },
    },
  },
};
