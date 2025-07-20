// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'query',
            key: 'template',
            value: '(?<template>.*)',
          },
        ],
        permanent: false,
        destination: '/?template=:template',
      },
      {
        source: '/',
        missing: [
          {
            type: 'query',
            key: 'template',
          },
        ],
        permanent: false,
        destination: '/gallery',
      },
    ];
  },
};