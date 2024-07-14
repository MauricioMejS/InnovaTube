/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        JWT_SECRET: process.env.JWT_SECRET,
        YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
      },
};

export default nextConfig;
