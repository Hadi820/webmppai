import { supabase } from '../lib/supabase';
import { Agency, ServiceDetails, MppProfile, User, ChatLog } from '../types';
import type { Database } from '../lib/database.types';

// Simple password hashing utility (for demo - use bcrypt in production)
const hashPassword = async (password: string): Promise<string> => {
  // Simple hash for demo purposes - REPLACE with bcrypt in production
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Type helpers for Supabase operations
type AgencyRow = Database['public']['Tables']['agencies']['Row'];
type ServiceRow = Database['public']['Tables']['services']['Row'];
type UserRow = Database['public']['Tables']['users']['Row'];
type MppProfileRow = Database['public']['Tables']['mpp_profile']['Row'];
type ChatLogRow = Database['public']['Tables']['chat_logs']['Row'];

// ============================================
// AGENCIES CRUD
// ============================================

export const fetchAgencies = async (): Promise<Agency[]> => {
  try {
    const { data: agenciesData, error: agenciesError } = await supabase
      .from('agencies')
      .select('*')
      .order('name');

    if (agenciesError) {
      throw new Error(`Failed to fetch agencies: ${agenciesError.message}`);
    }

    if (!agenciesData) return [];

    // Fetch services for each agency
    const { data: servicesData, error: servicesError } = await supabase
      .from('services')
      .select('*');

    if (servicesError) {
      throw new Error(`Failed to fetch services: ${servicesError.message}`);
    }

    if (!servicesData) return [];

    // Map services to agencies
    const agencies: Agency[] = agenciesData.map((agency: AgencyRow) => ({
      id: agency.id,
      name: agency.name,
      logo: agency.logo || '',
      services: servicesData
        .filter((service: ServiceRow) => service.agency_id === agency.id)
        .map((service: ServiceRow) => ({
          namaLayanan: service.nama_layanan,
          dasarHukum: service.dasar_hukum || undefined,
          persyaratan: service.persyaratan,
          sistemMekanismeProsedur: service.sistem_mekanisme_prosedur,
          jangkaWaktu: service.jangka_waktu,
          lokasiGerai: service.lokasi_gerai,
          biaya: service.biaya || undefined,
          catatanTambahan: service.catatan_tambahan || undefined,
        }))
    }));

    return agencies;
  } catch (error) {
    console.error('Error in fetchAgencies:', error);
    throw error;
  }
};

export const createAgency = async (name: string, logo?: string): Promise<Agency> => {
  try {
    const { data, error } = await supabase
      .from('agencies')
      .insert([{ name, logo: logo || null }] as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create agency: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from agency creation');
    }

    const agency = data as AgencyRow;
    return {
      id: agency.id,
      name: agency.name,
      logo: agency.logo || '',
      services: []
    };
  } catch (error) {
    console.error('Error in createAgency:', error);
    throw error;
  }
};

export const updateAgency = async (id: string, name: string, logo?: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('agencies')
      .update({ name, logo: logo || null } as any)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update agency: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateAgency:', error);
    throw error;
  }
};

export const deleteAgency = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('agencies')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete agency: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteAgency:', error);
    throw error;
  }
};

// ============================================
// SERVICES CRUD
// ============================================

export const createService = async (agencyId: string, service: ServiceDetails): Promise<void> => {
  try {
    const { error } = await supabase
      .from('services')
      .insert([{
        agency_id: agencyId,
        nama_layanan: service.namaLayanan,
        dasar_hukum: service.dasarHukum || null,
        persyaratan: service.persyaratan,
        sistem_mekanisme_prosedur: service.sistemMekanismeProsedur,
        jangka_waktu: service.jangkaWaktu,
        lokasi_gerai: service.lokasiGerai,
        biaya: service.biaya || null,
        catatan_tambahan: service.catatanTambahan || null,
      }] as any);

    if (error) {
      throw new Error(`Failed to create service: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in createService:', error);
    throw error;
  }
};

export const updateService = async (
  agencyId: string, 
  oldServiceName: string, 
  newService: ServiceDetails
): Promise<void> => {
  try {
    // Find the service by agency_id and nama_layanan
    const { data: existingServices, error: fetchError } = await supabase
      .from('services')
      .select('id')
      .eq('agency_id', agencyId)
      .eq('nama_layanan', oldServiceName)
      .single();

    if (fetchError) {
      throw new Error(`Failed to find service: ${fetchError.message}`);
    }

    if (!existingServices) {
      throw new Error('Service not found');
    }

    const service = existingServices as { id: string };
    const { error } = await supabase
      .from('services')
      .update({
        nama_layanan: newService.namaLayanan,
        dasar_hukum: newService.dasarHukum || null,
        persyaratan: newService.persyaratan,
        sistem_mekanisme_prosedur: newService.sistemMekanismeProsedur,
        jangka_waktu: newService.jangkaWaktu,
        lokasi_gerai: newService.lokasiGerai,
        biaya: newService.biaya || null,
        catatan_tambahan: newService.catatanTambahan || null,
      } as any)
      .eq('id', service.id);

    if (error) {
      throw new Error(`Failed to update service: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateService:', error);
    throw error;
  }
};

export const deleteService = async (agencyId: string, serviceName: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('agency_id', agencyId)
      .eq('nama_layanan', serviceName);

    if (error) {
      throw new Error(`Failed to delete service: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteService:', error);
    throw error;
  }
};

// ============================================
// MPP PROFILE
// ============================================

export const fetchMppProfile = async (): Promise<MppProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('mpp_profile')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching MPP profile:', error);
      return null;
    }

    if (!data) return null;

    const profile = data as MppProfileRow;
    return {
      name: profile.name,
      description: profile.description || '',
      address: profile.address || '',
      operatingHours: {
        workdays: profile.operating_hours_workdays || '',
        weekends: profile.operating_hours_weekends || '',
      },
      contact: {
        phone: profile.contact_phone || '',
        email: profile.contact_email || '',
      },
      socialMedia: {
        instagram: profile.social_media_instagram || '',
        facebook: profile.social_media_facebook || '',
      },
    };
  } catch (error) {
    console.error('Error in fetchMppProfile:', error);
    return null;
  }
};

export const updateMppProfile = async (profile: MppProfile): Promise<void> => {
  try {
    // Get the first profile (there should only be one)
    const { data: existingProfile } = await supabase
      .from('mpp_profile')
      .select('id')
      .limit(1)
      .single();

    const profileData = {
      name: profile.name,
      description: profile.description,
      address: profile.address,
      operating_hours_workdays: profile.operatingHours.workdays,
      operating_hours_weekends: profile.operatingHours.weekends,
      contact_phone: profile.contact.phone,
      contact_email: profile.contact.email,
      social_media_instagram: profile.socialMedia.instagram,
      social_media_facebook: profile.socialMedia.facebook,
    };

    if (existingProfile) {
      const existing = existingProfile as { id: string };
      const { error } = await supabase
        .from('mpp_profile')
        .update(profileData as any)
        .eq('id', existing.id);

      if (error) {
        throw new Error(`Failed to update MPP profile: ${error.message}`);
      }
    } else {
      const { error } = await supabase
        .from('mpp_profile')
        .insert([profileData] as any);

      if (error) {
        throw new Error(`Failed to create MPP profile: ${error.message}`);
      }
    }
  } catch (error) {
    console.error('Error in updateMppProfile:', error);
    throw error;
  }
};

// ============================================
// USERS (Admin)
// ============================================

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    if (!data) return [];

    return data.map((user: UserRow) => ({
      id: user.id, // Keep UUID as string
      username: user.username,
      password: '********', // Never expose password hashes
    }));
  } catch (error) {
    console.error('Error in fetchUsers:', error);
    throw error;
  }
};

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  try {
    // Hash the input password
    const hashedPassword = await hashPassword(password);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', hashedPassword)
      .single();

    if (error || !data) {
      return null;
    }

    const user = data as UserRow;
    return {
      id: user.id, // Keep UUID as string
      username: user.username,
      password: '********', // Never expose password hash
    };
  } catch (error) {
    console.error('Error in authenticateUser:', error);
    return null;
  }
};

export const createUser = async (username: string, password: string): Promise<User> => {
  try {
    // Hash the password before storing
    const hashedPassword = await hashPassword(password);
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, password_hash: hashedPassword }] as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }

    if (!data) {
      throw new Error('No data returned from user creation');
    }

    const user = data as UserRow;
    return {
      id: user.id, // Keep UUID as string
      username: user.username,
      password: '********', // Never expose password hash
    };
  } catch (error) {
    console.error('Error in createUser:', error);
    throw error;
  }
};

export const updateUser = async (id: string, username: string, password: string): Promise<void> => {
  try {
    // Hash the new password
    const hashedPassword = await hashPassword(password);
    
    const { error } = await supabase
      .from('users')
      .update({ username, password_hash: hashedPassword } as any)
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
};

export const deleteUser = async (username: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('username', username);

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteUser:', error);
    throw error;
  }
};

// ============================================
// CHAT LOGS (Analytics) - DISABLED FOR PERFORMANCE
// ============================================

/* export const logChatInteraction = async (
  query: string,
  serviceInquired: string,
  responseTime: number,
  wasSuccessful: boolean
): Promise<void> => {
  try {
    const { error } = await supabase
      .from('chat_logs')
      .insert([{
        query,
        service_inquired: serviceInquired,
        response_time: responseTime,
        was_successful: wasSuccessful,
      }] as any);

    if (error) {
      console.error('Error logging chat interaction:', error);
      // Don't throw error for logging failures to not disrupt user experience
    }
  } catch (error) {
    console.error('Error in logChatInteraction:', error);
    // Silent fail for analytics
  }
};

export const fetchChatLogs = async (days: number = 30): Promise<ChatLog[]> => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from('chat_logs')
      .select('*')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch chat logs: ${error.message}`);
    }

    if (!data) return [];

    return data.map((log: ChatLogRow) => ({
      id: log.id,
      timestamp: new Date(log.created_at),
      query: log.query,
      serviceInquired: log.service_inquired || 'Lainnya',
      responseTime: log.response_time || 0,
      wasSuccessful: log.was_successful || false,
    }));
  } catch (error) {
    console.error('Error in fetchChatLogs:', error);
    throw error;
  }
}; */
