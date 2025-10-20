export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          password_hash: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          password_hash: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          password_hash?: string
          created_at?: string
          updated_at?: string
        }
      }
      agencies: {
        Row: {
          id: string
          name: string
          logo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          logo?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          agency_id: string
          nama_layanan: string
          dasar_hukum: string[] | null
          persyaratan: string[]
          sistem_mekanisme_prosedur: string[]
          jangka_waktu: string
          lokasi_gerai: string
          biaya: string | null
          catatan_tambahan: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          agency_id: string
          nama_layanan: string
          dasar_hukum?: string[] | null
          persyaratan: string[]
          sistem_mekanisme_prosedur: string[]
          jangka_waktu: string
          lokasi_gerai: string
          biaya?: string | null
          catatan_tambahan?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          agency_id?: string
          nama_layanan?: string
          dasar_hukum?: string[] | null
          persyaratan?: string[]
          sistem_mekanisme_prosedur?: string[]
          jangka_waktu?: string
          lokasi_gerai?: string
          biaya?: string | null
          catatan_tambahan?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      mpp_profile: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          operating_hours_workdays: string | null
          operating_hours_weekends: string | null
          contact_phone: string | null
          contact_email: string | null
          social_media_instagram: string | null
          social_media_facebook: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          operating_hours_workdays?: string | null
          operating_hours_weekends?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          social_media_instagram?: string | null
          social_media_facebook?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string | null
          operating_hours_workdays?: string | null
          operating_hours_weekends?: string | null
          contact_phone?: string | null
          contact_email?: string | null
          social_media_instagram?: string | null
          social_media_facebook?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chat_logs: {
        Row: {
          id: string
          query: string
          service_inquired: string | null
          response_time: number | null
          was_successful: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          query: string
          service_inquired?: string | null
          response_time?: number | null
          was_successful?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          query?: string
          service_inquired?: string | null
          response_time?: number | null
          was_successful?: boolean | null
          created_at?: string
        }
      }
    }
  }
}
