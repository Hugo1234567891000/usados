import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Property3DTour {
  id: string;
  property_id: string | null;
  status: 'processing' | 'ready' | 'error' | 'archived';
  room_count: number;
  has_floor_plan: boolean;
  has_ar_model: boolean;
  has_vr_optimized: boolean;
  total_views: number;
  vr_views: number;
  ar_views: number;
  created_at: string;
  updated_at: string;
}

export interface TourRoom {
  id: string;
  tour_id: string;
  room_name: string;
  room_order: number;
  image_urls: string[];
  thumbnail_url: string | null;
  capture_metadata: Record<string, any>;
  created_at: string;
}

export interface FloorPlan {
  id: string;
  tour_id: string;
  svg_data: string | null;
  total_area: number | null;
  room_dimensions: Record<string, any>;
  confidence_level: 'high' | 'medium' | 'low';
  manually_edited: boolean;
  created_at: string;
  updated_at: string;
}

export interface ARModel {
  id: string;
  tour_id: string;
  glb_url: string | null;
  usdz_url: string | null;
  file_size_mb: number | null;
  optimization_level: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface VROptimizedModel {
  id: string;
  tour_id: string;
  headset_type: 'quest' | 'vision_pro' | 'hololens' | 'generic';
  model_url: string;
  quality_preset: 'high' | 'medium' | 'low';
  supports_passthrough: boolean;
  supports_hand_tracking: boolean;
  file_size_mb: number | null;
  created_at: string;
}

export interface TourAnalytics {
  id: string;
  tour_id: string;
  user_id: string | null;
  view_type: 'web_3d' | 'mobile_ar' | 'vr_headset';
  headset_model: string | null;
  duration_seconds: number;
  rooms_visited: string[];
  heatmap_data: Record<string, any>;
  device_info: Record<string, any>;
  created_at: string;
}

export const uploadTourImage = async (
  tourId: string,
  roomId: string,
  file: File,
  index: number
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${tourId}/${roomId}/${index}.${fileExt}`;
    const filePath = `tours/${fileName}`;

    const { data, error } = await supabase.storage
      .from('property-tours')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('property-tours')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const createTour = async (propertyId?: string): Promise<Property3DTour | null> => {
  try {
    const { data, error } = await supabase
      .from('property_3d_tours')
      .insert({
        property_id: propertyId || null,
        status: 'processing',
        room_count: 0
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating tour:', error);
    return null;
  }
};

export const addRoomToTour = async (
  tourId: string,
  roomName: string,
  imageUrls: string[],
  thumbnailUrl: string | null = null
): Promise<TourRoom | null> => {
  try {
    const { data: rooms } = await supabase
      .from('tour_rooms')
      .select('room_order')
      .eq('tour_id', tourId)
      .order('room_order', { ascending: false })
      .limit(1);

    const nextOrder = rooms && rooms.length > 0 ? rooms[0].room_order + 1 : 0;

    const { data, error } = await supabase
      .from('tour_rooms')
      .insert({
        tour_id: tourId,
        room_name: roomName,
        room_order: nextOrder,
        image_urls: imageUrls,
        thumbnail_url: thumbnailUrl
      })
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from('property_3d_tours')
      .update({
        room_count: nextOrder + 1,
        status: 'ready'
      })
      .eq('id', tourId);

    return data;
  } catch (error) {
    console.error('Error adding room:', error);
    return null;
  }
};

export const getTourWithRooms = async (tourId: string) => {
  try {
    const { data: tour, error: tourError } = await supabase
      .from('property_3d_tours')
      .select('*')
      .eq('id', tourId)
      .single();

    if (tourError) throw tourError;

    const { data: rooms, error: roomsError } = await supabase
      .from('tour_rooms')
      .select('*')
      .eq('tour_id', tourId)
      .order('room_order', { ascending: true });

    if (roomsError) throw roomsError;

    return { tour, rooms };
  } catch (error) {
    console.error('Error fetching tour:', error);
    return null;
  }
};

export const trackTourView = async (
  tourId: string,
  viewType: 'web_3d' | 'mobile_ar' | 'vr_headset',
  durationSeconds: number = 0,
  headsetModel?: string
) => {
  try {
    const deviceInfo = {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    };

    await supabase.from('tour_analytics').insert({
      tour_id: tourId,
      view_type: viewType,
      headset_model: headsetModel || null,
      duration_seconds: durationSeconds,
      device_info: deviceInfo
    });

    const updateField = viewType === 'vr_headset' ? 'vr_views' :
                        viewType === 'mobile_ar' ? 'ar_views' : 'total_views';

    await supabase.rpc('increment_tour_views', {
      tour_id: tourId,
      view_field: updateField
    });
  } catch (error) {
    console.error('Error tracking view:', error);
  }
};
