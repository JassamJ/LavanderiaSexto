import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import request from '../utils/request';
import { useNavigation } from '@react-navigation/native';

export default function GarmentListScreen() {
  const [garments, setGarments] = useState([]);
  const navigation = useNavigation();

  const fetchGarments = async () => {
    try {
      const response = await request.get('/garments');
      setGarments(response.data);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar las prendas');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert(
      'Eliminar',
      '¿Seguro que quieres eliminar esta prenda?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await request.delete(`/garments/delete/${id}`);
              fetchGarments();
              Alert.alert('Eliminado', 'Prenda eliminada correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar la prenda');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchGarments);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Prendas</Text>
      <FlatList
        data={garments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.type}</Text>
            <Text>{item.description}</Text>
            <Text>{item.observations}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => navigation.navigate('EditGarment', { garment: item })}>
                <Text style={styles.edit}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.delete}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateGarment')}>
        <Text style={styles.addButtonText}>+ Nueva Prenda</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1E1E1E' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#FFD700', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12 },
  name: { fontWeight: 'bold', fontSize: 18 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  edit: { color: '#FFD700' },
  delete: { color: 'red' },
  addButton: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  addButtonText: { color: '#1E1E1E', fontWeight: '700', fontSize: 16 },
});
