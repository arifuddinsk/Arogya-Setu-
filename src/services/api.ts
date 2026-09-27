const rawApiUrl = (
  (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api'
).trim();

// Normalize URL: ensure no trailing slash, and ensure /api endpoint prefix
const cleanUrl = rawApiUrl.replace(/\/$/, '');
const API_BASE_URL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `HTTP ${response.status} from ${endpoint}`);
  }

  return response.json();
}

export const api = {
  // Authentication
  auth: {
    register: (userData: any) =>
      fetchJSON<{ success: boolean; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    login: (identifier: string, password?: string, role: string = 'patient') =>
      fetchJSON<{ success: boolean; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password, role }),
      }),
    getUsers: () => fetchJSON<{ users: any[] }>('/auth/users'),
  },

  // Doctors
  doctors: {
    getAll: (params?: { specialization?: string; location?: string; search?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchJSON<{ doctors: any[] }>(`/doctors?${query}`);
    },
    getById: (id: string) => fetchJSON<{ doctor: any }>(`/doctors/${id}`),
  },

  // Appointments
  appointments: {
    getAll: (params?: { patientId?: string; doctorId?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchJSON<{ appointments: any[] }>(`/appointments?${query}`);
    },
    book: (appointmentData: any) =>
      fetchJSON<{ success: boolean; appointment: any }>('/appointments', {
        method: 'POST',
        body: JSON.stringify(appointmentData),
      }),
    updateStatus: (id: string, status: string) =>
      fetchJSON<{ success: boolean; id: string; status: string }>(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },

  // Prescriptions
  prescriptions: {
    getAll: (params?: { patientId?: string }) => {
      const query = new URLSearchParams(params as any).toString();
      return fetchJSON<{ prescriptions: any[] }>(`/prescriptions?${query}`);
    },
    create: (prescriptionData: any) =>
      fetchJSON<{ success: boolean; prescription: any }>('/prescriptions', {
        method: 'POST',
        body: JSON.stringify(prescriptionData),
      }),
    toggleReminder: (id: string) =>
      fetchJSON<{ success: boolean; id: string; remindersActive: boolean }>(
        `/prescriptions/${id}/reminder`,
        { method: 'PATCH' }
      ),
  },

  // OCR Prescription Digitization
  ocr: {
    scan: (image: string) =>
      fetchJSON<{ success: boolean; extracted: any[] }>('/ocr/scan', {
        method: 'POST',
        body: JSON.stringify({ image }),
      }),
    save: (items: any[], userId?: string) =>
      fetchJSON<{ success: boolean; id: string; message: string }>('/ocr/save', {
        method: 'POST',
        body: JSON.stringify({ items, userId }),
      }),
    getByUserId: (userId: string) => fetchJSON<{ scans: any[] }>(`/ocr/${userId}`),
  },

  // Aarogya Setu AI Assistant
  ai: {
    chat: (query: string, patientName?: string) =>
      fetchJSON<{
        success: boolean;
        assistantName: string;
        reply: string;
        isUrgent: boolean;
        disclaimer: string;
        timestamp: string;
      }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ query, patientName }),
      }),
  },

  // Tele-Kiosks
  kiosks: {
    getAll: () => fetchJSON<{ kiosks: any[] }>('/kiosks'),
    sync: () =>
      fetchJSON<{ success: boolean; message: string; syncedAt: string }>('/kiosks/sync', {
        method: 'POST',
      }),
  },
};
