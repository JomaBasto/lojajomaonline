export const getToken = () => localStorage.getItem("token");

export const isLogged = () => {
  return !!localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("token");
};