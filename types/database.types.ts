export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name_fr: string;
          name_ht: string;
          description_fr: string;
          description_ht: string;
          icon: string;
          color: string;
          order_index: number;
          created_at: string;
        };
      };
      articles: {
        Row: {
          id: string;
          category_id: string;
          title_fr: string;
          title_ht: string;
          content_fr: string;
          content_ht: string;
          summary_fr: string;
          summary_ht: string;
          image_url: string | null;
          media_type: 'text' | 'image' | 'video' | 'audio';
          media_url: string | null;
          is_featured: boolean;
          published_at: string;
          created_at: string;
          updated_at: string;
        };
      };
      saved_articles: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          saved_at: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          preferred_language: 'fr' | 'ht';
          created_at: string;
          updated_at: string;
        };
      };
      user_preferences: {
        Row: {
          id: string;
          dark_mode: boolean;
          dark_mode_auto: boolean;
          notifications_enabled: boolean;
          notification_sound: boolean;
          auto_download: boolean;
          text_size: number;
          new_articles_notif: boolean;
          read_reminders_notif: boolean;
          weekly_summary_notif: boolean;
          community_updates_notif: boolean;
          important_news_notif: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          dark_mode?: boolean;
          dark_mode_auto?: boolean;
          notifications_enabled?: boolean;
          notification_sound?: boolean;
          auto_download?: boolean;
          text_size?: number;
          new_articles_notif?: boolean;
          read_reminders_notif?: boolean;
          weekly_summary_notif?: boolean;
          community_updates_notif?: boolean;
          important_news_notif?: boolean;
        };
        Update: {
          id?: string;
          dark_mode?: boolean;
          dark_mode_auto?: boolean;
          notifications_enabled?: boolean;
          notification_sound?: boolean;
          auto_download?: boolean;
          text_size?: number;
          new_articles_notif?: boolean;
          read_reminders_notif?: boolean;
          weekly_summary_notif?: boolean;
          community_updates_notif?: boolean;
          important_news_notif?: boolean;
          updated_at?: string;
        };
      };
      push_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          token: string;
        };
        Update: {
          user_id?: string;
          token?: string;
        };
      };
    };
  };
};
