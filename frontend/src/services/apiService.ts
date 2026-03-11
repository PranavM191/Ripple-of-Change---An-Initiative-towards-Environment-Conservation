// Base URL for our backend
const API_BASE_URL = "http://localhost:8081";

// --- Helper to manage Token & User in LocalStorage ---

export const setAuthToken = (token: string) => {
    localStorage.setItem('token', token);
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const clearAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName'); // Clear name on logout
};

export const setCurrentUser = (email: string, name: string) => {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name); // Save name on login
}

export const getCurrentUser = () => {
    return localStorage.getItem('userEmail');
};

export const getCurrentUserName = () => {
    return localStorage.getItem('userName');
};

/**
 * A helper function to make authenticated requests to our API.
 */
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        ...options.headers,
    });

    // Get the token directly from LocalStorage
    const token = getAuthToken();

    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers: headers,
    });

    if (!response.ok) {
        // If 401/403, the token might be invalid/expired
        if (response.status === 401 || response.status === 403) {
            console.warn("Token invalid or expired.");
            // Optional: You could auto-logout here if you wanted
        }
        const errorText = await response.text();
        throw new Error(errorText || `API request failed: ${response.statusText}`);
    }

    // Only parse JSON if there is content
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json();
    }
    return null;
};

// --- API Functions ---

export const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
        throw new Error("Login failed");
    }

    const data = await response.json();
    
    if (data.token) {
        setAuthToken(data.token);
        // Save both Email and Full Name
        setCurrentUser(data.email, data.fullName);
    }
    
    return data;
};

// --- Hotspots (Map) ---
export const getHotspots = async () => {
    return fetchWithAuth("/api/hotspots", { method: 'GET' });
};

export const createHotspot = async (formData: FormData) => {
    const headers = new Headers();
    const token = getAuthToken();
    
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}/api/hotspots`, {
        method: 'POST',
        headers: headers, // Do not set Content-Type for FormData, browser does it
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to upload hotspot");
    }
    return response.json();
};

// --- Drives (Events) ---
export const getDrives = async () => {
    return fetchWithAuth("/api/drives", { method: 'GET' });
};

export const createDrive = async (driveData: any) => {
    return fetchWithAuth("/api/drives", {
        method: 'POST',
        body: JSON.stringify(driveData)
    });
};

export const joinDrive = async (driveId: number) => {
    return fetchWithAuth(`/api/drives/${driveId}/join`, {
        method: 'POST'
    });
};

export const leaveDrive = async (driveId: number) => {
    return fetchWithAuth(`/api/drives/${driveId}/leave`, {
        method: 'DELETE'
    });
};

export const completeDrive = async (driveId: number, formData: FormData) => {
    const headers = new Headers();
    const token = getAuthToken();
    
    if (token) {
        headers.append('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE_URL}/api/drives/${driveId}/complete`, {
        method: 'POST',
        headers: headers,
        body: formData
    });

    if (!response.ok) {
        throw new Error("Failed to complete drive");
    }
    return response.json();
};

// --- Additional Features ---

export const getLeaderboard = async () => {
    return fetchWithAuth("/api/leaderboard", { method: 'GET' });
};

export const getNgos = async () => {
    return fetchWithAuth("/api/ngos", { method: 'GET' });
};

export const getRecyclingCenters = async () => {
    return fetchWithAuth("/api/recycling", { method: 'GET' });
};