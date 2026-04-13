import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Pieza = ({ item, eliminarPieza, abrirModal, editarPieza }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => abrirModal(item)}
      activeOpacity={0.9}
    >
      <View style={styles.encabezado}>
        <View>
          <Text style={styles.titulo}>{item.tipo}</Text>
          <Text style={styles.fecha}>{item.fechaCambio}</Text>
        </View>

        <Text style={styles.flecha}>›</Text>
      </View>

      <View style={styles.filaAcciones}>
        <TouchableOpacity
          style={styles.botonEditar}
          onPress={() => editarPieza(item)}
          activeOpacity={0.8}
        >
          <Text style={styles.textoEditar}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.botonEliminar}
          onPress={() => eliminarPieza(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.textoEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  encabezado: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  fecha: {
    fontSize: 14,
    color: '#8E8E93',
  },
  flecha: {
    fontSize: 28,
    color: '#C7C7CC',
    fontWeight: '300',
  },
  filaAcciones: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 14,
  },
  botonEditar: {
    backgroundColor: '#EAF3FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  textoEditar: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '700',
  },
  botonEliminar: {
    backgroundColor: '#FFE9E8',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  textoEliminar: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Pieza;
