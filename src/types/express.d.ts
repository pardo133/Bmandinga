declare namespace Express {
  interface Request {
    user?: {
      id: string;
      nombre: string;
      correo: string;
      role: 'user' | 'admin';
    };
  }
}
