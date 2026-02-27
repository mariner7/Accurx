export const es = {
  auth: {
    login: 'Iniciar Sesión',
    register: 'Registrarse',
    email: 'Correo electrónico',
    password: 'Contraseña',
    role: 'Rol',
    signIn: 'Ingresar',
    signUp: 'Registrarse',
    noAccount: '¿No tienes una cuenta?',
    haveAccount: '¿Ya tienes una cuenta?',
    loginError: 'Credenciales inválidas',
    registerError: 'Error en el registro',
    patient: 'Paciente',
    doctor: 'Médico',
    admin: 'Administrador'
  },
  common: {
    loading: 'Cargando...',
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Volver',
    search: 'Buscar',
    noData: 'No hay datos',
    actions: 'Acciones'
  },
  home: {
    welcome: 'Bienvenido',
    logout: 'Cerrar Sesión',
    patients: 'Pacientes',
    doctors: 'Médicos',
    appointments: 'Citas'
  },
  patients: {
    title: 'Pacientes',
    create: 'Crear Paciente',
    name: 'Nombre',
    age: 'Edad',
    gender: 'Género',
    address: 'Dirección',
    phone: 'Teléfono',
    email: 'Correo',
    allergies: 'Alergias',
    male: 'Masculino',
    female: 'Femenino'
  },
  doctors: {
    title: 'Médicos',
    create: 'Crear Médico',
    name: 'Nombre',
    specialty: 'Especialidad',
    licenseNumber: 'Número de Licencia'
  },
  appointments: {
    title: 'Citas',
    create: 'Crear Cita',
    startTime: 'Hora de Inicio',
    endTime: 'Hora de Fin',
    status: 'Estado',
    notes: 'Notas',
    confirmAppointment: 'Confirmar Cita',
    cancelAppointment: 'Cancelar Cita',
    reschedule: 'Reprogramar',
    reserved: 'Reservada',
    confirmed: 'Confirmada',
    cancelled: 'Cancelada'
  },
  settings: {
    title: 'Configuración',
    theme: 'Tema',
    themeSystem: 'Sistema',
    themeLight: 'Claro',
    themeDark: 'Oscuro'
  }
};

export type TranslationKeys = typeof es;
