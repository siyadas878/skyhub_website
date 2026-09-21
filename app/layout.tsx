import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/supabase/store-context';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://skyhubdubai.com'),
  title: {
    default: 'Mobile Phone & Camera Shop in Dubai | SKYHUB DUBAI',
    template: '%s | SKYHUB DUBAI',
  },
  description:
    'SKYHUB DUBAI offers mobile phones, phone repair, camera sales and repair, laptop and computer services, data recovery, camera accessories, and broadcasting solutions in Al Rigga, Deira, Dubai.',
  keywords: [
    'SKYHUB DUBAI',
    'Mobile phone shop in Dubai',
    'Mobile phone shop in Deira',
    'Mobile phone shop in Al Rigga',
    'Phone repair Dubai',
    'Mobile phone repair Deira',
    'Camera shop Dubai',
    'Camera repair Dubai',
    'Laptop repair Dubai',
    'Computer repair Dubai',
    'Data recovery Dubai',
    'Mobile phone sales Dubai',
    'Smartphone repair Dubai',
    'Laptop service Dubai',
    'Camera accessories Dubai',
    'Professional camera repair Dubai',
    'Video camera repair Dubai',
    'Broadcasting equipment Dubai',
    'Audio visual equipment Dubai',
    'Data recovery service Dubai',
    'Fish Roundabout Deira Dubai'
  ],
  openGraph: {
    title: 'SKYHUB DUBAI | Mobile Phones, Cameras & Computer Services',
    description:
      'Mobile phones, camera repair, laptop services, data recovery, broadcasting and media solutions in Al Rigga, Deira, Dubai.',
    url: 'https://skyhubdubai.com',
    siteName: 'SKYHUB DUBAI',
    locale: 'en_AE',
    type: 'website',
    images: [
      {
        url: '/fav_icon.png',
        width: 1200,
        height: 630,
        alt: 'SKYHUB DUBAI - Mobile Phone & Camera Shop Deira Dubai',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SKYHUB DUBAI | Mobile Phones, Cameras & Computer Services',
    description:
      'Mobile phones, phone repair, camera sales & service, laptop repair, data recovery in Al Rigga, Deira, Dubai.',
    images: ['/fav_icon.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/fav_icon.png',
    shortcut: '/fav_icon.png',
    apple: '/fav_icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'SKYHUB DUBAI',
    description:
      'Mobile phone sales and services, camera sales and repair, laptop and computer services, data recovery, camera accessories, broadcasting and media solutions.',
    telephone: '+971523361092',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Fish Roundabout, Al Rigga',
      addressLocality: 'Deira, Dubai',
      addressCountry: 'AE',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '25.2677',
      longitude: '55.3134',
    },
    url: 'https://skyhubdubai.com',
    sameAs: [
      'https://www.facebook.com/p/skysbuy-100054198354444',
      'https://www.instagram.com/sky_hub_official/',
      'https://www.tiktok.com/@skyhubmobi',
    ],
    priceRange: 'AED 50 - AED 20000',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'],
        opens: '10:00',
        closes: '22:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Friday',
        opens: '16:00',
        closes: '22:00',
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-[#EA3829] selection:text-white">
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
