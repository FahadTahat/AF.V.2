import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://afbtec.vercel.app' // TODO: Update this with your actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/secret-admin/', '/auth/', '/profile/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
