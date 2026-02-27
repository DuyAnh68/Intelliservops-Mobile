import type { components } from "@/src/api/api-intelliservops-service";
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";

// Lazy load auth store to avoid circular dependency
let _authStore:
  | typeof import("@/src/stores/Auth/AuthStore").useAuthStore
  | null = null;

const getAuthStore =
  (): typeof import("@/src/stores/Auth/AuthStore").useAuthStore => {
    if (!_authStore) {
      // Dynamic require to break circular dependency at module load time
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const module = require("@/src/stores/Auth/AuthStore");
      _authStore = module.useAuthStore;
    }
    return _authStore!;
  };

// ─── Config ─────────────────────────────────────────────────────────
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// ─── Types ──────────────────────────────────────────────────────────
export type LoginDto = components["schemas"]["LoginDto"];
export type AuthResponseDto = components["schemas"]["AuthResponseDto"];
export type AuthUserDto = components["schemas"]["AuthUserDto"];
export type TokenPairDto = components["schemas"]["TokenPairDto"];
export type RefreshTokenDto = components["schemas"]["RefreshTokenDto"];

/** Standard API response wrapper */
interface ApiResponse<T> {
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: {
    timestamp?: string;
  };
}

interface RetryConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

// ─── Axios Instance ─────────────────────────────────────────────────
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Refresh Token Lock ─────────────────────────────────────────────
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((cb) => {
    try {
      cb(token);
    } catch (err) {
      console.error("Error in refresh subscriber:", err);
    }
  });
  refreshSubscribers = [];
  isRefreshing = false;
};

const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
  refreshSubscribers.push(cb);
};

// ─── Request Interceptor ───────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthStore().getState().getAccessToken();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response Interceptor ──────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError & { config?: RetryConfig }) => {
    const status = error.response?.status;
    const originalRequest = error.config!;

    // 401 → try refresh token
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token) => {
            if (token) {
              originalRequest.headers.set("Authorization", `Bearer ${token}`);
              resolve(axiosInstance(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        // Use store.refreshToken() which handles everything
        await getAuthStore().getState().refreshToken();
        const newToken = getAuthStore().getState().getAccessToken();

        if (newToken) {
          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);

          onRefreshed(newToken);
          return axiosInstance(originalRequest);
        } else {
          onRefreshed(null);
          await getAuthStore().getState().logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        onRefreshed(null);
        await getAuthStore().getState().logout();
        return Promise.reject(error);
      }
    }

    // 403 → forbidden, try refresh before logout
    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await getAuthStore().getState().refreshToken();
        const newToken = getAuthStore().getState().getAccessToken();
        if (newToken) {
          originalRequest.headers.set("Authorization", `Bearer ${newToken}`);
          return axiosInstance(originalRequest);
        }
      } catch {
        await getAuthStore().getState().logout();
      }
    }

    return Promise.reject(error);
  },
);

// ─── API Methods ────────────────────────────────────────────────────

// Auth
const authApi = {
  login: (data: LoginDto) =>
    axiosInstance.post<ApiResponse<AuthResponseDto>>(
      "/api/v1/auth/login",
      data,
    ),

  refresh: (data: RefreshTokenDto) =>
    axiosInstance.post<ApiResponse<TokenPairDto>>("/api/v1/auth/refresh", data),

  logout: (data: RefreshTokenDto) =>
    axiosInstance.post("/api/v1/auth/logout", data),

  submitGuestInfo: (data: components["schemas"]["SubmitGuestInfoDto"]) =>
    axiosInstance.post<
      ApiResponse<components["schemas"]["SubmitGuestResponseDto"]>
    >("/api/v1/auth/guest/submit-info", data),

  requestOtp: (data: components["schemas"]["RequestOtpDto"]) =>
    axiosInstance.post<ApiResponse<components["schemas"]["OtpResponseDto"]>>(
      "/api/v1/auth/guest/request-otp",
      data,
    ),

  verifyOtp: (data: components["schemas"]["VerifyOtpDto"]) =>
    axiosInstance.post<ApiResponse<AuthResponseDto>>(
      "/api/v1/auth/guest/verify-otp",
      data,
    ),

  resendOtp: (data: components["schemas"]["ResendOtpDto"]) =>
    axiosInstance.post<ApiResponse<components["schemas"]["OtpResponseDto"]>>(
      "/api/v1/auth/guest/resend-otp",
      data,
    ),
};

// Users
const usersApi = {
  getProfile: () =>
    axiosInstance.get<ApiResponse<components["schemas"]["UserProfileDto"]>>(
      "/api/v1/users/profile",
    ),

  findAll: (params?: { page?: number; limit?: number }) =>
    axiosInstance.get("/api/v1/users", { params }),

  findOne: (id: string) => axiosInstance.get(`/api/v1/users/${id}`),

  update: (id: string, data: components["schemas"]["UpdateUserDto"]) =>
    axiosInstance.patch(`/api/v1/users/${id}`, data),

  remove: (id: string) => axiosInstance.delete(`/api/v1/users/${id}`),
};

// Apartments
const apartmentsApi = {
  search: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/apartments/search", { params }),

  findOne: (id: string) => axiosInstance.get(`/api/v1/apartments/${id}`),

  create: (data: components["schemas"]["CreateApartmentDto"]) =>
    axiosInstance.post("/api/v1/apartments", data),

  update: (id: string, data: components["schemas"]["UpdateApartmentDto"]) =>
    axiosInstance.patch(`/api/v1/apartments/${id}`, data),

  remove: (id: string) => axiosInstance.delete(`/api/v1/apartments/${id}`),

  findByPartner: (partnerId: string) =>
    axiosInstance.get(`/api/v1/apartments/partner/${partnerId}`),

  approve: (id: string) =>
    axiosInstance.patch(`/api/v1/apartments/${id}/approve`),
};

// Contracts
const contractsApi = {
  findAll: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/contracts", { params }),

  findOne: (id: string) => axiosInstance.get(`/api/v1/contracts/${id}`),

  create: (data: components["schemas"]["CreateContractDto"]) =>
    axiosInstance.post("/api/v1/contracts", data),

  update: (id: string, data: components["schemas"]["UpdateContractDto"]) =>
    axiosInstance.patch(`/api/v1/contracts/${id}`, data),

  activate: (id: string) =>
    axiosInstance.patch(`/api/v1/contracts/${id}/activate`),

  terminate: (id: string) =>
    axiosInstance.patch(`/api/v1/contracts/${id}/terminate`),
};

// Invoices
const invoicesApi = {
  findAll: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/invoices", { params }),

  findOne: (id: string) => axiosInstance.get(`/api/v1/invoices/${id}`),

  create: (data: components["schemas"]["CreateInvoiceDto"]) =>
    axiosInstance.post("/api/v1/invoices", data),

  update: (id: string, data: components["schemas"]["UpdateInvoiceDto"]) =>
    axiosInstance.patch(`/api/v1/invoices/${id}`, data),
};

// Payments
const paymentsApi = {
  findAll: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/payments", { params }),

  findOne: (id: string) => axiosInstance.get(`/api/v1/payments/${id}`),

  create: (data: components["schemas"]["CreatePaymentDto"]) =>
    axiosInstance.post("/api/v1/payments", data),

  confirm: (id: string) => axiosInstance.post(`/api/v1/payments/${id}/confirm`),
};

// Maintenance
const maintenanceApi = {
  findAll: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/maintenance", { params }),

  findOne: (id: string) => axiosInstance.get(`/api/v1/maintenance/${id}`),

  create: (data: components["schemas"]["CreateMaintenanceDto"]) =>
    axiosInstance.post("/api/v1/maintenance", data),

  update: (id: string, data: components["schemas"]["UpdateMaintenanceDto"]) =>
    axiosInstance.patch(`/api/v1/maintenance/${id}`, data),

  complete: (id: string) =>
    axiosInstance.patch(`/api/v1/maintenance/${id}/complete`),
};

// Tickets
const ticketsApi = {
  findAll: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/tickets", { params }),

  findOne: (id: string) => axiosInstance.get(`/api/v1/tickets/${id}`),

  create: (data: components["schemas"]["CreateTicketDto"]) =>
    axiosInstance.post("/api/v1/tickets", data),

  update: (id: string, data: components["schemas"]["UpdateTicketDto"]) =>
    axiosInstance.patch(`/api/v1/tickets/${id}`, data),

  assign: (id: string, data: components["schemas"]["AssignTicketDto"]) =>
    axiosInstance.patch(`/api/v1/tickets/${id}/assign`, data),

  resolve: (id: string) => axiosInstance.patch(`/api/v1/tickets/${id}/resolve`),

  close: (id: string) => axiosInstance.patch(`/api/v1/tickets/${id}/close`),
};

// IoT
const iotApi = {
  findAllDevices: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/iot/devices", { params }),

  findOneDevice: (id: string) => axiosInstance.get(`/api/v1/iot/devices/${id}`),

  createDevice: (data: components["schemas"]["CreateDeviceDto"]) =>
    axiosInstance.post("/api/v1/iot/devices", data),

  updateDevice: (id: string, data: components["schemas"]["UpdateDeviceDto"]) =>
    axiosInstance.patch(`/api/v1/iot/devices/${id}`, data),

  removeDevice: (id: string) =>
    axiosInstance.delete(`/api/v1/iot/devices/${id}`),

  findDevicesByApartment: (apartmentId: string) =>
    axiosInstance.get(`/api/v1/iot/apartments/${apartmentId}/devices`),

  controlDevice: (
    id: string,
    data: components["schemas"]["ControlDeviceDto"],
  ) => axiosInstance.post(`/api/v1/iot/devices/${id}/control`, data),

  // Meters
  findAllMeters: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/iot/meters", { params }),

  findOneMeter: (id: string) => axiosInstance.get(`/api/v1/iot/meters/${id}`),

  createMeter: (data: components["schemas"]["CreateMeterDto"]) =>
    axiosInstance.post("/api/v1/iot/meters", data),

  updateMeter: (id: string, data: components["schemas"]["UpdateMeterDto"]) =>
    axiosInstance.patch(`/api/v1/iot/meters/${id}`, data),

  // Readings
  createReading: (data: components["schemas"]["CreateReadingDto"]) =>
    axiosInstance.post("/api/v1/iot/readings", data),

  getReadings: (meterId: string, params?: Record<string, unknown>) =>
    axiosInstance.get(`/api/v1/iot/meters/${meterId}/readings`, { params }),

  verifyReading: (id: string) =>
    axiosInstance.patch(`/api/v1/iot/readings/${id}/verify`),
};

// Tasks
const tasksApi = {
  findAll: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/tasks", { params }),

  findOne: (id: string) => axiosInstance.get(`/api/v1/tasks/${id}`),

  create: (data: components["schemas"]["CreateTaskDto"]) =>
    axiosInstance.post("/api/v1/tasks", data),

  update: (id: string, data: components["schemas"]["UpdateTaskDto"]) =>
    axiosInstance.patch(`/api/v1/tasks/${id}`, data),

  assign: (id: string, data: components["schemas"]["AssignTaskDto"]) =>
    axiosInstance.patch(`/api/v1/tasks/${id}/assign`, data),

  start: (id: string) => axiosInstance.patch(`/api/v1/tasks/${id}/start`),

  complete: (id: string) => axiosInstance.patch(`/api/v1/tasks/${id}/complete`),

  cancel: (id: string) => axiosInstance.patch(`/api/v1/tasks/${id}/cancel`),
};

// Notifications
const notificationsApi = {
  findMy: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/notifications/my", { params }),

  countUnread: () => axiosInstance.get("/api/v1/notifications/unread-count"),

  create: (data: components["schemas"]["CreateNotificationDto"]) =>
    axiosInstance.post("/api/v1/notifications", data),

  markAsRead: (id: string) =>
    axiosInstance.patch(`/api/v1/notifications/${id}/read`),

  markAllAsRead: () => axiosInstance.patch("/api/v1/notifications/read-all"),
};

// Partners
const partnersApi = {
  findAll: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/partners", { params }),

  getMyProfile: () => axiosInstance.get("/api/v1/partners/profile"),

  findOne: (id: string) => axiosInstance.get(`/api/v1/partners/${id}`),

  // Partner Requests
  findAllRequests: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/partners/requests/all", { params }),

  findMyRequests: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/partners/requests/my", { params }),

  findOneRequest: (id: string) =>
    axiosInstance.get(`/api/v1/partners/requests/${id}`),

  createRequest: (data: components["schemas"]["CreatePartnerRequestDto"]) =>
    axiosInstance.post("/api/v1/partners/requests", data),

  updateRequest: (
    id: string,
    data: components["schemas"]["UpdatePartnerRequestDto"],
  ) => axiosInstance.patch(`/api/v1/partners/requests/${id}`, data),

  reviewRequest: (
    id: string,
    data: components["schemas"]["ReviewPartnerRequestDto"],
  ) => axiosInstance.patch(`/api/v1/partners/requests/${id}/review`, data),
};

// Viewing Requests
const viewingRequestsApi = {
  create: (data: components["schemas"]["CreateViewingRequestDto"]) =>
    axiosInstance.post("/api/v1/viewing-requests", data),

  getMyAssigned: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/viewing-requests/my-assigned", { params }),

  createAppointment: (
    contactRequestId: string,
    data: components["schemas"]["CreateAppointmentDto"],
  ) =>
    axiosInstance.post(
      `/api/v1/viewing-requests/${contactRequestId}/appointments`,
      data,
    ),

  getApartmentAppointments: (
    apartmentId: string,
    params?: Record<string, unknown>,
  ) =>
    axiosInstance.get(
      `/api/v1/viewing-requests/apartments/${apartmentId}/appointments`,
      { params },
    ),
};

// Policies
const policiesApi = {
  findAll: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/policies", { params }),

  findPublic: () => axiosInstance.get("/api/v1/policies/public"),

  findOne: (id: string) => axiosInstance.get(`/api/v1/policies/${id}`),

  create: (data: components["schemas"]["CreatePolicyDto"]) =>
    axiosInstance.post("/api/v1/policies", data),

  update: (id: string, data: components["schemas"]["UpdatePolicyDto"]) =>
    axiosInstance.patch(`/api/v1/policies/${id}`, data),

  approve: (id: string) =>
    axiosInstance.patch(`/api/v1/policies/${id}/approve`),

  // Legal Documents
  findAllDocuments: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/policies/legal-documents/all", { params }),

  findPublicDocuments: () =>
    axiosInstance.get("/api/v1/policies/legal-documents/public"),

  findOneDocument: (id: string) =>
    axiosInstance.get(`/api/v1/policies/legal-documents/${id}`),

  createDocument: (data: components["schemas"]["CreateLegalDocumentDto"]) =>
    axiosInstance.post("/api/v1/policies/legal-documents", data),

  updateDocument: (
    id: string,
    data: components["schemas"]["UpdateLegalDocumentDto"],
  ) => axiosInstance.patch(`/api/v1/policies/legal-documents/${id}`, data),
};

// Activity Logs
const activityLogsApi = {
  findAll: (params?: Record<string, unknown>) =>
    axiosInstance.get("/api/v1/activity-logs", { params }),
};

// ─── Export ─────────────────────────────────────────────────────────
const apiClient = {
  auth: authApi,
  users: usersApi,
  apartments: apartmentsApi,
  contracts: contractsApi,
  invoices: invoicesApi,
  payments: paymentsApi,
  maintenance: maintenanceApi,
  tickets: ticketsApi,
  iot: iotApi,
  tasks: tasksApi,
  notifications: notificationsApi,
  partners: partnersApi,
  viewingRequests: viewingRequestsApi,
  policies: policiesApi,
  activityLogs: activityLogsApi,
};

export { axiosInstance };
export default apiClient;
