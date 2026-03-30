/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
