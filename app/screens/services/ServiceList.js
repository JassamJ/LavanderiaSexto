import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import request from '../../utils/request';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const navigation = useNavigation();

  const fetchServices = async () => {
    try {
      const response = await request.get('/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error.message);
    }
  };

  const deleteService = async (id) => {
    Alert.alert('Eliminar', '¿Estás seguro de eliminar este servicio?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await request.delete(`/services/delete/${id}`);
            fetchServices();
          } catch (err) {
            Alert.alert('Error', 'No se pudo eliminar el servicio');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchServices);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.price}>Precio: ${item.unitPrice}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => navigation.navigate('EditService', { service: item })}>
          <Text style={styles.edit}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteService(item.id)}>
          <Text style={styles.delete}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Servicios</Text>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateService')}
      >
        <Text style={styles.addButtonText}>+ Nuevo Servicio</Text>
      </TouchableOpacity>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#1E1E1E' },
  title: { fontSize: 28, color: '#FFD700', fontWeight: 'bold', marginBottom: 16 },
  item: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  price: { fontSize: 16, color: '#333' },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  edit: { color: '#1E90FF', fontWeight: 'bold' },
  delete: { color: '#DC143C', fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: { color: '#1E1E1E', fontWeight: 'bold' },
});
