import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import constants from '../constants';
import request from '../utils/request';

const { services, garments } = constants;

const defaultGarment = {
  type: garments[0],
  description: '',
  observations: '', 
  services: [{ ...services[0] }],
};

export default function CreateOrderScreen({ navigation }) {
  const [order, setOrder] = useState({
    client_id: 1,
    user_id: 0,
    state: 'recibido',
    total: 0,
    pagado: false,
    estimated_delivery_date: '',
    garments: [defaultGarment],
  });

  const [total, setTotal] = useState(0);

  const calculateTotal = () => {
    let subTotal = 0;
    for (const garment of order.garments || []) {
      for (const service of garment.services) {
        subTotal += service.quantity * service.unitPrice;
      }
    }
    setTotal(subTotal);
    setOrder(prev => ({ ...prev, total: subTotal }));
  };

  const addGarment = () => {
    setOrder(prev => ({
      ...prev,
      garments: [...(prev.garments || []), { ...defaultGarment }]
    }));
  };

  const onChangeGarment = (index, field, value) => {
    const newGarments = [...order.garments];
    newGarments[index][field] = value;
    setOrder(prev => ({ ...prev, garments: newGarments }));
  };

  const onChangeService = (gIndex, sIndex, field, value) => {
    const newGarments = [...order.garments];
    if (field === 'name') {
      const found = services.find(s => s.name === value);
      if (found) newGarments[gIndex].services[sIndex] = { ...found };
    } else {
      const newValue = parseFloat(value) || 0;
      newGarments[gIndex].services[sIndex][field] = newValue;
    }
    setOrder(prev => ({ ...prev, garments: newGarments }));
    calculateTotal();
  };

  const addService = (gIndex) => {
    const newGarments = [...order.garments];
    newGarments[gIndex].services.push({ ...services[0] });
    setOrder(prev => ({ ...prev, garments: newGarments }));
  };

  const onSubmit = async () => {
    if (!order.estimated_delivery_date) {
      Alert.alert('Error', 'Debes ingresar la fecha estimada de entrega');
      return;
    }
    try {
      await request.post('/orders/create', order);
      Alert.alert('Éxito', 'Orden creada correctamente');
      navigation.goBack();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo crear la orden');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Orden</Text>

      <TextInput
        style={styles.input}
        placeholder="Fecha estimada de entrega (YYYY-MM-DD)"
        value={order.estimated_delivery_date}
        onChangeText={(text) => setOrder(prev => ({ ...prev, estimated_delivery_date: text }))}
      />

      {order.garments.map((garment, gIndex) => (
        <View key={gIndex} style={styles.garmentBox}>
          <Text style={styles.subTitle}>Prenda #{gIndex + 1}</Text>

          <TextInput
            style={styles.input}
            placeholder="Tipo de prenda"
            value={garment.type}
            onChangeText={(value) => onChangeGarment(gIndex, 'type', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={garment.description}
            onChangeText={(value) => onChangeGarment(gIndex, 'description', value)}
          />

          <TextInput
            style={styles.input}
            placeholder="Observaciones"
            value={garment.observations}
            onChangeText={(value) => onChangeGarment(gIndex, 'observations', value)}
          />

          {garment.services.map((service, sIndex) => (
            <View key={sIndex} style={styles.serviceBox}>
              <Text style={styles.serviceLabel}>Servicio #{sIndex + 1}</Text>

              <TextInput
                style={styles.input}
                placeholder="Nombre del servicio"
                value={service.name}
                onChangeText={(value) => onChangeService(gIndex, sIndex, 'name', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Cantidad"
                keyboardType="numeric"
                value={service.quantity.toString()}
                onChangeText={(value) => onChangeService(gIndex, sIndex, 'quantity', value)}
              />

              <TextInput
                style={styles.input}
                placeholder="Precio Unitario"
                keyboardType="numeric"
                value={service.unitPrice.toString()}
                onChangeText={(value) => onChangeService(gIndex, sIndex, 'unitPrice', value)}
              />
            </View>
          ))}

          <TouchableOpacity onPress={() => addService(gIndex)} style={styles.smallButton}>
            <Text style={styles.buttonText}>Agregar Servicio</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={addGarment} style={styles.button}>
        <Text style={styles.buttonText}>Agregar Prenda</Text>
      </TouchableOpacity>

      <Text style={styles.total}>Total: ${total}</Text>

      <TouchableOpacity onPress={onSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Guardar Orden</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#1E1E1E' },
  title: { fontSize: 24, fontWeight: '700', color: '#FFD700', marginBottom: 20 },
  subTitle: { fontSize: 18, fontWeight: '600', color: '#fff', marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: '#2A2A2A',
  },
  garmentBox: {
    borderWidth: 1,
    borderColor: '#FFD700',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  serviceBox: {
    marginTop: 10,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 10,
  },
  serviceLabel: { color: '#FFD700', fontWeight: '600' },
  button: {
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  smallButton: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#1E1E1E', fontWeight: '700' },
  total: { fontSize: 18, color: '#fff', fontWeight: '600', textAlign: 'right', marginVertical: 10 },
});


/* RESUMEN DE LA ORDEN */
<View style={styles.resumeBox}>
  <Text style={styles.resumeTitle}>Resumen de la Orden</Text>

  {order.garments.map((garment, gIndex) => (
      <View key={gIndex} style={styles.resumeGarment}>
      <Text style={styles.resumeText}>
        {gIndex + 1}. {garment.type}
      </Text>
      {garment.services.map((service, sIndex) => {
        const subtotal = service.unitPrice * service.quantity;
        return (
          <Text key={sIndex} style={styles.resumeService}>
            Servicio: {service.name} | Cant: {service.quantity} x ${service.unitPrice} = ${subtotal.toFixed(2)}
          </Text>
        );
      })}
    </View>
  ))}

  <Text style={styles.totalResume}>TOTAL: ${total.toFixed(2)}</Text>
</View>