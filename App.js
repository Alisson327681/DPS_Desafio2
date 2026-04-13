import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Pieza from './src/components/Pieza.js';

export default function App() {
  const [piezas, setPiezas] = useState([]);

  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [precio, setPrecio] = useState('');
  const [fechaCambio, setFechaCambio] = useState('');

  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [piezaSeleccionada, setPiezaSeleccionada] = useState(null);

  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const limpiarCampos = () => {
    setTipo('');
    setMarca('');
    setNumeroSerie('');
    setPrecio('');
    setFechaCambio('');
    setModoEdicion(false);
    setIdEditando(null);
  };

  const abrirRegistroNuevo = () => {
    limpiarCampos();
    setMostrarRegistro(true);
  };

  const cerrarRegistro = () => {
    limpiarCampos();
    setMostrarRegistro(false);
  };

  const convertirFecha = (fecha) => {
    const [anio, mes, dia] = fecha.split('-').map(Number);
    return new Date(anio, mes - 1, dia).getTime();
  };

  const esFechaValida = (fecha) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return false;
    }

    const [anio, mes, dia] = fecha.split('-').map(Number);
    const fechaObj = new Date(anio, mes - 1, dia);

    return (
      fechaObj.getFullYear() === anio &&
      fechaObj.getMonth() === mes - 1 &&
      fechaObj.getDate() === dia
    );
  };

  const ordenarPiezas = (lista) => {
    return [...lista].sort(
      (a, b) => convertirFecha(b.fechaCambio) - convertirFecha(a.fechaCambio)
    );
  };

  const guardarPieza = () => {
    const tipoLimpio = tipo.trim();
    const marcaLimpia = marca.trim();
    const numeroSerieLimpio = numeroSerie.trim();
    const precioLimpio = precio.trim().replace(',', '.');
    const fechaLimpia = fechaCambio.trim();

    if (
      !tipoLimpio ||
      !marcaLimpia ||
      !numeroSerieLimpio ||
      !precioLimpio ||
      !fechaLimpia
    ) {
      Alert.alert('Campos obligatorios', 'Debe completar todos los campos.');
      return;
    }

    if (isNaN(precioLimpio)) {
      Alert.alert('Precio invalido', 'Ingrese un precio numerico valido.');
      return;
    }

    if (!esFechaValida(fechaLimpia)) {
      Alert.alert('Fecha invalida', 'Use una fecha valida con formato AAAA-MM-DD.');
      return;
    }

    const datosPieza = {
      tipo: tipoLimpio,
      marca: marcaLimpia,
      numeroSerie: numeroSerieLimpio,
      precio: Number(precioLimpio).toFixed(2),
      fechaCambio: fechaLimpia,
    };

    if (modoEdicion) {
      setPiezas((prevPiezas) =>
        ordenarPiezas(
          prevPiezas.map((pieza) =>
            pieza.id === idEditando ? { ...pieza, ...datosPieza } : pieza
          )
        )
      );

      if (piezaSeleccionada?.id === idEditando) {
        setPiezaSeleccionada((prev) => ({ ...prev, ...datosPieza }));
      }
    } else {
      const nuevaPieza = {
        id: Date.now().toString(),
        ...datosPieza,
      };

      setPiezas((prevPiezas) => ordenarPiezas([...prevPiezas, nuevaPieza]));
    }

    cerrarRegistro();
  };

  const eliminarPieza = (id) => {
    setPiezas((prevPiezas) => prevPiezas.filter((pieza) => pieza.id !== id));

    if (piezaSeleccionada?.id === id) {
      setPiezaSeleccionada(null);
      setMostrarDetalle(false);
    }
  };

  const abrirDetalle = (item) => {
    setPiezaSeleccionada(item);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setPiezaSeleccionada(null);
    setMostrarDetalle(false);
  };

  const editarPieza = (item) => {
    setTipo(item.tipo);
    setMarca(item.marca);
    setNumeroSerie(item.numeroSerie);
    setPrecio(String(item.precio));
    setFechaCambio(item.fechaCambio);
    setModoEdicion(true);
    setIdEditando(item.id);
    setMostrarRegistro(true);
  };

  const editarDesdeDetalle = () => {
    const pieza = piezaSeleccionada;
    cerrarDetalle();

    if (pieza) {
      editarPieza(pieza);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titulo}>Historial de piezas</Text>
      <Text style={styles.subtituloPantalla}>Control de cambios del vehiculo</Text>

      <TouchableOpacity style={styles.botonAgregar} onPress={abrirRegistroNuevo}>
        <Text style={styles.textoBotonPrincipal}>+ Agregar Pieza</Text>
      </TouchableOpacity>

      {piezas.length === 0 ? (
        <View style={styles.estadoVacio}>
          <Text style={styles.iconoVacio}>🔧</Text>
          <Text style={styles.textoVacio}>No hay piezas registradas</Text>
          <Text style={styles.textoVacioSecundario}>
            Toque "Agregar Pieza" para comenzar
          </Text>
        </View>
      ) : (
        <FlatList
          data={piezas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Pieza
              item={item}
              eliminarPieza={eliminarPieza}
              abrirModal={abrirDetalle}
              editarPieza={editarPieza}
            />
          )}
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={mostrarRegistro}
        transparent
        animationType="fade"
        onRequestClose={cerrarRegistro}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>
              {modoEdicion ? 'Editar pieza' : 'Nueva pieza'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.campo}>
                <Text style={styles.label}>Pieza</Text>
                <TextInput
                  style={styles.input}
                  value={tipo}
                  onChangeText={setTipo}
                  placeholder="Ej. Bujia"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>Marca</Text>
                <TextInput
                  style={styles.input}
                  value={marca}
                  onChangeText={setMarca}
                  placeholder="Ej. Bosch"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>No. Serie</Text>
                <TextInput
                  style={styles.input}
                  value={numeroSerie}
                  onChangeText={setNumeroSerie}
                  placeholder="Ej. 8013523"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>Precio</Text>
                <TextInput
                  style={styles.input}
                  value={precio}
                  onChangeText={setPrecio}
                  keyboardType="decimal-pad"
                  placeholder="Ej. 25.50"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              <View style={styles.campo}>
                <Text style={styles.label}>Fecha</Text>
                <TextInput
                  style={styles.input}
                  value={fechaCambio}
                  onChangeText={setFechaCambio}
                  placeholder="2023-09-29"
                  placeholderTextColor="#8E8E93"
                />
              </View>
            </ScrollView>

            <View style={styles.filaBotones}>
              <TouchableOpacity style={styles.botonSecundario} onPress={cerrarRegistro}>
                <Text style={styles.textoBotonSecundario}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botonPrimario} onPress={guardarPieza}>
                <Text style={styles.textoBotonPrimario}>
                  {modoEdicion ? 'Actualizar' : 'Guardar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={mostrarDetalle}
        transparent
        animationType="fade"
        onRequestClose={cerrarDetalle}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitulo}>Detalle de la pieza</Text>

            <View style={styles.tarjetaDetalle}>
              <View style={styles.filaDetalle}>
                <Text style={styles.etiquetaDetalle}>Pieza</Text>
                <Text style={styles.valorDetalle}>{piezaSeleccionada?.tipo}</Text>
              </View>

              <View style={styles.separador} />

              <View style={styles.filaDetalle}>
                <Text style={styles.etiquetaDetalle}>Marca</Text>
                <Text style={styles.valorDetalle}>{piezaSeleccionada?.marca}</Text>
              </View>

              <View style={styles.separador} />

              <View style={styles.filaDetalle}>
                <Text style={styles.etiquetaDetalle}>No. Serie</Text>
                <Text style={styles.valorDetalle}>{piezaSeleccionada?.numeroSerie}</Text>
              </View>

              <View style={styles.separador} />

              <View style={styles.filaDetalle}>
                <Text style={styles.etiquetaDetalle}>Precio</Text>
                <Text style={styles.valorDetalle}>${piezaSeleccionada?.precio}</Text>
              </View>

              <View style={styles.separador} />

              <View style={styles.filaDetalle}>
                <Text style={styles.etiquetaDetalle}>Fecha</Text>
                <Text style={styles.valorDetalle}>{piezaSeleccionada?.fechaCambio}</Text>
              </View>
            </View>

            <View style={styles.filaBotones}>
              <TouchableOpacity style={styles.botonSecundario} onPress={cerrarDetalle}>
                <Text style={styles.textoBotonSecundario}>Cerrar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.botonPrimario} onPress={editarDesdeDetalle}>
                <Text style={styles.textoBotonPrimario}>Editar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginTop: 8,
  },
  subtituloPantalla: {
    fontSize: 15,
    color: '#6E6E73',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 22,
  },
  botonAgregar: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 5,
  },
  textoBotonPrincipal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  estadoVacio: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginTop: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  iconoVacio: {
    fontSize: 32,
    marginBottom: 10,
  },
  textoVacio: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  textoVacioSecundario: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  lista: {
    paddingBottom: 24,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28,28,30,0.24)',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  modalTitulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    marginBottom: 20,
  },
  campo: {
    marginBottom: 14,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3A3A3C',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#1C1C1E',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  filaBotones: {
    flexDirection: 'row',
    marginTop: 18,
  },
  botonPrimario: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginLeft: 6,
  },
  botonSecundario: {
    flex: 1,
    backgroundColor: '#E9E9ED',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginRight: 6,
  },
  textoBotonPrimario: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  textoBotonSecundario: {
    color: '#1C1C1E',
    fontSize: 15,
    fontWeight: '600',
  },
  tarjetaDetalle: {
    backgroundColor: '#F2F2F7',
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  filaDetalle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  etiquetaDetalle: {
    fontSize: 15,
    color: '#6E6E73',
    fontWeight: '600',
  },
  valorDetalle: {
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '600',
  },
  separador: {
    height: 1,
    backgroundColor: '#D1D1D6',
  },
});