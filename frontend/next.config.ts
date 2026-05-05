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
    // Resolve onnxruntime-web to its bundled browser build
    config.resolve.alias = {
      ...config.resolve.alias,
      'onnxruntime-web': require.resolve('onnxruntime-web/dist/ort.bundle.min.mjs'),
      'onnxruntime-web/webgpu': require.resolve('onnxruntime-web/dist/ort.webgpu.bundle.min.mjs'),
    };
    return config;
  },
};

export default nextConfig;
