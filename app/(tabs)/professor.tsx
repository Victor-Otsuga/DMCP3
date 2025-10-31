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

export default function ProfessorScreen() {
  const [step, setStep] = useState(1);
  const [foto, setFoto] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [formacao, setFormacao] = useState("");
  const [instituicao, setInstituicao] = useState("");

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

  // Formata CPF automaticamente
  const handleCpfChange = (text: string) => {
    let cleaned = text.replace(/\D/g, "");
    if (cleaned.length > 11) cleaned = cleaned.slice(0, 11);

    let formatted = cleaned;
    if (cleaned.length > 9) {
      formatted = cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, "$1.$2.$3-$4");
    } else if (cleaned.length > 6) {
      formatted = cleaned.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cleaned.length > 3) {
      formatted = cleaned.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }

    setCpf(formatted);
  };

  // Formata telefone automaticamente
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

  const isValidCpf = (cpf: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone: string) =>
    /^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phone);

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!foto || !nome.trim() || !cpf.trim()) {
        showMessage({
          message: "Preencha todos os campos da etapa 1.",
          type: "danger",
          icon: "danger",
        });
        return false;
      }
      if (!isValidCpf(cpf)) {
        showMessage({
          message: "CPF inválido. Digite no formato xxx.xxx.xxx-xx",
          type: "danger",
          icon: "danger",
        });
        return false;
      }
    }
    if (step === 2) {
      if (!telefone.trim() || !email.trim()) {
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
    if (
      step === 3 &&
      (!disciplina.trim() || !formacao.trim() || !instituicao.trim())
    ) {
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
    if (step < 3) setStep(step + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    showMessage({
      message: "Cadastro de professor concluído!",
      type: "success",
      icon: "success",
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastro de Professor - Etapa {step}/3</Text>

        {/* ETAPA 1 - DADOS BÁSICOS */}
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

            <Text style={styles.label}>CPF:</Text>
            <TextInput
              style={styles.input}
              value={cpf}
              onChangeText={handleCpfChange}
              keyboardType="numeric"
              placeholder="000.000.000-00"
              placeholderTextColor="#999"
              maxLength={14}
            />
          </View>
        )}

        {/* ETAPA 2 - CONTATO */}
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
              placeholder="professor@email.com"
              placeholderTextColor="#999"
              autoCapitalize="none"
            />
          </View>
        )}

        {/* ETAPA 3 - INFORMAÇÕES PROFISSIONAIS */}
        {step === 3 && (
          <View>
            <Text style={styles.label}>Disciplina:</Text>
            <TextInput
              style={styles.input}
              value={disciplina}
              onChangeText={setDisciplina}
              placeholder="Ex: Matemática"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Formação:</Text>
            <TextInput
              style={styles.input}
              value={formacao}
              onChangeText={setFormacao}
              placeholder="Ex: Licenciatura em Física"
              placeholderTextColor="#999"
            />

            <Text style={styles.label}>Instituição:</Text>
            <TextInput
              style={styles.input}
              value={instituicao}
              onChangeText={setInstituicao}
              placeholder="Nome da instituição"
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
    backgroundColor: "#1565c0",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  backButton: { backgroundColor: "#aaa" },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
