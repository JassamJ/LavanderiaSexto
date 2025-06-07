import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      navigation.navigate('ClientList');
    } else {
      Alert.alert('Error', 'Credenciales incorrectas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('CreateUser')}>
        <Text style={styles.link}>¿No tienes cuenta? Crear una</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  paddingHorizontal: 25,
  paddingVertical: 40,
  justifyContent: 'flex-start',
  backgroundColor: '#1E1E1E', 
},
title: {
  fontSize: 32,
  fontWeight: '900',
  marginBottom: 20,
  textAlign: 'left',
  color: '#FFD700', // Amarillo dorado para destacar como la estrella q soy
  textShadowColor: '#333',
  textShadowOffset: { width: 1, height: 1 },
  textShadowRadius: 2,
},
input: {
  borderWidth: 2,
  borderColor: '#FFD700',
  padding: 14,
  borderRadius: 12,
  marginBottom: 20,
  backgroundColor: '#2A2A2A',
  color: '#fff',
  fontSize: 16,
},
button: {
  backgroundColor: '#FFD700',
  paddingVertical: 18,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 15,
  shadowColor: '#FFD700',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 6,
  elevation: 5,
},
buttonText: {
  color: '#1E1E1E',
  fontWeight: '700',
  fontSize: 18,
},
link: {
  textAlign: 'right',
  color: '#FFD700',
  fontWeight: '600',
  textDecorationLine: 'underline',
  marginTop: 10,
},
});
