import type { components } from "@/src/api/api-intelliservops-service";
import apiClient from "@/src/hooks/apiClient";
import { create } from "zustand";

// ─── Types ──────────────────────────────────────────────────────────
type AuthUser = components["schemas"]["AuthUserDto"];
type TokenPair = components["schemas"]["TokenPairDto"];
type LoginDto = components["schemas"]["LoginDto"];

export interface AuthState {
  // State
  token: string | null;
  refreshTokenValue: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;

  // Actions
  login: (
    email: string,
    password: string,
    actorType?: LoginDto["actorType"],
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setAuth: (user: AuthUser, tokens: TokenPair) => void;
  setTokens: (tokens: TokenPair) => void;
  reset: () => void;
}

// ─── Store ──────────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()((set, get) => ({
  token: null,
  refreshTokenValue: null,
  user: null,
  isAuthenticated: false,

  // ── Reset ─────────────────────────────────────────────────
  reset: () => {
    set({
      token: null,
      refreshTokenValue: null,
      user: null,
      isAuthenticated: false,
    });
  },

  // ── Login ─────────────────────────────────────────────────
  login: async (email, password) => {
    try {
      console.log("[AuthStore] Attempting login for:", email);

      const response = await apiClient.auth.login({
        identifier: email,
        password,
        actorType: "user",
      } as any);

      console.log(response);

      console.log("[AuthStore] Login response:", response.status);

      const authData = response.data.data;
      if (!authData) {
        console.error("[AuthStore] login: no data in response");
        return false;
      }

      const { user, tokens } = authData;
      const token = tokens.accessToken;
      const refreshToken = tokens.refreshToken;

      if (!token || typeof token !== "string" || token.trim() === "") {
        console.error("[AuthStore] login: invalid token received");
        return false;
      }

      console.log(
        "[AuthStore] login success, user:",
        user.email,
        "role:",
        user.role,
      );

      set({
        token,
        refreshTokenValue: refreshToken,
        user,
        isAuthenticated: true,
      });

      return true;
    } catch (error: any) {
      console.error(
        "[AuthStore] login failed:",
        error.response?.data?.message || error.message,
      );
      return false;
    }
  },

  // ── Logout ────────────────────────────────────────────────
  logout: async () => {
    console.log("[AuthStore] logout called");
    try {
      const refreshToken = get().refreshTokenValue;
      if (refreshToken) {
        await apiClient.auth.logout({ refreshToken });
      }
    } catch (error) {
      console.warn("[AuthStore] logout API error:", error);
    }

    set({
      token: null,
      refreshTokenValue: null,
      user: null,
      isAuthenticated: false,
    });
  },

  // ── Helpers ───────────────────────────────────────────────
  setAuth: (user, tokens) => {
    set({
      user,
      token: tokens.accessToken,
      refreshTokenValue: tokens.refreshToken,
      isAuthenticated: true,
    });
  },

  setTokens: (tokens) => {
    set({
      token: tokens.accessToken,
      refreshTokenValue: tokens.refreshToken,
    });
  },

  getAccessToken: () => get().token,
  getRefreshToken: () => get().refreshTokenValue,
}));

// Placeholder export for compatibility
export const rehydrateAuthStore = async (): Promise<void> => {
  // No-op since we removed persistence
};
