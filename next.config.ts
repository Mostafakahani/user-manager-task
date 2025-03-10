import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    AUTH0_CLIENT_ID:
      process.env.AUTH0_CLIENT_ID || "SSOYZb146nfxBY3vYqISoby1wmlKGZHP",
    AUTH0_CLIENT_SECRET:
      process.env.AUTH0_CLIENT_SECRET ||
      "LddbFwu7OrwsW_eOiyOk1d7rjBwhoEwCNC75F9mTEDu-VV4h6gh0ed6FJvp2P9CG",
    AUTH0_ISSUER:
      process.env.AUTH0_ISSUER || "https://dev-s6clz2lv.eu.auth0.com",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "your_random_string_here",
  },

  images: {
    domains: ["lh3.googleusercontent.com", "reqres.in"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "reqres.in",
        pathname: "/img/faces/**",
      },
    ],
  },
};

export default nextConfig;
