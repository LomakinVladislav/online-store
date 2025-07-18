export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; 
    return Date.now() >= exp;
  } catch (e) {
    return true; 
  }
};


export const getValidToken = (): string | null => {
  const token = localStorage.getItem('access_token');
  
  if (!token) return null;
  
  if (isTokenExpired(token)) {
    localStorage.removeItem('access_token');
    return null;
  }
  
  return token;
};