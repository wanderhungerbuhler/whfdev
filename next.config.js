/* eslint-disable @typescript-eslint/no-var-requires */
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin()

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // @react-pdf/renderer ships ESM with default imports webpack can't
    // resolve when bundling (textkit → bidi-js). Run it as a native Node
    // import on the server runtime instead.
    serverComponentsExternalPackages: [
      '@react-pdf/renderer',
      '@react-pdf/textkit',
      '@react-pdf/layout',
      '@react-pdf/font',
    ],
  },
}

module.exports = withNextIntl(nextConfig)
