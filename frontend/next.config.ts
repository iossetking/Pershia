import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['onnxruntime-web', '@imgly/background-removal'],
  turbopack: {
    root: __dirname,
    resolveAlias: {
      'onnxruntime-web': './node_modules/onnxruntime-web/dist/ort.bundle.min.mjs',
      'onnxruntime-web/webgpu': './node_modules/onnxruntime-web/dist/ort.webgpu.bundle.min.mjs',
    },
  },
  webpack: (config) => {
    const path = require('path');
    // Resolve onnxruntime-web to its bundled browser build
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-web$': path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/ort.bundle.min.mjs'),
      'onnxruntime-web/webgpu$': path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/ort.webgpu.bundle.min.mjs'),
    };
    return config;
  },
};

export default nextConfig;
