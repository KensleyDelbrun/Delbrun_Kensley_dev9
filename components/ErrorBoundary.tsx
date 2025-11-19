import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle } from 'lucide-react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Mettre à jour l'état pour que le prochain rendu affiche l'interface de secours.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Vous pouvez également enregistrer l'erreur dans un service de rapport d'erreurs
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      // Vous pouvez rendre n'importe quelle interface de secours personnalisée
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            <AlertTriangle color="#F59E0B" size={48} />
            <Text style={styles.title}>Oups, une erreur est survenue.</Text>
            <Text style={styles.subtitle}>
              Quelque chose s'est mal passé. Notre équipe a été notifiée.
            </Text>
            <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
              <Text style={styles.buttonText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171717',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#A3A3A3',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    marginTop: 32,
    backgroundColor: '#9E7FFF',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 100,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ErrorBoundary;
