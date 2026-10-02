import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type PickupStatus =
  | 'pending'
  | 'confirmed'
  | 'assigned'
  | 'on_the_way'
  | 'completed'
  | 'cancelled';

export interface PickupRequest {
  id: string;
  user_id: string | null;
  request_id: string;
  full_name: string;
  phone_number: string;
  address: string;
  lga: string;
  waste_type: string;
  waste_quantity: string;
  preferred_date: string | null;
  preferred_time: string | null;
  photo_url: string | null;
  photos: string[];
  notes: string | null;
  status: PickupStatus;
  assigned_worker: string | null;
  price: number | null;
  created_at: string;
  updated_at: string;
}

export const STATUS_LABELS: Record<PickupStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  assigned: 'Assigned',
  on_the_way: 'On The Way',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const STATUS_COLORS: Record<PickupStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  assigned: 'bg-purple-100 text-purple-800 border-purple-200',
  on_the_way: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const KANO_LGAS = [
  'Fagge',
  'Dala',
  'Gwale',
  'Tarauni',
  'Nassarawa',
  'Kumbotso',
  'Ungogo',
  'Kano Municipal',
  'Madobi',
  'Dawakin Kudu',
  'Gezawa',
  'Minjibir',
  'Wudil',
  'Bichi',
  'Tudun Wada',
  'Rano',
  'Bunkure',
  'Garun Mallam',
  'Bebeji',
  'Kiru',
  'Shanono',
  'Rimin Gado',
  'Tofa',
  'Bagwai',
  'Dambatta',
  'Makoda',
  'Kunchi',
  'Tsanyawa',
  'Batsari',
  'Jibiya',
  'Mashi',
  'Kaita',
  'Warawa',
  'Takai',
  'Albasu',
  'Gaya',
  'Ajingi',
  'Garko',
  'Sumaila',
  'Doguwa',
  'Beita',
  'Kibiya',
  'Rano',
  'Karaye',
  'Rogo',
  'Makarfi',
  'Kaura',
  'Kudan',
  'Sabon Gari',
  'Giwa',
];

export const WASTE_TYPES = [
  { value: 'household', label: 'Household Waste' },
  { value: 'commercial', label: 'Commercial Waste' },
  { value: 'community', label: 'Community Cleanup' },
  { value: 'construction', label: 'Construction Waste' },
  { value: 'emergency', label: 'Emergency Collection' },
];

export const WASTE_QUANTITIES = [
  { value: 'small', label: 'Small (1-3 bags)' },
  { value: 'medium', label: 'Medium (4-10 bags)' },
  { value: 'large', label: 'Large (10+ bags / truck load)' },
];

export const WHATSAPP_NUMBER = '2349023338788';
export const WHATSAPP_MESSAGE =
  "Assalamu Alaikum. I would like to contact CleanBin about waste collection.";

export function whatsappLink(customMessage?: string) {
  const msg = encodeURIComponent(customMessage || WHATSAPP_MESSAGE);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
}

export interface CustomerProfile {
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  profile_photo: string | null;
  address: string;
  lga: string;
  notification_preferences: { in_app?: boolean };
  created_at: string;
  updated_at: string;
}

export interface SavedAddress {
  id: string;
  user_id: string;
  address_name: string;
  address: string;
  lga: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  pickup_request_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface PickupRequestEvent {
  id: string;
  pickup_request_id: string;
  status: PickupStatus;
  note: string | null;
  created_by: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: string;
  highlight: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  hero_title: string | null;
  hero_subtitle: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  whatsapp_number: string | null;
  facebook_url: string | null;
  twitter_url: string | null;
  instagram_url: string | null;
  updated_at: string;
}
