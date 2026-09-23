import { Product } from '@/types';
import { getSiteUrl } from './site-url';

export function getWhatsAppNumber(): string {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+971523361092';
  return num.replace(/[^0-9]/g, '');
}

export function getPhoneNumber(): string {
  return process.env.NEXT_PUBLIC_PHONE_NUMBER || '+971523361092';
}

export function getStoreEmail(): string {
  return process.env.NEXT_PUBLIC_STORE_EMAIL || 'info@skyhubmobi.com';

}


export function generateProductWhatsAppLink(product: Product, pageUrl?: string): string {
  const phone = getWhatsAppNumber();
  const siteUrl = getSiteUrl();
  const fullUrl = pageUrl || `${siteUrl}/products/${product.slug}`;

  const text = `Hi SKYHUB DUBAI,\n\nI am interested in buying the following device:\n📌 *${product.name}*\n🏷 Condition: *${product.condition}${product.condition_grade ? ` (${product.condition_grade})` : ''}*\n💰 Price: *AED ${product.price.toLocaleString()}*\n\nProduct Link: ${fullUrl}\n\nIs this item currently available at your Fish Roundabout store?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function generateGeneralWhatsAppLink(): string {
  const phone = getWhatsAppNumber();
  const text = `Hi SKYHUB DUBAI,\n\nI would like to inquire about your mobile sales, laptop services, camera accessories, and media solutions.`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
