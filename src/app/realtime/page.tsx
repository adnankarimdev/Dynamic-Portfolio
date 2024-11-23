"use client";

import AuthPage from "@/components/ui/login/AuthPage";
import AnimatedLayout from "@/components/animations/AnimatedLayout";
import { useRouter } from "next/navigation";
import { ConsolePage } from "@/components/ui/real-time/ConsolePage";
import { usePathname } from 'next/navigation'
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { PortfolioData } from "@/components/types/types";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [userEmailToken, setUserEmailToken] = useState("")
  const {toast} = useToast()
  const router = useRouter();
  const [DATA, setData] = useState<PortfolioData>({} as PortfolioData)
  const pathname = usePathname()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const emailToken = sessionStorage.getItem("authToken");
      if (!emailToken) {
        toast({
          title: "Please sign in.",
          duration: 3000,
        });
        router.push("/login");
        console.error("Email not found in sessionStorage");
        setIsLoading(false);
        return;
      }
  
      setUserEmailToken(emailToken);
  
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-website-details/`,
          {
            headers: {
              Authorization: `Bearer ${emailToken}`,
            },
          }
        );
  
        console.log("MY data", response.data.content);
        setData(response.data.content);
  
        toast({
          title: "Welcome Back!",
          duration: 1000,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false); // Always set loading to false
      }
    };
  
    fetchData();
  }, []);

  return (
    <AnimatedLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-screen">
          {!isLoading && (<ConsolePage DATA={DATA}/>)}
        </div>
      </div>
    </AnimatedLayout>
  );
}
