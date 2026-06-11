import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  // REEMPLAZA ESTO CON TU CORREO REAL DE GOOGLE
  const ADMIN_EMAIL = "idekisora@gmail.com"; 

  if (loading) return <div className="p-10 text-center font-black italic">Verificando Credenciales...</div>;

  if (!user || user.email !== ADMIN_EMAIL) {
    // Si no es el admin, lo mandamos al inicio
    alert("Acceso Denegado: Solo el organizador puede entrar aquí ⛔");
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;