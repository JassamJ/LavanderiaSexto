import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import request from '../utils/request'; 

export default function CreateUserScreen({ navigation }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      Alert.alert('Error', 'Todos los campos (Nombre, Correo y Contraseña) son obligatorios');
      return;
    }

    try {
      await request.post('/users/register', {
        name: nombre,
        email: email,
        password: password,    
      });
      Alert.alert('Éxito', 'Usuario creado correctamente');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Register error:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo registrar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={nombre}
        onChangeText={setNombre}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Volver al Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  padding: 28,
  backgroundColor: '#1e1e1e', 
  justifyContent: 'center',
},
title: {
  fontSize: 30,
  fontWeight: '800',
  marginBottom: 28,
  textAlign: 'left',
  color: '#FFD700', 
  letterSpacing: 1,
},
input: {
  borderWidth: 1,
  borderColor: '#444',
  marginBottom: 20,
  paddingVertical: 14,
  paddingHorizontal: 16,
  borderRadius: 12,
  fontSize: 16,
  backgroundColor: '#2a2a2a',
  color: '#fff',
},
button: {
  backgroundColor: '#FFD700',
  paddingVertical: 16,
  borderRadius: 12,
  alignItems: 'center',
  marginBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 4,
},
buttonText: {
  color: '#1e1e1e',
  fontWeight: 'bold',
  fontSize: 16,
},
link: {
  textAlign: 'center',
  color: '#FFD700',
  marginTop: 12,
  fontWeight: '600',
  textDecorationLine: 'underline',
},
});
