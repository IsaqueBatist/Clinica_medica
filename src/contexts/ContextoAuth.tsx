import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Usuario {
  id: string;
  nome: string;
  email: string;
}

interface AuthContextData {
  isAuthenticated: boolean;
  usuario: Usuario | null;
  carregando: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export function ProvedorAuth({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarSessao() {
      try {
        const sessaoSalva = await AsyncStorage.getItem("@session");
        if (sessaoSalva) {
          setUsuario(JSON.parse(sessaoSalva));
        }
      } catch (error) {
        console.error("Erro ao recuperar sessão:", error);
      } finally {
        setCarregando(false);
      }
    }
    carregarSessao();
  }, []);

  async function login(email: string, senha: string) {
    // MOCK: Validação didática. NÃO é padrão para produção.
    if (email === "admin@admin.com" && senha === "admin123") {
      const mockUser = { id: "1", nome: "Administrador", email };
      setUsuario(mockUser);
      await AsyncStorage.setItem("@session", JSON.stringify(mockUser));
    } else {
      throw new Error("Credenciais inválidas. Use admin@admin.com e admin123.");
    }
  }

  async function logout() {
    setUsuario(null);
    await AsyncStorage.removeItem("@session");
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!usuario, usuario, carregando, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useContextoAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useContextoAuth deve ser usado dentro de um ProvedorAuth");
  }
  return context;
}
