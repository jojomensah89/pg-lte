import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Pglite Next.js PWA',
    short_name: 'PgltePWA',
    description: 'A Progressive Web App built with Next.js and stores data using the postgres lite database',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src:"/web-app-manifest-192x192.png",
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src:  "/web-app-manifest-512x512.png",
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}