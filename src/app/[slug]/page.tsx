"use client";
import { AwardsCard } from "@/components/award-card";
import { CertificationCard } from "@/components/certification-card";
import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import Navbar from "@/components/navbar";
import { PaperCard } from "@/components/paper-card";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import RecordingLoader from "@/components/Skeleton/RecordingLoader";
import { PortfolioData } from "@/components/types/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Marquee from "@/components/ui/marquee";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { cn } from "@/lib/utils";
import {
  Check,
  Facebook,
  Github,
  Linkedin,
  Mail,
  Phone,
  PlusCircle,
  X,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  const [DATA, setData] = useState<PortfolioData>({} as PortfolioData);
  const [readOnly, setReadOnly] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const pathname = usePathname();
  const { supabase } = useSupabase();
  console.log(pathname);
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [userEmailToken, setUserEmailToken] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [pdfText, setPdfText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUrlHidden, setIsUrlHidden] = useState(true);
  const [isPhoneEmailExpanded, setIsPhoneEmailExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsPhoneEmailExpanded(!isPhoneEmailExpanded);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const userUrl = `http://localhost:5000/${pathname.slice(1)}`;

        const { data, error } = await supabase
          .from("user_data")
          .select("data, url_hidden")
          .eq("url", userUrl)
          .single();

        if (error) throw error;

        if (data) {
          setData(data.data);
          setIsUrlHidden(data.url_hidden);
        }
      } catch (error: any) {
        console.error(error);
        // Optionally show error toast
        toast({
          title: "Failed to fetch",
          description: error.message,
          duration: 1000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pathname]);

  return (
    <>
      {isLoading && <RecordingLoader />}
      {isUrlHidden && (
        <Card className="flex flex-col items-center justify-center min-h-screen">
          <CardContent className="space-y-4">
            {"This portfolio does not exist yet."}
          </CardContent>
        </Card>
      )}
      {!isUrlHidden && !isLoading && DATA && Object.keys(DATA).length > 0 && (
        <main className="flex flex-col min-h-[100dvh] space-y-10">
          {!readOnly && (
            <Button
              className="absolute top-4 right-4 px-4 py-2 rounded"
              variant="ghost"
            >
              {"Publish"}
            </Button>
          )}
          {/* <Button className="absolute top-4 left-4 px-4 py-2 rounded" variant="ghost" onClick={() => setIsOpen(true)}>
{"Start Over"}
</Button> */}
          <section id="hero">
            <div className="mx-auto w-full max-w-2xl space-y-8">
              <div className="gap-2 flex justify-between">
                <div className="flex-col flex flex-1 space-y-1.5">
                  <BlurFadeText
                    delay={BLUR_FADE_DELAY}
                    className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                    yOffset={8}
                    text={DATA.name}
                  />
                  <BlurFadeText
                    className="max-w-[600px] md:text-xl"
                    delay={BLUR_FADE_DELAY}
                    text={DATA.description}
                  />
                </div>
                <BlurFade delay={BLUR_FADE_DELAY}>
                  <Avatar className="size-28 border">
                    <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                    <AvatarFallback>{DATA.initials}</AvatarFallback>
                  </Avatar>
                </BlurFade>
              </div>
            </div>
          </section>
          <section id="about">
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <h2 className="text-xl font-bold">About</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                {DATA.summary}
              </Markdown>
            </BlurFade>
          </section>
          <section id="work">
            <div className="flex min-h-0 flex-col gap-y-3">
              <BlurFade delay={BLUR_FADE_DELAY * 5}>
                <h2 className="text-xl font-bold">Work Experience</h2>
              </BlurFade>
              {DATA.work.map((work, id) => (
                <BlurFade
                  key={work.company}
                  delay={BLUR_FADE_DELAY * 6 + id * 0.05}
                >
                  <ResumeCard
                    key={work.company}
                    logoUrl={work.logoUrl}
                    altText={work.company}
                    title={work.company}
                    subtitle={work.title}
                    href={work.href}
                    badges={work.badges}
                    period={`${work.start} - ${work.end ?? "Present"}`}
                    description={work.description}
                    readOnly={readOnly}
                  />
                </BlurFade>
              ))}
            </div>
          </section>
          <section id="education">
            <div className="flex min-h-0 flex-col gap-y-3">
              <BlurFade delay={BLUR_FADE_DELAY * 7}>
                <h2 className="text-xl font-bold">Education</h2>
              </BlurFade>
              {DATA.education.map((education, id) => (
                <BlurFade
                  key={education.school}
                  delay={BLUR_FADE_DELAY * 8 + id * 0.05}
                >
                  <ResumeCard
                    key={education.school}
                    href={education.href}
                    logoUrl={education.logoUrl}
                    altText={education.school}
                    title={education.school}
                    subtitle={education.degree}
                    readOnly={readOnly}
                    period={`${education.start} - ${education.end}`}
                  />
                </BlurFade>
              ))}
            </div>
          </section>
          <section id="skills">
            <div className="flex min-h-0 flex-col gap-y-3">
              <BlurFade delay={BLUR_FADE_DELAY * 9}>
                <h2 className="text-xl font-bold">Skills</h2>
              </BlurFade>
              <div className="flex flex-wrap gap-1">
                {DATA.skills.map((skill, id) => (
                  <BlurFade
                    key={skill}
                    delay={BLUR_FADE_DELAY * 10 + id * 0.05}
                  >
                    <Badge key={skill} className="group">
                      {skill}
                      {!readOnly && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            setData((prevData) => ({
                              ...prevData,
                              skills: prevData.skills.filter(
                                (s) => s !== skill
                              ),
                            }));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </Badge>
                  </BlurFade>
                ))}
                {!readOnly && (
                  <EditableSkill
                    onAddSkill={(newSkill) => {
                      setData((prevData) => ({
                        ...prevData,
                        skills: [...prevData.skills, newSkill],
                      }));
                    }}
                  />
                )}
              </div>
            </div>
          </section>
          {DATA && DATA.projects && DATA.projects.length > 0 && (
            <section id="projects">
              <div className="space-y-12 w-full py-12">
                <BlurFade delay={BLUR_FADE_DELAY * 11}>
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                        My Projects
                      </div>
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        Check out my latest work
                      </h2>
                      <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        I&apos;ve worked on a variety of projects, from simple
                        websites to complex web applications. Here are a few of
                        my favorites.
                      </p>
                    </div>
                  </div>
                </BlurFade>
                <Marquee pauseOnHover className="[--duration:20s]">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
                    {DATA.projects.map((project, id) => (
                      <BlurFade
                        key={project.title}
                        delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                      >
                        <ProjectCard
                          href={project.href}
                          key={project.title}
                          title={project.title}
                          description={project.description}
                          dates={project.dates}
                          tags={project.technologies}
                          image={project.image}
                          video={project.video}
                          links={project.links}
                        />
                      </BlurFade>
                    ))}
                  </div>
                </Marquee>
              </div>
            </section>
          )}

          {DATA && DATA.certifications && DATA.certifications.length > 0 && (
            <section id="certifications">
              <div className="space-y-12 w-full py-12">
                <BlurFade delay={BLUR_FADE_DELAY * 11}>
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                        My Certifications
                      </div>
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        Check out my credentials
                      </h2>
                      <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        I&apos;ve expanded my knowledge through these
                        certifications.
                      </p>
                    </div>
                  </div>
                </BlurFade>
                <Marquee pauseOnHover className="[--duration:20s]">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
                    {DATA.certifications.map((project, id) => (
                      <BlurFade
                        key={project.title}
                        delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                      >
                        <CertificationCard
                          key={project.title}
                          issuingOrganization={project.issuingOrganization}
                          title={project.title}
                          logoUrl={project.logoUrl}
                          dateIssued={project.dateIssued}
                          url={project.url}
                          credentialId={project.credentialId}
                        />
                      </BlurFade>
                    ))}
                  </div>
                </Marquee>
              </div>
            </section>
          )}

          {DATA.papers && DATA.papers.length > 0 && (
            <section id="papers">
              <div className="space-y-12 w-full py-12">
                <BlurFade delay={BLUR_FADE_DELAY * 13}>
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                        Papers
                      </div>
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        Check out my latest work
                      </h2>
                      <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {
                          "I had the opportunity to contribute to several research publications."
                        }
                      </p>
                    </div>
                  </div>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 14}>
                  <ul className="mb-4 ml-4  ">
                    {DATA.papers.map((project, id) => (
                      <BlurFade
                        key={project.title + project.publicationDate}
                        delay={BLUR_FADE_DELAY * 15 + id * 0.05}
                      >
                        <PaperCard
                          title={project.title}
                          coAuthors={project.coAuthors}
                          publicationDate={project.publicationDate}
                          conference={project.conference}
                          journal={project.journal}
                          doi={project.doi}
                          abstract={project.abstract}
                          link={project.link}
                          className="mb-2"
                        />
                      </BlurFade>
                    ))}
                  </ul>
                </BlurFade>
              </div>
            </section>
          )}

          {DATA.awards && DATA.awards.length > 0 && (
            <section id="awards">
              <div className="space-y-12 w-full py-12">
                <BlurFade delay={BLUR_FADE_DELAY * 13}>
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                        Awards
                      </div>
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        I've gotten some really cool awards too!
                      </h2>
                      <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {""}
                      </p>
                    </div>
                  </div>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 14}>
                  <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
                    {DATA.awards.map((project, id) => (
                      <BlurFade
                        key={project.title + project.dateAwarded}
                        delay={BLUR_FADE_DELAY * 15 + id * 0.05}
                      >
                        <AwardsCard
                          title={project.title}
                          organization={project.organization}
                          dateAwarded={project.dateAwarded}
                          description={project.description}
                          image={project.image}
                        />
                      </BlurFade>
                    ))}
                  </ul>
                </BlurFade>
              </div>
            </section>
          )}

          {DATA.hackathons && DATA.hackathons.length > 0 && (
            <section id="hackathons">
              <div className="space-y-12 w-full py-12">
                <BlurFade delay={BLUR_FADE_DELAY * 13}>
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                        Hackathons
                      </div>
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        I like building things
                      </h2>
                      <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        During my time in university, I attended + hackathons.
                        People from around the country would come together and
                        build incredible things in 2-3 days. It was eye-opening
                        to see the endless possibilities brought to life by a
                        group of motivated and passionate individuals.
                      </p>
                    </div>
                  </div>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 14}>
                  <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
                    {DATA.hackathons.map((project, id) => (
                      <BlurFade
                        key={project.title + project.dates}
                        delay={BLUR_FADE_DELAY * 15 + id * 0.05}
                      >
                        <HackathonCard
                          title={project.title}
                          description={project.description}
                          location={project.location}
                          dates={project.dates}
                          image={project.image}
                          links={project.links}
                        />
                      </BlurFade>
                    ))}
                  </ul>
                </BlurFade>
              </div>
            </section>
          )}

          <section id="contact">
            <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
              <BlurFade delay={BLUR_FADE_DELAY * 16}>
                <div className="space-y-3">
                  <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                    Contact
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Get in Touch
                  </h2>

                  {Object.entries(DATA.contact)
                    .filter(([name]) => name !== "social")
                    .map(([name, value]) => (
                      <div
                        key={name}
                        className="flex flex-col items-center justify-center"
                      >
                        {value && (
                          <Button
                            onClick={toggleExpanded}
                            variant="ghost"
                            size="sm"
                            className={cn(
                              "relative z-10 flex items-center gap-2 transition-all duration-300 ease-in-out",
                              isPhoneEmailExpanded ? "pr-3" : "pr-2 w-12"
                            )}
                            aria-expanded={isPhoneEmailExpanded}
                            aria-label={`${name}: ${value}`}
                          >
                            {name === "email" && value ? (
                              <Mail className="size-4 flex-shrink-0" />
                            ) : name === "tel" && value ? (
                              <Phone className="size-4 flex-shrink-0" />
                            ) : null}
                            <span
                              className={cn(
                                "transition-all duration-300 ease-in-out overflow-hidden",
                                isPhoneEmailExpanded
                                  ? "w-auto opacity-100"
                                  : "w-0 opacity-0"
                              )}
                            >
                              {value}
                            </span>
                          </Button>
                        )}
                      </div>
                    ))}
                  {Object.entries(DATA.contact.social)
                    .filter(
                      ([name, social]) =>
                        name.toLowerCase() !== "email" &&
                        name.toLowerCase() !== "phone"
                    )
                    .map(
                      ([name, social]) =>
                        // Check if the social.url exists before rendering the Link
                        social.url && (
                          <div key={name}>
                            <Link
                              href={social.url}
                              className={cn(
                                buttonVariants({
                                  variant: "ghost",
                                  size: "icon",
                                }),
                                "size-12"
                              )}
                            >
                              {
                                // Render the appropriate icon based on name
                                name.toLowerCase() === "youtube" && (
                                  <Youtube className="size-4" />
                                )
                              }
                              {(name.toLowerCase() === "twitter" ||
                                name.toLowerCase() === "x") && (
                                <FaXTwitter className="size-4" />
                              )}
                              {name.toLowerCase() === "facebook" && (
                                <Facebook className="size-4" />
                              )}
                              {name.toLowerCase() === "github" && (
                                <Github className="size-4" />
                              )}
                              {name.toLowerCase() === "linkedin" && (
                                <Linkedin className="size-4" />
                              )}
                              // Add more cases as needed
                            </Link>
                          </div>
                        )
                    )}
                </div>
              </BlurFade>
            </div>
          </section>
          <div className="mb-2">
            <Navbar showLogout={false} />
          </div>
        </main>
      )}
    </>
  );
}

interface EditableSkillProps {
  onAddSkill: (skill: string) => void;
}

const EditableSkill: React.FC<EditableSkillProps> = ({ onAddSkill }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      onAddSkill(newSkill.trim());
      setNewSkill("");
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <Input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          className="h-6 w-24 text-xs"
          placeholder="New skill"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleAddSkill}
        >
          <Check className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setIsEditing(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="h-6"
      onClick={() => setIsEditing(true)}
    >
      <PlusCircle className="mr-1 h-3 w-3" />
      Add Skill
    </Button>
  );
};
