const BASE_URL = 'https://africonnect-b-6f9e.onrender.com';

export function getAuthToken() {
  return localStorage.getItem('access_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('access_token', token);
  } else {
    localStorage.removeItem('access_token');
  }
}

async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errorData = await response.json();
      errorMsg = Array.isArray(errorData.detail)
        ? errorData.detail.map(e => e.msg).join(', ')
        : errorData.detail || errorMsg;
    } catch (e) { }
    throw new Error(errorMsg);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return await response.json();
  }
  return null;
}

export const API = {
  public: {
    getLandingFeed: () => fetchAPI('/api/v1/feed', { method: 'GET' }),
  },
  auth: {
    signupFounder: (data) => fetchAPI('/api/v1/auth/signup-founder', { method: 'POST', body: JSON.stringify(data) }),
    signupInvestor: (data) => fetchAPI('/api/v1/auth/signup-investor', { method: 'POST', body: JSON.stringify(data) }),
    login: (email, password) => {
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);
      return fetchAPI('/api/v1/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
      });
    },
    me: () => fetchAPI('/api/v1/auth/me', { method: 'GET' }),
    logout: () => fetchAPI('/api/v1/auth/logout', { method: 'POST' }),
  },
  founder: {
    getFeed: () => fetchAPI('/api/v1/founder/feed'),
    getTraction: () => fetchAPI('/api/v1/founder/traction'),
    getProfile: () => fetchAPI('/api/v1/founder/profile'),
    updateProfile: (data) => fetchAPI('/api/v1/founder/profile', { method: 'PUT', body: JSON.stringify(data) })
  },
  investor: {
    discover: (sector, stage) => {
      let url = '/api/v1/investors/discover';
      const params = new URLSearchParams();
      if (sector && sector !== 'All') params.append('sector', sector);
      if (stage && stage !== 'All Stages') params.append('stage', stage);
      const qs = params.toString();
      return fetchAPI(qs ? `${url}?${qs}` : url);
    },
    getSaved: () => fetchAPI('/api/v1/investors/saved'),
    saveFounder: (startupId) => fetchAPI(`/api/v1/investors/saved/${startupId}`, { method: 'POST' }),
    removeFounder: (startupId) => fetchAPI(`/api/v1/investors/saved/${startupId}`, { method: 'DELETE' }),
    updateNote: (startupId, note) => fetchAPI(`/api/v1/investors/saved/${startupId}/note`, {
      method: 'PUT', body: JSON.stringify({ note })
    }),
    getProfile: () => fetchAPI('/api/v1/investors/profile'),
    updateProfile: (data) => fetchAPI('/api/v1/investors/profile', { method: 'PUT', body: JSON.stringify(data) })
  },
  partnerships: {
    requestDeck: (startupId, note) => fetchAPI('/api/v1/partnerships/request-deck', {
      method: 'POST', body: JSON.stringify({ startup_id: startupId, note })
    }),
    initiate: (startupId, note) => fetchAPI('/api/v1/partnerships/initiate', {
      method: 'POST', body: JSON.stringify({ startup_id: startupId, note })
    }),
    getAll: () => fetchAPI('/api/v1/partnerships'),
    accept: (partnershipId, responseNote) => fetchAPI(`/api/v1/partnerships/${partnershipId}/accept`, {
      method: 'POST', body: JSON.stringify({ response_note: responseNote || null })
    }),
    decline: (partnershipId) => fetchAPI(`/api/v1/partnerships/${partnershipId}/decline`, {
      method: 'POST'
    }),
    sendMessage: (partnershipId, content) => fetchAPI(`/api/v1/partnerships/${partnershipId}/message`, {
      method: 'POST', body: JSON.stringify({ content })
    })
  }
};
