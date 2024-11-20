"use client"
import { HackathonCard } from "@/components/hackathon-card";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { PlusCircle, Check, X } from 'lucide-react'
import { Input } from "@/components/ui/input"
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import {ProjectCard} from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import axios from "axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { dummyData } from "../dummyData/dummydata";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { PortfolioData } from "@/components/types/types";
import RecordingLoader from "@/components/Skeleton/RecordingLoader";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload } from 'lucide-react'
import { useToast } from "@/hooks/use-toast";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  const [DATA, setData] = useState<PortfolioData>({} as PortfolioData)
  const [isLoading, setIsLoading] = useState(false)
  const {toast} = useToast()
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [pdfText, setPdfText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null)


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      handleSubmit(selectedFile);
    }
  };

  const handleSubmit = async (file: File) => {
    setIsLoading(true)
    // setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/pdf-data/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data.content)
      setData(response.data.content)
      setUploadStatus('PDF processed successfully!');
    } catch (error) {
      setUploadStatus('Error processing PDF');
      console.error(error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const email = sessionStorage.getItem("authToken");
      if (!email) {
        toast({
          title: "Please sign in.",
          duration: 3000,
        });
        router.push("/login");
        console.error("Email not found in localStorage");
        return;
      }

      setIsLoading(true)
      try {
        axios
        .post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/resume-creator/`, {resumeContent: dummyData}
        )
        .then((response) => {
          console.log(response.data.content)
          setData(response.data.content)
          setIsLoading(false)
          // toast({
          //   title: "Success",
          //   description: "Settings Saved.",
          //   duration: 1000,
          // });
        })
        .catch((error) => {
          setIsLoading(false)
          console.log(error);
          // toast({
          //   title: "Failed to update",
          //   description: error.response.data.error,
          //   duration: 1000,
          // });
        });

      } catch (err) {
        console.error(err);
      }
    };

    // fetchData();
  }, []);

  return (
    <>
    {isLoading && (<RecordingLoader/>)}
    {!isLoading && Object.keys(DATA).length == 0 && (
        <Card className="flex flex-col items-center justify-center min-h-screen">
        <CardHeader>
          <CardTitle className="text-center"> Ready? 🚀</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            variant="ghost"
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" /> {"Upload CV/Resume (.pdf, .docx)"}
          </Button>
          
          {uploadStatus && (
            <Alert>
              <AlertDescription>{uploadStatus}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )}
    {!isLoading &&  DATA && Object.keys(DATA).length > 0 && (
    <main className="flex flex-col min-h-[100dvh] space-y-10">
    <section id="hero">
      <div className="mx-auto w-full max-w-2xl space-y-8">
        <div className="gap-2 flex justify-between">
          <div className="flex-col flex flex-1 space-y-1.5">
            <BlurFadeText
              delay={BLUR_FADE_DELAY}
              className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
              yOffset={8}
              text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
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
        <BlurFade key={skill} delay={BLUR_FADE_DELAY * 10 + id * 0.05}>
          <Badge key={skill} className="group">
            {skill}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                setData(prevData => ({
                  ...prevData,
                  skills: prevData.skills.filter(s => s !== skill)
                }));
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        </BlurFade>
      ))}
      <EditableSkill onAddSkill={(newSkill) => {
        setData(prevData => ({
          ...prevData,
          skills: [...prevData.skills, newSkill]
        }));
      }} />
    </div>
  </div>
</section>
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
                websites to complex web applications. Here are a few of my
                favorites.
              </p>
            </div>
          </div>
        </BlurFade>
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
      </div>
    </section>
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
                During my time in university, I attended{" "}
                + hackathons. People from around the
                country would come together and build incredible things in 2-3
                days. It was eye-opening to see the endless possibilities
                brought to life by a group of motivated and passionate
                individuals.
              </p>
            </div>
          </div>
        </BlurFade>
        <BlurFade delay={BLUR_FADE_DELAY * 14}>
          <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
          {(DATA.hackathons && DATA.hackathons.length > 0 ? DATA.hackathons : DATA.papers).map((project, id) => (
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
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Want to chat? Just shoot me a dm{" "}
              <Link
                href={DATA.contact.social.X.url}
                className="text-blue-500 hover:underline"
              >
                with a direct question on twitter
              </Link>{" "}
              and I&apos;ll respond whenever I can. I will ignore all
              soliciting.
            </p>
          </div>
        </BlurFade>
      </div>
    </section>
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
