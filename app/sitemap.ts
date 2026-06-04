import { MetadataRoute } from 'next';

const BASE = 'https://collegeiq-ai.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                    lastModified: new Date(), changeFrequency: 'weekly',  priority: 1 },
    { url: `${BASE}/colleges`,      lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/recommendations`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/compare`,       lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE}/login`,         lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/signup`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];
}
