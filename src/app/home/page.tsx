"use client";
import { AwardsCard } from "@/components/award-card";
import { HackathonCard } from "@/components/hackathon-card";
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import Navbar from "@/components/navbar";
import { PaperCard } from "@/components/paper-card";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/resume-card";
import RecordingLoader from "@/components/Skeleton/RecordingLoaderMini";
import { Paper, PortfolioData, Project } from "@/components/types/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Marquee from "@/components/ui/marquee";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useOpenAi } from "@/hooks/useOpenAi";
import axios from "axios";
import {
  Check,
  Facebook,
  FileText,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Pen,
  Phone,
  PlusCircle,
  SaveIcon,
  Upload,
  X,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaXTwitter } from "react-icons/fa6";
import Markdown from "react-markdown";

import { CertificationCard } from "@/components/certification-card";
import { Dock, DockIcon } from "@/components/magicui/dock";
import ResumeUploadLoader from "@/components/Skeleton/ResumeLoader";
import { PortfolioFormSelector } from "@/components/ui/Forms/portfolio-form-selector";
import { PaperForm } from "@/components/ui/Papers/PapersForm";
import { ProjectForm } from "@/components/ui/Projects/ProjectForms";
import { Textarea } from "@/components/ui/textarea";
import { ToastAction } from "@/components/ui/toast";
import { useSupabase } from "@/hooks/useSupabase";
import { cn } from "@/lib/utils";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  const { llmModel, generateObject } = useOpenAi();
  const [DATA, setData] = useState<PortfolioData>({} as PortfolioData);
  const [readOnly, setReadOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { supabase } = useSupabase();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [savedText, setSavedText] = useState("");
  const [userEmailToken, setUserEmailToken] = useState("");
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [text, setText] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("inactive");
  const inputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [pdfText, setPdfText] = useState("");
  const [openRealTime, setOpenRealTime] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPhotoLoading, setIsPhotoLoading] = useState(false);
  const [papersHeader, setPapersHeader] = useState("");
  const [papersSubtitle, setPapersSubtitle] = useState("");
  const [projectsHeader, setProjectsHeader] = useState("");
  const [projectsSubtitle, setProjectsSubtitle] = useState("");
  const [hackathonHeader, setHackathonHeader] = useState("");
  const [hackathonSubtitle, setHackathonSubtitle] = useState("");

  const [description, setDescription] = useState("");
  const [about, setAbout] = useState("");
  const [isPhoneEmailExpanded, setIsPhoneEmailExpanded] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const filePhotoInputRef = useRef<HTMLInputElement>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPaper, setEditingPaper] = useState<Paper | null>(null);

  const handleAddPaper = (newPaper: Paper) => {
    setData((prevData) => ({
      ...prevData,
      papers: [...(prevData.papers || []), newPaper],
    }));
  };

  const handleEditPaper = (editedPaper: Paper) => {
    setData((prevData) => ({
      ...prevData,
      papers: prevData.papers?.map((paper) =>
        paper.title === editedPaper.title ? editedPaper : paper
      ),
    }));
    setEditingPaper(null);
  };

  const handleDeletePaper = (paperTitle: string) => {
    setData((prevData) => ({
      ...prevData,
      papers: prevData.papers?.filter((paper) => paper.title !== paperTitle),
    }));
  };

  const handleAddProject = (newProject: Project) => {
    setData((prevData) => ({
      ...prevData,
      projects: [...(prevData.projects || []), newProject],
    }));
  };

  const handleEditProject = (editedProject: Project) => {
    setData((prevData) => ({
      ...prevData,
      projects: prevData.projects?.map((project) =>
        project.title === editedProject.title ? editedProject : project
      ),
    }));
    setEditingProject(null);
  };

  const handleDeleteProject = (projectTitle: string) => {
    setData((prevData) => ({
      ...prevData,
      projects: prevData.projects?.filter(
        (project) => project.title !== projectTitle
      ),
    }));
  };

  const handleChangePhoto = () => {
    filePhotoInputRef.current?.click();
  };

  const toggleExpanded = () => {
    setIsPhoneEmailExpanded(!isPhoneEmailExpanded);
  };
  const handleFilePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsPhotoLoading(true);
    const file = event.target.files?.[0];
    const email = DATA.contact.email;

    if (!file) {
      setIsPhotoLoading(false);
      return;
    }

    try {
      const filePath = `public/${email}_avatar.png`;

      // First, check if file exists
      const { data: existingFiles } = await supabase.storage
        .from("test_bucket")
        .list("public");

      let uploadResponse;

      // If file exists, update it, otherwise upload new file
      if (existingFiles?.some((f) => f.name === `${email}_avatar.png`)) {
        uploadResponse = await supabase.storage
          .from("test_bucket")
          .update(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });
      } else {
        uploadResponse = await supabase.storage
          .from("test_bucket")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });
      }

      if (uploadResponse.error) {
        throw uploadResponse.error;
      }

      // Get the public URL
      const { data: publicUrl } = supabase.storage
        .from("test_bucket")
        .getPublicUrl(filePath);

      if (!publicUrl) {
        throw new Error("Failed to get public URL");
      }

      console.log("File uploaded successfully:", publicUrl);
      setAvatarUrl(`${publicUrl.publicUrl}?t=${new Date().getTime()}`);
      setData((prevData) => ({
        ...prevData,
        avatarUrl: publicUrl.publicUrl,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Failed to upload profile picture.",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 3000,
      });
    } finally {
      setIsPhotoLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile) {
      setFile(selectedFile);
      handleSubmit(selectedFile);
    }
  };

  const handleSubmit = async (file: File) => {
    setIsLoading(true);
    setIsOpen(false);
    // setUploadStatus('Uploading...');

    const formData = new FormData();
    formData.append("pdf", file);

    //need to get and feed the pdf data here.

    // const result = await generateObject({
    //   model: llmModel,
    //   schemaName: "resume",
    //   schemaDescription: "Resume Format",
    //   schema: portfolioSchema,
    //   prompt: RESUME_PROMPT,
    // });

    // console.log(result);
    // return;

    // TODO: Handle PDF extraction here
    // Then deal with supabase

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/pdf-data/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.content);
      setData(response.data.content);
      setText(response.data.content.name);
      setSavedText(response.data.content.name);
      setDescription(response.data.content.description);
      setAbout(response.data.content.summary);
      setPapersHeader(response.data.content.papersWebsiteHeader);
      setPapersHeader(response.data.content.papersWebsiteSubtitle);
      setProjectsHeader(response.data.content.projectsWebsiteHeader);
      setProjectsSubtitle(response.data.content.projectsWebsiteSubtitle);
      setHackathonHeader(response.data.content.hackathonWebsiteHeader);
      setHackathonSubtitle(response.data.content.hackathonWebsiteSubtitle);
      setAvatarUrl(
        `${response.data.content.avatarUrl}?t=${new Date().getTime()}`
      );
      setUploadStatus("PDF processed successfully!");
    } catch (error) {
      setUploadStatus("Error processing PDF");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      if (!userEmailToken) {
        throw new Error("User token not found");
      }

      // Get user data to check if user exists
      const { data: userData, error: userError } = await supabase
        .from("user_data")
        .select("*")
        .eq("id", userEmailToken)
        .single();

      if (userError) throw userError;

      // Generate URL from email
      const emailUsername = userData.email.split("@")[0];
      const userUrl = `http://localhost:5000/${emailUsername}`;

      // Update user data with website details and URL
      const { error: updateError } = await supabase
        .from("user_data")
        .update({
          data: DATA,
          url: userUrl,
        })
        .eq("id", userEmailToken);

      if (updateError) throw updateError;

      // Handle subscription status check
      if (subscriptionStatus !== "active") {
        toast({
          title: "Subscribe to Publish",
          variant: "destructive",
          description:
            "Your portfolio is saved, but won't be public until you purchase a subscription.",
          action: (
            <ToastAction
              altText="Subscribe User"
              onClick={() => {
                handleStripePayment();
              }}
            >
              {"Subscribe"}
            </ToastAction>
          ),
          duration: 10000,
        });
        return;
      }

      // Success toast with portfolio link
      toast({
        title: "Portfolio Published 🚀",
        action: (
          <ToastAction
            altText="Success"
            onClick={() => {
              window.open(userUrl, "_blank");
            }}
          >
            Open Portfolio
          </ToastAction>
        ),
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    const fetchData = async () => {
      const emailToken = sessionStorage.getItem("authToken");
      if (!emailToken) {
        toast({
          title: "Please sign in.",
          duration: 3000,
        });
        router.push("/login");
        console.error("Email not found in localStorage");
        setIsLoading(false);
        return;
      } else {
        setUserEmailToken(emailToken);
      }

      try {
        // Get user data directly from Supabase
        const { data: userData, error: userError } = await supabase
          .from("user_data")
          .select("*")
          .eq("id", emailToken)
          .single();

        if (userError) throw userError;

        if (!userData.data) {
          setData({} as PortfolioData);
          setIsLoading(false);
          return;
        }

        const content = userData.data;
        console.log("User data:", content);

        // Set all the state variables
        setData(content);
        setText(content.name);
        setSavedText(content.name);
        setDescription(content.description);
        setAbout(content.summary);
        setPapersHeader(content.papersWebsiteHeader);
        setPapersSubtitle(content.papersWebsiteSubtitle);
        setProjectsHeader(content.projectsWebsiteHeader);
        setProjectsSubtitle(content.projectsWebsiteSubtitle);
        setHackathonHeader(content.hackathonWebsiteHeader);
        setHackathonSubtitle(content.hackathonWebsiteSubtitle);
        setAvatarUrl(`${content.avatarUrl}?t=${new Date().getTime()}`);

        setSubscriptionStatus(userData.subscription_status);
        console.log("avatar url ", content.avatarUrl);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (isEditingIntro && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditingIntro]);

  const handleEditingIntro = () => {
    setIsEditingIntro(true);
  };

  const handleSaveIntro = () => {
    setSavedText(text);
    setDescription(description);
    setAbout(about);
    setData((prevData) => ({
      ...prevData,
      name: text,
      description: description,
      summary: about,
    }));
    setIsEditingIntro(false);
  };

  const handleCancelEditingIntro = () => {
    setIsEditingIntro(false);
  };

  const handleStripePayment = async () => {
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stripe_customer_id: sessionStorage.getItem("stripe_customer_id"),
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to the Stripe Checkout page
        window.location.href = data.url;
      } else {
        throw new Error("No URL found in the response");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast({
        title: "Payment Error",
        description: "Failed to initiate payment. Please try again later.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <>
      {isLoading && <ResumeUploadLoader />}
      {!isLoading && DATA && Object.keys(DATA).length == 0 && (
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
              <Upload className="mr-2 h-4 w-4" />{" "}
              {"Upload CV/Resume (.pdf, .docx)"}
            </Button>

            {uploadStatus && (
              <Alert>
                <AlertDescription>{uploadStatus}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
      {!isLoading && DATA && Object.keys(DATA).length > 0 && (
        <main className="flex flex-col min-h-[100dvh] space-y-10">
          <div className="pointer-events-none fixed inset-x-0 top-0 z-30 mx-auto mt-4 flex origin-top h-full max-h-14">
            <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset] ">
              <DockIcon key={"Save"}>
                <Button
                  // className="absolute top-4 right-4 px-4 py-2 rounded"
                  variant="ghost"
                  onClick={handleSave}
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <SaveIcon />
                  )}
                </Button>
              </DockIcon>

              <DockIcon key={"Upload"}>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    {!isLoading && DATA && Object.keys(DATA).length > 0 && (
                      <Button
                        // className="absolute top-4 left-4 px-4 py-2 rounded"
                        variant="ghost"
                      >
                        <FileText />
                      </Button>
                    )}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader></DialogHeader>
                    <Card className="border-0 shadow-none">
                      <CardHeader>
                        <CardTitle className="text-center">Ready? 🚀</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <input
                          type="file"
                          accept="application/pdf,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                          ref={fileInputRef}
                        />
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="ghost"
                          className="w-full"
                        >
                          <Upload className="mr-2 h-4 w-4" /> Upload CV/Resume
                          (.pdf, .docx)
                        </Button>
                      </CardContent>
                    </Card>
                  </DialogContent>
                </Dialog>
              </DockIcon>

              <DockIcon key={"Manage"}>
                <PortfolioFormSelector data={DATA} setData={setData} />
              </DockIcon>
            </Dock>
          </div>

          <section id="hero">
            <div className="mx-auto w-full max-w-2xl space-y-8">
              <div className="gap-2 flex justify-between">
                <div className="flex-col flex flex-1 space-y-1.5">
                  <div className="flex">
                    {!isEditingIntro && (
                      <>
                        <BlurFadeText
                          delay={BLUR_FADE_DELAY}
                          className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                          yOffset={8}
                          text={text}
                        />
                      </>
                    )}
                    {isEditingIntro && (
                      <div className="flex flex-col items-center space-x-2">
                        <div className="mb-2">
                          <Button
                            size="icon"
                            onClick={handleSaveIntro}
                            className="mr-4"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={handleCancelEditingIntro}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          ref={inputRef}
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex">
                    {!isEditingIntro && (
                      <>
                        <Button
                          onClick={handleEditingIntro}
                          variant="ghost"
                          className="absolute left-1/4"
                          size="icon"
                        >
                          <Pen />
                        </Button>
                        <BlurFadeText
                          className="max-w-[600px] md:text-xl"
                          delay={BLUR_FADE_DELAY}
                          text={description}
                        />
                      </>
                    )}
                    {isEditingIntro && (
                      <div className="flex items-center space-x-2 w-full">
                        <Textarea
                          value={description}
                          rows={description.split("\n").length}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <BlurFade delay={BLUR_FADE_DELAY}>
                  <AlertDialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <Avatar className="size-28 border cursor-pointer">
                        {isPhotoLoading && (
                          <div className="flex items-center justify-center w-full h-full">
                            {/* <Loader2 className="w-1/3 h-1/3 animate-spin" /> */}
                            <RecordingLoader />
                          </div>
                        )}
                        {!isPhotoLoading && (
                          <>
                            <AvatarImage alt={DATA.name} src={avatarUrl} />
                            <AvatarFallback>{DATA.initials}</AvatarFallback>
                          </>
                        )}
                      </Avatar>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Profile Picture</AlertDialogTitle>
                        <AlertDialogDescription>
                          <div className="mt-2 flex justify-center">
                            <Avatar className="size-28 border cursor-pointer">
                              <AvatarImage alt={DATA.name} src={avatarUrl} />
                              <AvatarFallback>{DATA.initials}</AvatarFallback>
                            </Avatar>
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex items-center justify-center">
                        <AlertDialogCancel className="w-full text-center">
                          Close
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleChangePhoto}
                          className="w-full text-center"
                        >
                          Change Photo
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <input
                    type="file"
                    ref={filePhotoInputRef}
                    onChange={handleFilePhotoChange}
                    accept="image/png, image/jpeg"
                    className="hidden"
                  />
                </BlurFade>
              </div>
            </div>
          </section>
          <section id="about">
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <h2 className="text-xl font-bold">About</h2>
            </BlurFade>
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="flex">
                {!isEditingIntro && (
                  <>
                    <Markdown className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
                      {about}
                    </Markdown>
                  </>
                )}
                {isEditingIntro && (
                  <div className="flex items-center space-x-2 w-full">
                    <Textarea
                      value={about}
                      rows={about.split("\n").length}
                      onChange={(e) => setAbout(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </BlurFade>
          </section>
          {DATA && DATA.work && DATA.work.length > 0 && (
            <section id="work">
              <div className="flex min-h-0 flex-col gap-y-3">
                <BlurFade delay={BLUR_FADE_DELAY * 5}>
                  <h2 className="text-xl font-bold">Work Experience</h2>
                </BlurFade>
                {DATA.work.map((work, id) => (
                  <BlurFade
                    key={work.company + id.toString()}
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
                      readOnly={true}
                      data={DATA}
                      setData={setData}
                      targetId={work.id}
                    />
                  </BlurFade>
                ))}
              </div>
            </section>
          )}

          {DATA && DATA.education && DATA.education.length > 0 && (
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
                      readOnly={true}
                      period={`${education.start} - ${education.end}`}
                      data={DATA}
                      setData={setData}
                    />
                  </BlurFade>
                ))}
              </div>
            </section>
          )}

          {DATA && DATA.skills && DATA.skills.length > 0 && (
            <section id="skills">
              <div className="flex min-h-0 flex-col gap-y-3">
                <BlurFade delay={BLUR_FADE_DELAY * 9}>
                  <h2 className="text-xl font-bold">Skills</h2>
                </BlurFade>

                <div className="flex flex-wrap gap-1">
                  {/* <IconCloud iconSlugs={DATA.skills.map(skill => skill.charAt(0).toLowerCase() + skill.slice(1))} /> */}
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
                            className="h-4 w-4 ml-1 hover:bg-transparent"
                            onClick={() => {
                              setData((prevData) => ({
                                ...prevData,
                                skills: prevData.skills.filter(
                                  (s) => s !== skill
                                ),
                              }));
                            }}
                          >
                            <X className="h-3 w-3" color="white" />
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
          )}

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
                        {projectsHeader}
                      </h2>
                      <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {projectsSubtitle}
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
                <Sheet>
                  <SheetTrigger asChild>
                    {/* <Button className="mt-4" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Project
          </Button> */}
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Add New Project</SheetTitle>
                    </SheetHeader>
                    <ProjectForm onSubmit={handleAddProject} />
                  </SheetContent>
                </Sheet>

                {editingProject && (
                  <Sheet
                    open={!!editingProject}
                    onOpenChange={() => setEditingProject(null)}
                  >
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Edit Project</SheetTitle>
                      </SheetHeader>
                      <ProjectForm
                        project={editingProject}
                        onSubmit={handleEditProject}
                      />
                    </SheetContent>
                  </Sheet>
                )}
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

          {DATA && DATA.papers && DATA.papers.length > 0 && (
            <section id="papers">
              <div className="space-y-12 w-full py-12">
                <BlurFade delay={BLUR_FADE_DELAY * 13}>
                  <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                      <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                        Papers
                      </div>
                      <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                        {papersHeader}
                      </h2>
                      <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {papersSubtitle}
                      </p>
                    </div>
                  </div>
                </BlurFade>
                <BlurFade delay={BLUR_FADE_DELAY * 14}>
                  <ul className="mb-4 ml-4  ">
                    {DATA.papers.map((paper, id) => (
                      <BlurFade
                        key={paper.title + paper.publicationDate}
                        delay={BLUR_FADE_DELAY * 15 + id * 0.05}
                      >
                        <PaperCard
                          title={paper.title}
                          coAuthors={paper.coAuthors}
                          publicationDate={paper.publicationDate}
                          conference={paper.conference}
                          journal={paper.journal}
                          doi={paper.doi}
                          abstract={paper.abstract}
                          link={paper.link}
                          className="mb-2"
                        />
                      </BlurFade>
                    ))}
                  </ul>
                </BlurFade>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  {/* <Button className="mt-4" variant="outline">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Paper
          </Button> */}
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Add New Paper</SheetTitle>
                  </SheetHeader>
                  <PaperForm onSubmit={handleAddPaper} />
                </SheetContent>
              </Sheet>

              {editingPaper && (
                <Sheet
                  open={!!editingPaper}
                  onOpenChange={() => setEditingPaper(null)}
                >
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit Paper</SheetTitle>
                    </SheetHeader>
                    <PaperForm
                      paper={editingPaper}
                      onSubmit={handleEditPaper}
                    />
                  </SheetContent>
                </Sheet>
              )}
            </section>
          )}

          {DATA && DATA.awards && DATA.awards.length > 0 && (
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
                              {/* Render the appropriate icon based on name */}
                              {name.toLowerCase() === "youtube" && (
                                <Youtube className="size-4" />
                              )}
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
                              {/* Add more cases as needed */}
                            </Link>
                          </div>
                        )
                    )}
                </div>
              </BlurFade>
            </div>
          </section>
          <div className="mb-2">
            <Navbar showLogout={true} />
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
