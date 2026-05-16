import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "./firebaseConfig";

const db = getFirestore(app);

// 2. Criação de Cliente (Uso de setDoc pois o ID é a 'identificacao')
export async function criarCliente(identificacao: string, dadosCliente: any) {
  try {
    const docRef = doc(db, "clientes", identificacao);
    await setDoc(docRef, {
      ...dadosCliente,
      dataNascimento: dadosCliente.dataNascimento, // Recomendado converter para Timestamp se necessário
      status: "ativo",
      criadoEm: serverTimestamp(), // Sempre prefira serverTimestamp ao invés de new Date() local
    });
    console.log(`Cliente ${identificacao} salvo com sucesso.`);
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    throw error;
  }
}

// 3. Criação de Médico (Uso de setDoc pois o ID é a 'matricula')
export async function criarMedico(matricula: string, dadosMedico: any) {
  try {
    const docRef = doc(db, "medicos", matricula);
    await setDoc(docRef, {
      ...dadosMedico,
      status: "ativo",
      criadoEm: serverTimestamp(),
    });
    console.log(`Médico ${matricula} salvo com sucesso.`);
  } catch (error) {
    console.error("Erro ao salvar médico:", error);
    throw error;
  }
}

// 4. Criação de Consulta (Uso de addDoc pois o ID é auto-gerado)
export async function criarConsulta(dadosConsulta: any) {
  try {
    const consultasRef = collection(db, "consultas");
    const docRef = await addDoc(consultasRef, {
      ...dadosConsulta,
      situacao: "marcada", // Garante compliance com o firestore.rules para 'create'
      dataHora: serverTimestamp(),
    });

    // Como a especificação diz que 'numero' é um ID único gerado no cliente,
    // podemos atualizar o documento recém-criado com seu próprio ID
    await setDoc(docRef, { numero: docRef.id }, { merge: true });

    console.log(`Consulta criada com ID auto-gerado: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao criar consulta:", error);
    throw error;
  }
}
