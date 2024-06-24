/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  productionBrowserSourceMaps: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  optimizeFonts: true,
  compiler: {
    removeConsole: false,
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /sketches\/sketch[0-9]+\.js$/,
      type: 'asset/source',
    });
    return config;
  },
  // Remove the webpack configuration if you don't need any custom settings
  async headers() {
    return [
      {
        source: '/(.*)', // Apply to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' data: https://example.com;
              object-src 'none';
              connect-src 'self';
              img-src 'self' data: blob:;
              style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
              font-src 'self' https://fonts.gstatic.com;
              frame-ancestors 'none';
              base-uri 'self';
              form-action 'self';
            `.replace(/\n/g, ' '), // Remove newlines for CSP header
          },
        ],
      },
    ];
  },
};

export default nextConfig;