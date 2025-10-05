// Helper function to get the correct API URL with basePath support
export function getApiUrl(path) {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // In production with basePath, use the environment variable
  // In development, use the relative path
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api';
  
  // Ensure we have a leading slash
  return baseUrl.startsWith('/') ? `${baseUrl.replace(/\/api$/, '')}/${cleanPath}` : `/${cleanPath}`;
}

// Alternative simpler version
export function apiUrl(path) {
  const base = process.env.NEXT_PUBLIC_API_URL || '/api';
  // If path starts with /api, replace it with base, otherwise append to base
  if (path.startsWith('/api')) {
    return path.replace('/api', base);
  }
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
