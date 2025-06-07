import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import request from '../utils/request';
import { useNavigation } from '@react-navigation/native';

export default function ClientListScreen() {
  const [searchName, setSearchName] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [clients, setClients] = useState([]);

  // Para saber qué cliente estamos editando
  const [editingClientId, setEditingClientId] = useState(null);
  // Campos de edición
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const navigation = useNavigation();

  const fetchByName = async () => {
    if (!searchName.trim()) {
      Alert.alert('Error', 'Ingresa al menos una letra para buscar por nombre');
      return;
    }
    try {
      const response = await request.get(
        `/clients/search/name?name=${encodeURIComponent(searchName.trim())}`
      );
      setClients(response.data);
      resetEditing();
    } catch (error) {
      console.error('Error fetching by name:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudieron cargar los clientes por nombre');
    }
  };


  const fetchByPhone = async () => {
    if (!searchPhone.trim()) {
      Alert.alert('Error', 'Ingresa un número de teléfono para buscar');
      return;
    }
    try {
      const response = await request.get(
        `/clients/search/phone?phone=${encodeURIComponent(searchPhone.trim())}`
      );
      if (response.status === 200) {
        setClients([response.data]);
        resetEditing();
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        Alert.alert('No encontrado', 'No hay cliente con ese teléfono');
        setClients([]);
        resetEditing();
      } else {
        console.error('Error fetching by phone:', error.response?.data || error.message);
        Alert.alert('Error', 'No se pudo buscar el cliente por teléfono');
      }
    }
  };


  const startEdit = (client) => {
    setEditingClientId(client.id);
    setEditName(client.name);
    setEditPhone(client.phone_number);
    setEditAddress(client.address);
  };

 
  const cancelEdit = () => {
    resetEditing();
  };

  const resetEditing = () => {
    setEditingClientId(null);
    setEditName('');
    setEditPhone('');
    setEditAddress('');
  };


  const saveEdit = async (clientId) => {
    if (!editName.trim() || !editPhone.trim() || !editAddress.trim()) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    try {
      await request.put(`/clients/update/${clientId}`, {
        name: editName.trim(),
        phone_number: editPhone.trim(),
        address: editAddress.trim(),
      });

      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId
            ? { ...c, name: editName.trim(), phone_number: editPhone.trim(), address: editAddress.trim() }
            : c
        )
      );
      Alert.alert('Éxito', 'Cliente actualizado correctamente');
      resetEditing();
    } catch (error) {
      console.error('Update client error:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo actualizar el cliente');
    }
  };


  const handleDelete = async (clientId) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Seguro que deseas eliminar este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await request.delete(`/clients/delete/${clientId}`);
              setClients((prev) => prev.filter((c) => c.id !== clientId));
              Alert.alert('Eliminado', 'Cliente eliminado correctamente');
              resetEditing();
            } catch (error) {
              console.error('Delete client error:', error.response?.data || error.message);
              Alert.alert('Error', 'No se pudo eliminar el cliente');
            }
          },
        },
      ]
    );
  };


  const renderItem = ({ item }) => {
    if (item.id === editingClientId) {
      // Modo edición
      return (
        <View style={[styles.itemContainer, styles.editContainer]}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={editName}
            onChangeText={setEditName}
            placeholder="Nombre"
          />
          <TextInput
            style={[styles.input, { flex: 1, marginTop: 8 }]}
            value={editPhone}
            onChangeText={setEditPhone}
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />
          <TextInput
            style={[styles.input, { flex: 1, marginTop: 8 }]}
            value={editAddress}
            onChangeText={setEditAddress}
            placeholder="Dirección"
          />
          <View style={styles.editButtons}>
            <TouchableOpacity
              style={[styles.buttonSmall, styles.saveButton]}
              onPress={() => saveEdit(item.id)}
            >
              <Text style={styles.buttonTextSmall}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.buttonSmall, styles.cancelButton]}
              onPress={cancelEdit}
            >
              <Text style={styles.buttonTextSmall}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

  
    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subtext}>Teléfono: {item.phone_number}</Text>
          <Text style={styles.subtext}>Dirección: {item.address}</Text>
        </View>
        <View style={styles.itemButtons}>
          <TouchableOpacity
            style={[styles.buttonSmall, styles.editButton]}
            onPress={() => startEdit(item)}
          >
            <Text style={styles.buttonTextSmall}>Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonSmall, styles.deleteButton]}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.buttonTextSmall}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Clientes</Text>

      
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por nombre"
          value={searchName}
          onChangeText={setSearchName}
          returnKeyType="search"
          onSubmitEditing={fetchByName}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchByName}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      
      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder="Buscar por teléfono"
          value={searchPhone}
          onChangeText={setSearchPhone}
          keyboardType="phone-pad"
          returnKeyType="search"
          onSubmitEditing={fetchByPhone}
        />
        <TouchableOpacity style={styles.searchButton} onPress={fetchByPhone}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      
      {clients.length > 0 ? (
        <FlatList
          data={clients}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay clientes para mostrar</Text>
        </View>
      )}

      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateClient')}
      >
        <Text style={styles.addButtonText}>+ Nuevo Cliente</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  padding: 24,
  backgroundColor: '#1E1E1E',
},
title: {
  fontSize: 32,
  fontWeight: '900',
  marginBottom: 20,
  textAlign: 'left',
  color: '#FFD700',
},
searchSection: {
  flexDirection: 'row',
  marginBottom: 16,
  gap: 8,
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
searchButton: {
  backgroundColor: '#FFD700', 
  paddingVertical: 14,
  paddingHorizontal: 18,
  borderRadius: 10,
  justifyContent: 'center',
},
searchButtonText: {
  color: '#FFFFFF',
  fontWeight: '600',
  fontSize: 14,
},
listContainer: {
  paddingTop: 12,
},
itemContainer: {
  flexDirection: 'row',
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  padding: 16,
  marginBottom: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
},
editContainer: {
  flexDirection: 'column',
  gap: 6,
},
itemInfo: {
  flex: 1,
},
name: {
  fontWeight: '700',
  fontSize: 18,
  marginBottom: 4,
  color: '#111827',
},
subtext: {
  color: '#6B7280',
  fontSize: 14,
},
itemButtons: {
  justifyContent: 'space-between',
  gap: 6,
},
buttonSmall: {
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 8,
},
editButton: {
  backgroundColor: '#FFD700', // amarillo oscuro
},
deleteButton: {
  backgroundColor: '#FFD700', // rojo intenso
},
saveButton: {
  backgroundColor: '#FFD700', // verde esmeralda
},
cancelButton: {
  backgroundColor: '#FFD700', // gris medio
},
buttonTextSmall: {
  color: '#1E1E1E',
  fontWeight: '600',
  fontSize: 13,
  textAlign: 'center',
},
emptyContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: 60,
},
emptyText: {
  color: '#9CA3AF',
  fontStyle: 'italic',
  fontSize: 15,
},
addButton: {
  backgroundColor: '#10B981', // verde fuerte
  paddingVertical: 16,
  paddingHorizontal: 20,
  borderRadius: 50,
  alignItems: 'center',
  position: 'absolute',
  bottom: 24,
  right: 24,
  elevation: 5,
},
addButtonText: {
  color: '#1E1E1E',
  fontWeight: '700',
  fontSize: 16,
},
});
