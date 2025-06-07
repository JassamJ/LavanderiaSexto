import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function UpdateClientScreen({ route, navigation }) {
  const { clientId, currentName, currentEmail } = route.params;
  const [name, setName] = useState(currentName);
  const [email, setEmail] = useState(currentEmail);
  const { token } = useAuth();

  const handleUpdate = async () => {
    try {
      const res = await fetch(` http://127.0.0.1:5000/clients/update/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Client updated');
        navigation.navigate('ClientList');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Update Client</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  paddingHorizontal: 30,
  paddingVertical: 40,
  backgroundColor: '#amber',
  justifyContent: 'center',
},
title: {
  fontSize: 26,
  fontWeight: '700',
  marginBottom: 25,
  color: '#344055',  
  textAlign: 'center',
  letterSpacing: 1,
},
input: {
  borderWidth: 2,
  borderColor: '#AAC4FF', 
  paddingVertical: 14,
  paddingHorizontal: 18,
  borderRadius: 10,
  marginBottom: 18,
  backgroundColor: '#fff',
  fontSize: 16,
  color: '#344055',
  shadowColor: '#AAC4FF',
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 4,
},
});
