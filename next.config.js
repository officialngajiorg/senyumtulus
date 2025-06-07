/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['mongodb'],
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push({
        '@opentelemetry/exporter-jaeger': 'commonjs @opentelemetry/exporter-jaeger',
        'handlebars': 'commonjs handlebars'
      });
    }
    return config;
  }
}

module.exports = nextConfig
