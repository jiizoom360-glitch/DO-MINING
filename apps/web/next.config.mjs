/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@do-mining/core',
    '@do-mining/contracts',
    '@do-mining/mocks',
    '@do-mining/config',
    '@do-mining/ui',
  ],
  reactStrictMode: true,
};

export default nextConfig;
