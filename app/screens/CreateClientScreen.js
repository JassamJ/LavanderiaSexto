import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import request from '../utils/request';

export default function CreateClientScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const navigation = useNavigation();

  const handleCreateClient = async () => {
    if (!name || !phone || !address) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      await request.post('/clients/create', {
        name: name,
        phone_number: phone,
        address: address,
      });
      Alert.alert('Éxito', 'Cliente creado exitosamente');
      navigation.navigate('ClientList');
    } catch (error) {
      console.error('Create client error:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo crear el cliente');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Cliente</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateClient}>
        <Text style={styles.buttonText}>Guardar Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  justifyContent: 'flex-start',
  paddingHorizontal: 24,
  backgroundColor: '#1E1E1E',
},
title: {
  fontSize: 28,
  fontWeight: '700',
  marginBottom: 24,
  textAlign: 'center',
  color: '#FFD700', 
},
input: {
  borderWidth: 1,
  borderColor: '#D3CCE3', // lila claro
  paddingVertical: 14,
  paddingHorizontal: 18,
  marginBottom: 16,
  borderRadius: 12,
  backgroundColor: '#FFFFFF',
  fontSize: 16,
  color: '#4A4E69',
  shadowColor: '#E0E0E0',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.4,
  shadowRadius: 3,
  elevation: 3,
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
  elevation: 5
},
buttonText: {
  color: '#1E1E1E',
  fontWeight: '700',
  fontSize: 16,
},

});
