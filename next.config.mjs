/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["via.placeholder.com", "vchzcpsjnexzrzeqamix.supabase.co"], // Allow domains from everywhere
  },
};

export default nextConfig;
