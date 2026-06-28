const API_BASE = "/api";

// ─── Auth helpers ─────────────────────────────────────────────────────────────
export function getAdminToken(): string | null {
  return localStorage.getItem("cj_admin_token");
}

export function setAdminToken(token: string) {
  localStorage.setItem("cj_admin_token", token);
}

export function clearAdminToken() {
  localStorage.removeItem("cj_admin_token");
  localStorage.removeItem("cj_admin_user");
}

// Bug 8 Fix: decode the JWT payload client-side and check the `exp` field
// so that an expired token is treated as "not authenticated" immediately,
// instead of waiting for the first 401 API response.
// We do NOT verify the signature here (that is the server's job); we only
// use the decoded payload to avoid showing the admin UI when the session is
// obviously stale.
function parseJwtExpiry(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  const token = getAdminToken();
  if (!token) return false;

  const exp = parseJwtExpiry(token);
  if (exp === null) {
    // Can't read expiry — treat as invalid and clear it
    clearAdminToken();
    return false;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  if (exp <= nowSeconds) {
    // Token has expired — clear it so the user is forced to log in again
    clearAdminToken();
    return false;
  }

  return true;
}

// ─── Base fetch ───────────────────────────────────────────────────────────────
async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  isAdmin = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  };

  if (isAdmin) {
    const token = getAdminToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  // If the server tells us the token is invalid/expired, clear it immediately
  // so the AdminGuard redirects to /admin/login on the next render.
  if (res.status === 401 && isAdmin) {
    clearAdminToken();
  }

  if (!res.ok) throw new Error(data.error || "API request failed");
  return data as T;
}

// ─── Products ─────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (category?: string) =>
    apiFetch<ApiProduct[]>(
      `/products${category ? `?category=${category}` : ""}`
    ),
  getById: (id: string) => apiFetch<ApiProduct>(`/products/${id}`),
  getAllAdmin: () =>
    apiFetch<ApiProduct[]>("/products/admin/all", {}, true),
  create: (formData: FormData) =>
    apiFetch<ApiProduct>(
      "/products/admin/create",
      { method: "POST", body: formData },
      true
    ),
  update: (id: string, formData: FormData) =>
    apiFetch<ApiProduct>(
      `/products/admin/${id}`,
      { method: "PUT", body: formData },
      true
    ),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(
      `/products/admin/${id}`,
      { method: "DELETE" },
      true
    ),
};

// ─── Orders ───────────────────────────────────────────────────────────────────
export const ordersApi = {
  place: (data: PlaceOrderPayload) =>
    apiFetch<{ success: boolean; order: ApiOrder }>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: (params?: {
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const q = new URLSearchParams();
    if (params?.status && params.status !== "all") q.set("status", params.status);
    if (params?.search) q.set("search", params.search);
    if (params?.limit) q.set("limit", String(params.limit));
    if (params?.offset) q.set("offset", String(params.offset));
    return apiFetch<{ orders: ApiOrder[]; total: number }>(
      `/orders/admin?${q.toString()}`,
      {},
      true
    );
  },
  getById: (id: string) =>
    apiFetch<ApiOrder>(`/orders/admin/${id}`, {}, true),
  updateStatus: (id: string, status: string) =>
    apiFetch<ApiOrder>(
      `/orders/admin/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) },
      true
    ),
};

// ─── Contact ──────────────────────────────────────────────────────────────────
export const contactApi = {
  submit: (data: {
    fullName: string;
    phone: string;
    email?: string;
    subject: string;
    message: string;
  }) =>
    apiFetch<{ success: boolean; message: string }>("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: (params?: { unread?: boolean; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.unread) q.set("unread", "true");
    if (params?.search) q.set("search", params.search);
    return apiFetch<{ messages: ApiMessage[]; unreadCount: number }>(
      `/contact/admin?${q.toString()}`,
      {},
      true
    );
  },
  markRead: (id: string) =>
    apiFetch<{ success: boolean }>(
      `/contact/admin/${id}/read`,
      { method: "PATCH" },
      true
    ),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(
      `/contact/admin/${id}`,
      { method: "DELETE" },
      true
    ),
};

// ─── Warranty ─────────────────────────────────────────────────────────────────
export const warrantyApi = {
  submit: (formData: FormData) =>
    apiFetch<{ success: boolean; claim: ApiWarrantyClaim }>("/warranty", {
      method: "POST",
      body: formData,
    }),
  getAll: (params?: { status?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.status && params.status !== "all") q.set("status", params.status);
    if (params?.search) q.set("search", params.search);
    return apiFetch<{ claims: ApiWarrantyClaim[] }>(
      `/warranty/admin?${q.toString()}`,
      {},
      true
    );
  },
  updateStatus: (id: string, status: string, adminNotes?: string) =>
    apiFetch<ApiWarrantyClaim>(
      `/warranty/admin/${id}/status`,
      { method: "PATCH", body: JSON.stringify({ status, adminNotes }) },
      true
    ),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(
      `/warranty/admin/${id}`,
      { method: "DELETE" },
      true
    ),
};

// ─── Admin ────────────────────────────────────────────────────────────────────
export const adminApi = {
  login: (username: string, password: string) =>
    apiFetch<{
      success: boolean;
      token: string;
      admin: { id: string; username: string };
    }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  getStats: () => apiFetch<AdminStats>("/admin/stats", {}, true),
  changePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<{ success: boolean; message: string }>("/admin/change-password", {
      method: "POST",
      body: JSON.stringify({ currentPassword, newPassword }),
    }, true),
};

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ApiProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number | null;
  description: string;
  features: string[];
  image: string;
  badge: string | null;
  inStock: boolean;
  createdAt: string;
}

export interface PlaceOrderPayload {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  postalCode?: string;
  notes?: string;
  items: Array<{
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }>;
}

export interface ApiOrder {
  id: string;
  orderNumber: string;
  customer: { fullName: string; phone: string; email: string | null };
  shipping: {
    address: string;
    city: string;
    postalCode: string | null;
    notes: string | null;
  };
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  pricing: { subtotal: number; shipping: number; grandTotal: number };
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiMessage {
  id: string;
  fullName: string;
  phone: string;
  email: string | null;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ApiWarrantyClaim {
  id: string;
  claimNumber: string;
  customer: {
    fullName: string;
    phone: string;
    email: string | null;
    orderNumber: string | null;
  };
  product: { name: string; category: string; purchaseDate: string };
  issueDesc: string;
  imagePath: string | null;
  status: "open" | "under_review" | "approved" | "rejected" | "resolved";
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  orders: {
    total: number;
    pending: number;
    confirmed: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    byStatus: Array<{ status: string; count: number }>;
  };
  revenue: {
    total: number;
    byDay: Array<{ date: string; orders: number; revenue: number }>;
  };
  messages: { total: number; unread: number };
  warranty: { total: number; open: number };
  // Bug 9 Fix: type now includes both in-stock count and the full total
  products: { total: number; totalIncludingOutOfStock: number };
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    city: string;
    grandTotal: number;
    status: string;
    createdAt: string;
  }>;
  topProducts: Array<{
    product_name: string;
    totalSold: number;
    totalRevenue: number;
  }>;
}
