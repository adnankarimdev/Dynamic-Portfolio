"use client";

import AnimatedLayout from "@/components/animations/AnimatedLayout";
import Navbar from "@/components/navbar";
import { PortfolioData } from "@/components/types/types";
import { ConsolePage } from "@/components/ui/real-time/ConsolePage";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/hooks/useSupabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// TO-DO: ONce we introduce real-time, we need to test thorougly.
export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [userEmailToken, setUserEmailToken] = useState("");
  const { toast } = useToast();
  const { supabase } = useSupabase();
  const router = useRouter();
  const [DATA, setData] = useState<PortfolioData>({} as PortfolioData);
  const pathname = usePathname();

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
        const { data: userData, error } = await supabase
          .from("user_data")
          .select("data, subscription_status")
          .eq("id", emailToken)
          .single();

        if (error) throw error;

        // If data is null, return empty object as per backend behavior
        if (!userData.data) {
          setData({} as PortfolioData);
        } else {
          console.log("MY data", userData.data);
          setData(userData.data);
        }

        // Optionally handle subscription status if needed
        // setSubscriptionStatus(userData.subscription_status);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "Failed to fetch data",
          duration: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, toast, supabase]);

  return (
    <AnimatedLayout>
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-screen">
          {!isLoading && <ConsolePage DATA={DATA} />}
        </div>
        <Navbar />
      </div>
    </AnimatedLayout>
  );
}
