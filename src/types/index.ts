// Enums
export enum Especie {
  BOVINO = 'BOVINO',
  OVINO = 'OVINO',
  CAPRINO = 'CAPRINO',
  PORCINO = 'PORCINO',
  EQUINO = 'EQUINO',
  CAMELLIDO = 'CAMELLIDO',
}

export enum TipoTitular {
  PERSONA_NATURAL = 'PERSONA_NATURAL',
  EMPRESA = 'EMPRESA',
}

export enum TipoEstablecimiento {
  PROPIO = 'PROPIO',
  SOCIO = 'SOCIO',
  EXTERNO = 'EXTERNO',
}

export enum Sexo {
  MACHO = 'MACHO',
  HEMBRA = 'HEMBRA',
}

export enum EstadoGeneral {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export enum EstadoAnimal {
  ACTIVO = 'ACTIVO',
  VENDIDO = 'VENDIDO',
  MUERTO = 'MUERTO',
}

export enum TipoIdentificador {
  DIIO_VISUAL = 'DIIO_VISUAL',
  RFID = 'RFID',
  CHIP = 'CHIP',
  BOLUS = 'BOLUS',
}

export enum OrigenDato {
  XR5000 = 'XR5000',
  MANUAL = 'MANUAL',
}

export enum TipoMovimiento {
  TRASLADO = 'TRASLADO',
  VENTA = 'VENTA',
  COMPRA = 'COMPRA',
  MUERTE = 'MUERTE',
  AJUSTE = 'AJUSTE',
}

export enum EstadoMovimiento {
  BORRADOR = 'BORRADOR',
  CONFIRMADO = 'CONFIRMADO',
  INFORMADO = 'INFORMADO',
}

export enum TipoDocumento {
  GUIA_DESPACHO = 'GUIA_DESPACHO',
  FACTURA = 'FACTURA',
  FORMULARIO_ENTREGA = 'FORMULARIO_ENTREGA',
}

export enum CategoriaAnimal {
  TERNERO = 'TERNERO',
  TERNERA = 'TERNERA',
  NOVILLO = 'NOVILLO',
  VAQUILLA = 'VAQUILLA',
  TORO = 'TORO',
  TORITO = 'TORITO',
  VACA = 'VACA',
  BUEY = 'BUEY',
}

// Interfaces
export interface Titular {
  id: string;
  rut: string;
  nombreRazonSocial: string;
  tipo: TipoTitular;
  contacto?: string;
  estado: EstadoGeneral;
  createdAt: string;
  updatedAt: string;
}

export interface Establecimiento {
  id: string;
  titularId: string;
  nombre: string;
  rolPredial?: string;
  ubicacion?: string;
  tipo: TipoEstablecimiento;
  estado: EstadoGeneral;
  createdAt: string;
  updatedAt: string;
  titular?: Titular;
}

export interface Raza {
  id: string;
  nombre: string;
  especie: Especie;
  descripcion?: string;
  estado: EstadoGeneral;
  createdAt: string;
  updatedAt: string;
}

export interface Animal {
  id: string;
  especie: Especie;
  razaId?: string;
  sexo?: Sexo;
  categoria?: CategoriaAnimal;
  fechaNacimiento?: string;
  titularActualId?: string;
  establecimientoActualId?: string;
  loteId?: string;
  estado: EstadoAnimal;
  fechaAlta: string;
  fechaBaja?: string;
  // Campos de trazabilidad SIPEC/SINAP
  rupOrigen?: string;
  rupUltimoMovimiento?: string;
  exportableChina?: boolean;
  exportableUE?: boolean;
  pabco?: boolean;
  trazabilidadNacimiento?: boolean;
  trazabilidadCompleta?: boolean;
  usoAnabolicos?: boolean;
  usoMedicamentoNoPermitido?: boolean;
  padreId?: string;
  madreId?: string;
  createdAt: string;
  updatedAt: string;
  raza?: Raza;
  titularActual?: Titular;
  establecimientoActual?: Establecimiento;
  lote?: Lote;
  identificadores?: Identificador[];
  manejosSanitarios?: ManejoSanitario[];
  padre?: AnimalGenealogiaRef;
  madre?: AnimalGenealogiaRef;
}

export interface AnimalGenealogiaRef {
  id: string;
  sexo?: Sexo;
  especie?: Especie;
  raza?: { nombre: string };
  identificadores?: Identificador[];
}

export interface AnimalCriaRef {
  id: string;
  sexo?: Sexo;
  estado: EstadoAnimal;
  fechaNacimiento?: string;
  identificadores?: Identificador[];
}

export interface Identificador {
  id: string;
  animalId: string;
  tipo: TipoIdentificador;
  codigo: string;
  activo: boolean;
  fechaAsignacion: string;
  fechaBaja?: string;
  motivoBaja?: string;
  fechaSipec?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ManejoSanitario {
  id: string;
  animalId: string;
  fecha: string;
  descripcion?: string;
  rup?: string;
  createdAt: string;
  updatedAt: string;
  animal?: Animal;
}

export interface Lote {
  id: string;
  establecimientoId: string;
  nombre: string;
  descripcion?: string;
  estado: EstadoGeneral;
  createdAt: string;
  updatedAt: string;
  establecimiento?: Establecimiento;
  _count?: {
    animales: number;
  };
}

export interface SesionPesaje {
  id: string;
  loteId?: string;
  fecha: string;
  equipo?: string;
  operador?: string;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
  lote?: Lote;
  pesajes?: Pesaje[];
}

export interface Pesaje {
  id: string;
  sesionId: string;
  animalId: string;
  peso: number;
  fechaHora: string;
  origenDato: OrigenDato;
  valido: boolean;
  createdAt: string;
  updatedAt: string;
  animal?: Animal;
}

export interface Movimiento {
  id: string;
  tipo: TipoMovimiento;
  fecha: string;
  establecimientoOrigenId?: string;
  establecimientoDestinoId?: string;
  titularOrigenId?: string;
  titularDestinoId?: string;
  estado: EstadoMovimiento;
  createdAt: string;
  updatedAt: string;
  establecimientoOrigen?: Establecimiento;
  establecimientoDestino?: Establecimiento;
  titularOrigen?: Titular;
  titularDestino?: Titular;
  detalles?: MovimientoDetalle[];
  documentos?: Documento[];
}

export interface MovimientoDetalle {
  id: string;
  movimientoId: string;
  animalId: string;
  createdAt: string;
  animal?: Animal;
}

export interface Documento {
  id: string;
  movimientoId: string;
  tipo: TipoDocumento;
  folio?: string;
  fecha?: string;
  archivoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalAnimales: number;
  animalesActivos: number;
  animalesVendidos: number;
  animalesMuertos: number;
  totalLotes: number;
  totalEstablecimientos: number;
  pesajesUltimaSemana: number;
  movimientosUltimoMes: number;
}

// DTOs para Titulares
export interface CreateTitularDto {
  rut: string;
  nombreRazonSocial: string;
  tipo: TipoTitular;
  contacto?: string;
}

export interface UpdateTitularDto {
  nombreRazonSocial?: string;
  tipo?: TipoTitular;
  contacto?: string;
  estado?: EstadoGeneral;
}

export interface TitularWithEstablecimientos extends Titular {
  establecimientos?: Establecimiento[];
  _count?: {
    establecimientos: number;
    animales: number;
  };
}

// DTOs para Establecimientos
export interface CreateEstablecimientoDto {
  titularId: string;
  nombre: string;
  rolPredial?: string;
  ubicacion?: string;
  tipo: TipoEstablecimiento;
}

export interface UpdateEstablecimientoDto {
  titularId?: string;
  nombre?: string;
  rolPredial?: string;
  ubicacion?: string;
  tipo?: TipoEstablecimiento;
  estado?: EstadoGeneral;
}

export interface EstablecimientoWithRelations extends Omit<Establecimiento, 'titular'> {
  titular?: {
    id: string;
    rut: string;
    nombreRazonSocial: string;
    tipo: TipoTitular;
  };
  _count?: {
    lotes: number;
    animales: number;
  };
}

// DTOs para Animales
export interface CreateAnimalDto {
  especie?: Especie;
  razaId?: string;
  sexo?: Sexo;
  categoria?: CategoriaAnimal;
  fechaNacimiento?: string;
  titularActualId?: string;
  establecimientoActualId?: string;
  loteId?: string;
  padreId?: string;
  madreId?: string;
  identificadores?: CreateIdentificadorDto[];
  // Campos de trazabilidad
  rupOrigen?: string;
  rupUltimoMovimiento?: string;
  exportableChina?: boolean;
  exportableUE?: boolean;
  pabco?: boolean;
  trazabilidadNacimiento?: boolean;
  trazabilidadCompleta?: boolean;
  usoAnabolicos?: boolean;
  usoMedicamentoNoPermitido?: boolean;
}

export interface UpdateAnimalDto {
  especie?: Especie;
  razaId?: string;
  sexo?: Sexo;
  categoria?: CategoriaAnimal;
  fechaNacimiento?: string;
  titularActualId?: string;
  establecimientoActualId?: string;
  loteId?: string;
  padreId?: string;
  madreId?: string;
  estado?: EstadoAnimal;
  // Campos de trazabilidad
  rupOrigen?: string;
  rupUltimoMovimiento?: string;
  exportableChina?: boolean;
  exportableUE?: boolean;
  pabco?: boolean;
  trazabilidadNacimiento?: boolean;
  trazabilidadCompleta?: boolean;
  usoAnabolicos?: boolean;
  usoMedicamentoNoPermitido?: boolean;
}

export interface AnimalWithRelations extends Animal {
  identificadores?: Identificador[];
  pesajes?: Pesaje[];
  padre?: AnimalGenealogiaRef;
  madre?: AnimalGenealogiaRef;
  criasPadre?: AnimalCriaRef[];
  criasMadre?: AnimalCriaRef[];
  _count?: {
    identificadores: number;
    pesajes: number;
  };
}

// DTOs para Identificadores
export interface CreateIdentificadorDto {
  tipo: TipoIdentificador;
  codigo: string;
  fechaAsignacion?: string;
}

export interface UpdateIdentificadorDto {
  activo?: boolean;
  fechaBaja?: string;
  motivoBaja?: string;
}

// DTOs para Lotes
export interface CreateLoteDto {
  nombre: string;
  establecimientoId: string;
  descripcion?: string;
}

export interface UpdateLoteDto {
  nombre?: string;
  establecimientoId?: string;
  descripcion?: string;
  estado?: EstadoGeneral;
}

