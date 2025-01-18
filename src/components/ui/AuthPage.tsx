"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/cardshad";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const { supabase } = useSupabase();
  const [password, setPassword] = useState("");
  const [buisnessName, setBuisnessName] = useState("");
  const [accountType, setAccountType] = useState("google-business");
  const { toast } = useToast();
  const router = useRouter();

  // Hiding online business & influencer on prod for now
  const accountTypeOptions = [
    { value: "google-business", label: "Google Business 🏢" },
    // { value: "online-business", label: "Social Media Business 🧑‍💻" },
    // { value: "influencer", label: "Social Media Icon ⭐️" },
  ];

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  const handleLogin = async () => {
    try {
      // Sign in with Supabase
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      // Get user's stripe customer id from user_data table
      const { data: userData, error: userError } = await supabase
        .from("user_data")
        .select("*")
        .eq("email", email)
        .single();

      if (userError) throw userError;

      console.log(userData);

      // Store necessary data
      localStorage.setItem("userEmail", userData.email);
      sessionStorage.setItem("authToken", userData.id);
      sessionStorage.setItem("stripe_customer_id", userData.stripe_customer_id);

      toast({
        title: "Successfully Logged In",
        description: "Welcome back 👋",
        duration: 1000,
      });

      setTimeout(() => {
        router.push("/home");
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Failed to login",
        description: error.message,
        duration: 1000,
      });
    }
  };

  // TO-DO: Need to convert this to use supabase directly here.
  const handleSignUp = () => {
    // Basic validation for email and password
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please provide both email and password.",
        duration: 1000,
      });
      return;
    }

    // Make the signup request to the Django backend
    axios
      .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/sign-up/`, {
        email: email,
        password: password,
      })
      .then((response) => {
        toast({
          title: "Account Created",
          description: "Welcome! 🎉",
          duration: 1000,
        });

        // Store the auth token (if returned)
        sessionStorage.setItem("authToken", response.data.user.id);
        sessionStorage.setItem(
          "stripe_customer_id",
          response.data.user.stripe_customer_id
        );

        // Navigate to home or onboarding page
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      })
      .catch((error) => {
        console.error(error); // Log the error for debugging
        toast({
          title: "Signup Failed",
          description:
            error.response?.data?.message ||
            "Something went wrong. Please try again.",
          duration: 1000,
        });
      });
  };

  return (
    <Card className="w-[350px] ">
      <CardHeader>
        <CardTitle>Authentication</CardTitle>
        <CardDescription>Sign up or log in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="mt-2" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="abc@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <Label className="mt-2" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="****"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  disabled={isLoading}
                  onClick={handleLogin}
                  className="mt-2"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Login
                </Button>
              </div>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form onSubmit={onSubmit}>
              <div className="grid gap-2">
                <div className="grid gap-1">
                  <Label className="mt-2" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abc@example.com"
                    type="email"
                    autoCapitalize="none"
                    autoComplete="email"
                    autoCorrect="off"
                    disabled={isLoading}
                  />
                  <Label className="mt-2" htmlFor="password">
                    Password
                  </Label>
                  <Input
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="****"
                    type="password"
                    autoCapitalize="none"
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  disabled={isLoading}
                  onClick={handleSignUp}
                  className="mt-2"
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Sign up
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        {/* Hiding login/signup with google since its not implemented lol */}
        {/* <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button
          variant="outline"
          type="button"
          hidden={true}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FaGoogle className="mr-2 h-4 w-4" />
          )}{" "}
          Google
        </Button> */}
      </CardContent>
    </Card>
  );
}
