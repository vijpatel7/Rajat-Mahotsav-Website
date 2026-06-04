import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://njrajatmahotsav.com'

  const routes = [
    '',
    '/about',
    '/contact',
    '/privacy',
    '/timeline',
    '/registration',
    '/invitation',
    '/latest-events',
    '/tree-planting',
    '/schedule',
    '/community-seva',
    '/community-seva/submit-data',
    '/spiritual-seva',
    '/spiritual-seva/submit',
    '/guest-services',
    '/media',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' || route === '/latest-events' ? 'weekly' as const : 'monthly' as const,
    priority: route === '' ? 1.0 : route === '/registration' ? 0.9 : 0.8,
  }))
}
