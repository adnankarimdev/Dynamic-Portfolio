"use client"
import { useState } from 'react'
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { ArrowRight, CheckCircle, Upload, Palette, Globe } from 'lucide-react'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const router = useRouter(); 
  const onGetStarted = () => {
    router.push("/login");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission here
    console.log('Email submitted:', email)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Globe className="h-6 w-6" />
          <span className="sr-only">ResumeToPortfolio</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#how-it-works">
            How It Works
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#testimonials">
            Testimonials
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Transform Your Resume into a Stunning Portfolio
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Upload your resume, and we'll create a professional portfolio website for you in minutes. Showcase your skills and experience with ease.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                onClick={onGetStarted}>
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">Key Features</h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Upload className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Easy Upload</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Simply upload your resume or CV in any common format.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Palette className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Customizable Design</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Choose from various themes and customize colors to match your style.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Globe className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Instant Website</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Get a fully functional portfolio website in minutes.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">How It Works</h2>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full p-2 w-8 h-8 flex items-center justify-center text-lg font-bold">1</div>
                <h3 className="text-xl font-bold">Upload Your Resume</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Upload your existing resume or CV in PDF, Word, or plain text format.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full p-2 w-8 h-8 flex items-center justify-center text-lg font-bold">2</div>
                <h3 className="text-xl font-bold">Customize Your Site</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Choose a theme, adjust colors, and add any additional information you want to showcase.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-200 p-4 rounded-lg">
                <div className="bg-primary text-primary-foreground rounded-full p-2 w-8 h-8 flex items-center justify-center text-lg font-bold">3</div>
                <h3 className="text-xl font-bold">Publish and Share</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  With one click, publish your new portfolio website and start sharing it with potential employers.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">What Our Users Say</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  "This tool saved me hours of work. I had a professional-looking portfolio site up in no time!"
                </p>
                <p className="font-semibold">- Alex Johnson, Software Developer</p>
              </div>
              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  "I'm not tech-savvy, but this made creating a portfolio so easy. Highly recommended!"
                </p>
                <p className="font-semibold">- Sarah Lee, Graphic Designer</p>
              </div>
              <div className="bg-white dark:bg-gray-950 p-6 rounded-lg shadow-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  "The customization options are great. My portfolio truly reflects my personal brand now."
                </p>
                <p className="font-semibold">- Michael Chen, Marketing Specialist</p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Showcase Your Skills?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create your professional portfolio website in minutes. No coding required.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form onSubmit={handleSubmit} className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Start your free trial. No credit card required.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 ResumeToPortfolio. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}