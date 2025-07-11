import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import request from '../utils/request';

export default function CreateGarmentScreen({ navigation }) {
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [observations, setObservations] = useState('');

  const handleCreate = async () => {
    if (!type || !description || !observations) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    try {
      await request.post('/garments/create', { type, description, observations });
      Alert.alert('Éxito', 'Prenda creada correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear la prenda');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Prenda</Text>
      <TextInput style={styles.input} placeholder="Tipo" value={type} onChangeText={setType} />
      <TextInput style={styles.input} placeholder="Descripción" value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} placeholder="Observaciones" value={observations} onChangeText={setObservations} />
      <TouchableOpacity style={styles.button} onPress={handleCreate}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#1E1E1E' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFD700', marginBottom: 20 },
  input: {
    backgroundColor: '#fff', padding: 14, borderRadius: 10, marginBottom: 16,
    fontSize: 16
  },
  button: {
    backgroundColor: '#FFD700', padding: 16, borderRadius: 12, alignItems: 'center',
  },
  buttonText: { color: '#1E1E1E', fontWeight: 'bold', fontSize: 16 },
});
