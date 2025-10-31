import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { showMessage } from "react-native-flash-message";

export default function AlunoScreen() {
  const [step, setStep] = useState<number>(1);
  const [foto, setFoto] = useState<string | null>(null);
  const [nome, setNome] = useState<string>("");
  const [rm, setRm] = useState<string>("");
  const [telefone, setTelefone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [endereco, setEndereco] = useState<string>("");
  const [turma, setTurma] = useState<string>("");
  const [estagio, setEstagio] = useState<string>("");

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFoto(result.assets[0].uri);
    }
  };

  // Formata telefone automaticamente (padrão brasileiro)
  const handleTelefoneChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);

    let formatted = cleaned;
    if (cleaned.length > 10) {
      formatted = cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (cleaned.length > 6) {
      formatted = cleaned.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else if (cleaned.length > 2) {
      formatted = cleaned.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else if (cleaned.length > 0) {
      formatted = cleaned.replace(/(\d{0,2})/, "($1");
    }

    setTelefone(formatted);
  };

  const isValidPhone = (phone: string) =>
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateStep = (): boolean => {
    if (step === 1 && (!foto || !nome.trim() || !rm.trim())) {
      showMessage({
        message: "Preencha todos os campos da etapa 1.",
        type: "danger",
        icon: "danger",
      });
      return false;
    }

    if (step === 2) {
      if (!telefone.trim() || !email.trim() || !endereco.trim()) {
        showMessage({
          message: "Preencha todos os campos da etapa 2.",
          type: "warning",
          icon: "warning",
        });
        return false;
      }
      if (!isValidPhone(telefone)) {
        showMessage({
          message: "Telefone inválido. Digite no formato (XX) XXXXX-XXXX",
          type: "danger",
          icon: "danger",
        });
        return false;
      }
      if (!isValidEmail(email)) {
        showMessage({
          message: "Email inválido.",
          type: "danger",
          icon: "danger",
        });
        return false;
      }
    }

    if (step === 3 && (!turma.trim() || !estagio.trim())) {
      showMessage({
        message: "Preencha todos os campos da etapa 3.",
        type: "danger",
        icon: "danger",
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 3) setStep((s) => s + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = () => {
    showMessage({
      message: "Cadastro realizado com sucesso!",
      type: "success",
      icon: "success",
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastro de Aluno - Etapa {step}/3</Text>

        {/* ETAPA 1 */}
        {step === 1 && (
          <View>
            <TouchableOpacity onPress={handlePickImage} style={styles.photoWrap}>
              {foto ? (
                <Image source={{ uri: foto }} style={styles.photo} />
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Text style={styles.photoPlaceholderText}>Adicionar Foto</Text>
                </View>
              )}
            </TouchableOpacity>

            <Text style={styles.label}>Nome completo:</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite o nome"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>RM:</Text>
            <TextInput
              style={styles.input}
              value={rm}
              onChangeText={setRm}
              keyboardType="numeric"
              placeholder="Ex: 123456"
              placeholderTextColor="#999"
            />
          </View>
        )}

        {/* ETAPA 2 */}
        {step === 2 && (
          <View>
            <Text style={styles.label}>Telefone:</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={handleTelefoneChange}
              keyboardType="phone-pad"
              placeholder="(11) 99999-9999"
              placeholderTextColor="#999"
              maxLength={15}
            />

            <Text style={styles.label}>Email:</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholder="exemplo@email.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Endereço:</Text>
            <TextInput
              style={styles.input}
              value={endereco}
              onChangeText={setEndereco}
              placeholder="Rua, número, bairro..."
              placeholderTextColor="#999"
            />
          </View>
        )}

        {/* ETAPA 3 */}
        {step === 3 && (
          <View>
            <Text style={styles.label}>Turma:</Text>
            <TextInput
              style={styles.input}
              value={turma}
              onChangeText={setTurma}
              placeholder="Ex: 3ºA"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Estágio:</Text>
            <TextInput
              style={styles.input}
              value={estagio}
              onChangeText={setEstagio}
              placeholder="Empresa ou área do estágio"
              placeholderTextColor="#999"
            />
          </View>
        )}

        {/* BOTÕES */}
        <View style={styles.buttonsRow}>
          {step > 1 && (
            <TouchableOpacity
              onPress={handlePrev}
              style={[styles.button, styles.backButton]}
            >
              <Text style={styles.buttonText}>Voltar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={handleNext} style={styles.button}>
            <Text style={styles.buttonText}>
              {step === 3 ? "Cadastrar" : "Próximo"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 15, color: "#111" },
  photoWrap: { alignItems: "center", marginBottom: 20 },
  photo: { width: 120, height: 120, borderRadius: 60 },
  photoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#eee",
    alignItems: "center",
    justifyContent: "center",
  },
  photoPlaceholderText: { color: "#666" },
  label: { marginTop: 6, marginBottom: 4, color: "#222", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 8,
    fontSize: 16,
    color: "#111",
  },
  buttonsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  button: {
    backgroundColor: "#d81b60",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  backButton: { backgroundColor: "#aaa" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
