const API_BASE = import.meta.env.VITE_API_BASE || "https://csirip-backend.vercel.app/api";

async function parseJson(response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Request failed");
  }
  return response.json();
}

function adminHeaders(token) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  };
}

export async function getSiteData() {
  const response = await fetch(`${API_BASE}/site`);
  return parseJson(response);
}

export async function getLocalization() {
  const response = await fetch(`${API_BASE}/localization`);
  return parseJson(response);
}

export async function getBlogPosts(tag) {
  const url = new URL(`${API_BASE}/blog`);
  if (tag) {
    url.searchParams.set("tag", tag);
  }
  const response = await fetch(url);
  return parseJson(response);
}

export async function getBlogPost(slug) {
  const response = await fetch(`${API_BASE}/blog/${slug}`);
  return parseJson(response);
}

export async function getRelaxItems(tag) {
  const url = new URL(`${API_BASE}/relax`);
  if (tag) {
    url.searchParams.set("tag", tag);
  }
  const response = await fetch(url);
  return parseJson(response);
}

export async function getBookingConfig() {
  const response = await fetch(`${API_BASE}/booking/config`);
  return parseJson(response);
}

export async function getBookingCalendar() {
  const response = await fetch(`${API_BASE}/booking/calendar`);
  return parseJson(response);
}

export async function sendBookingRequest(payload) {
  const response = await fetch(`${API_BASE}/booking/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}

export async function adminLogin(username, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  return parseJson(response);
}

export async function getAdminMe(token) {
  const response = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return parseJson(response);
}

export async function getAdminLocalization(token) {
  const response = await fetch(`${API_BASE}/admin/localization`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return parseJson(response);
}

export async function upsertAdminLocalization(token, payload) {
  const response = await fetch(`${API_BASE}/admin/localization`, {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}

export async function getAdminOverview(token) {
  const response = await fetch(`${API_BASE}/admin/overview`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return parseJson(response);
}

export async function getAdminImages(token) {
  const response = await fetch(`${API_BASE}/admin/images`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return parseJson(response);
}

export async function uploadAdminImage(token, file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/admin/images`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  return parseJson(response);
}

export async function deleteAdminImage(token, path) {
  const response = await fetch(`${API_BASE}/admin/images`, {
    method: "DELETE",
    headers: adminHeaders(token),
    body: JSON.stringify({ path })
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Delete failed");
  }
}

export async function getAdminStats(token) {
  const response = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return parseJson(response);
}

export async function createAdminStat(token, payload) {
  const response = await fetch(`${API_BASE}/admin/stats`, {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}

export async function getBillingRecords(token) {
  const response = await fetch(`${API_BASE}/admin/billing`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return parseJson(response);
}

export async function createBillingRecord(token, payload) {
  const response = await fetch(`${API_BASE}/admin/billing`, {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}

export async function updateBillingStatus(token, billingId, status) {
  const response = await fetch(`${API_BASE}/admin/billing/${billingId}/status`, {
    method: "PATCH",
    headers: adminHeaders(token),
    body: JSON.stringify({ status })
  });
  return parseJson(response);
}

export async function updateBillingRecord(token, billingId, payload) {
  const response = await fetch(`${API_BASE}/admin/billing/${billingId}`, {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}

export async function deleteBillingRecord(token, billingId) {
  const response = await fetch(`${API_BASE}/admin/billing/${billingId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || "Delete failed");
  }
}

export async function updateTheme(token, payload) {
  const response = await fetch(`${API_BASE}/admin/theme`, {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}

export async function createBlogPost(token, payload) {
  const response = await fetch(`${API_BASE}/admin/blog`, {
    method: "POST",
    headers: adminHeaders(token),
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}

export async function updateSiteMeta(token, payload) {
  const response = await fetch(`${API_BASE}/admin/site`, {
    method: "PUT",
    headers: adminHeaders(token),
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}
