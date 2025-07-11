import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import request from '../utils/request';

export default function EditGarmentScreen({ route, navigation }) {
  const { garment } = route.params;
  const [type, setType] = useState(garment.type);
  const [description, setDescription] = useState(garment.description);
  const [observations, setObservations] = useState(garment.observations);

  const handleUpdate = async () => {
    try {
      await request.put(`/garments/update/${garment.id}`, { type, description, observations });
      Alert.alert('Éxito', 'Prenda actualizada');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la prenda');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Prenda</Text>
      <TextInput style={styles.input} value={type} onChangeText={setType} />
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />
      <TextInput style={styles.input} value={observations} onChangeText={setObservations} />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Actualizar</Text>
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
