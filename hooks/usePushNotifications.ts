import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Configuration du comportement des notifications quand l'app est ouverte
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    // Ajout des propriétés manquantes pour correspondre au type NotificationBehavior
    // Ces propriétés sont requises dans les versions récentes d'expo-notifications
    // @ts-ignore - Propriétés potentiellement non documentées mais requises par le type
    shouldShowBanner: true, 
    shouldShowList: true,
  }),
});

async function registerForPushNotificationsAsync(): Promise<string | null> {
  let token;

  if (!Device.isDevice) {
    alert('Les notifications push ne fonctionnent que sur des appareils physiques.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    // L'utilisateur a refusé les permissions. On peut éventuellement afficher un message.
    console.log('Permission de notification non accordée.');
    return null;
  }

  // Récupération du token
  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      throw new Error('Le projectId EAS est manquant dans la configuration de l\'application.');
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
  } catch (e) {
    console.error("Erreur lors de l'obtention du push token:", e);
    return null;
  }

  // Requis pour Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    const setupNotifications = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);

        // Sauvegarder le token dans la base de données
        // L'utilisation de `upsert` évite les doublons si l'utilisateur se reconnecte
        const { error } = await supabase
          .from('push_tokens')
          .upsert({ user_id: user.id, token: token }, { onConflict: 'user_id, token' });

        if (error) {
          console.error('Erreur lors de la sauvegarde du push token:', error.message);
        }
      }
    };

    setupNotifications();

    // Listener pour les notifications reçues pendant que l'app est ouverte
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // Listener pour les interactions avec les notifications (clic)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Ici, on pourrait naviguer vers un écran spécifique en fonction de la notification
    });

    // Nettoyage des listeners quand le composant est démonté
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user]); // Le hook se ré-exécute si l'utilisateur change

  return {
    expoPushToken,
    notification,
  };
}
