// ─── CORE ENUMS ─────────────────────────────────────────────────────────────

export type JobStatus = "enquiry" | "brief" | "quoted" | "active" | "in_progress" | "completed" | "cancelled";
export type FlightStatus = "planned" | "pre_flight" | "airborne" | "landed" | "aborted";
export type MediaStatus = "uploading" | "processing" | "tagged" | "approved" | "delivered";
export type UserRole = "admin" | "operator" | "pilot" | "client";
export type EquipmentStatus = "operational" | "maintenance" | "retired" | "lost";
export type AirspaceClass = "A" | "B" | "C" | "D" | "E" | "G" | "NOTAM" | "FRZ";

// ─── CLIENT & CRM ────────────────────────────────────────────────────────────

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  industry: string;
  notes?: string;
  totalJobs: number;
  totalSpend: number;
  createdAt: string;
  lastJobAt?: string;
}

export interface Enquiry {
  id: string;
  clientId: string;
  client: Client;
  subject: string;
  message: string;
  serviceType: string;
  budget?: number;
  timeline?: string;
  location: string;
  status: "new" | "contacted" | "converted" | "lost";
  createdAt: string;
}

// ─── BRIEF & QUOTE ───────────────────────────────────────────────────────────

export interface Brief {
  id: string;
  jobId: string;
  clientId: string;
  client: Client;
  title: string;
  description: string;
  serviceType: string[];
  location: string;
  coordinates: { lat: number; lng: number };
  scheduledDate: string;
  duration: number; // minutes
  altitude: number; // metres
  deliverables: string[];
  specialRequirements?: string;
  status: JobStatus;
  priority: "low" | "medium" | "high" | "urgent";
  createdAt: string;
  updatedAt: string;
}

export interface QuoteLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  jobId: string;
  briefId: string;
  client: Client;
  lineItems: QuoteLineItem[];
  subtotal: number;
  vat: number;
  total: number;
  validUntil: string;
  notes?: string;
  status: "draft" | "sent" | "accepted" | "declined" | "expired";
  createdAt: string;
}

// ─── JOB ─────────────────────────────────────────────────────────────────────

export interface Job {
  id: string;
  reference: string;
  title: string;
  client: Client;
  brief: Brief;
  quote?: Quote;
  pilotId?: string;
  pilot?: Pilot;
  status: JobStatus;
  scheduledDate: string;
  completedDate?: string;
  location: string;
  coordinates: { lat: number; lng: number };
  serviceTypes: string[];
  value: number;
  invoiceStatus?: "pending" | "invoiced" | "paid";
  createdAt: string;
  updatedAt: string;
}

// ─── FLIGHT PLANNING ─────────────────────────────────────────────────────────

export interface Waypoint {
  id: string;
  index: number;
  lat: number;
  lng: number;
  altitude: number;
  speed: number;
  action: "hover" | "capture" | "transit" | "landing";
  notes?: string;
}

export interface FlightPlan {
  id: string;
  jobId: string;
  name: string;
  waypoints: Waypoint[];
  totalDistance: number; // metres
  estimatedDuration: number; // minutes
  maxAltitude: number;
  airspaceClass: AirspaceClass;
  notamChecked: boolean;
  weatherChecked: boolean;
  status: "draft" | "approved" | "active" | "completed";
  createdAt: string;
}

export interface ShotListItem {
  id: string;
  index: number;
  shotType: string;
  description: string;
  camera: string;
  lens?: string;
  settings: {
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
    resolution?: string;
  };
  waypointId?: string;
  status: "pending" | "captured" | "approved" | "reshooting";
  notes?: string;
}

// ─── LIVE FLIGHT ─────────────────────────────────────────────────────────────

export interface TelemetryData {
  timestamp: string;
  altitude: number;
  speed: number;
  heading: number;
  battery: number;
  gpsLat: number;
  gpsLng: number;
  signalStrength: number;
  flightMode: "manual" | "auto" | "return_home" | "hold";
  satellites: number;
  windSpeed: number;
  windDirection: number;
  temperature: number;
}

export interface FlightSession {
  id: string;
  jobId: string;
  flightPlanId: string;
  pilotId: string;
  status: FlightStatus;
  startTime?: string;
  endTime?: string;
  duration?: number;
  maxAltitudeReached: number;
  distanceFlown: number;
  batteryStart: number;
  batteryEnd?: number;
  incidentLog: string[];
  telemetry: TelemetryData[];
}

// ─── MEDIA ───────────────────────────────────────────────────────────────────

export interface MediaAsset {
  id: string;
  jobId: string;
  filename: string;
  originalName: string;
  fileType: "image" | "video" | "raw" | "model" | "document";
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  shotListItemId?: string;
  aiTags: string[];
  aiDescription?: string;
  status: MediaStatus;
  uploadedAt: string;
  processedAt?: string;
}

export interface GaussianSplatJob {
  id: string;
  jobId: string;
  name: string;
  inputFrames: number;
  status: "queued" | "processing" | "complete" | "failed";
  progress: number;
  outputUrl?: string;
  pointCount?: number;
  processingTime?: number;
  createdAt: string;
}

// ─── PRE-FLIGHT DOCS ─────────────────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  required: boolean;
  checked: boolean;
  notes?: string;
}

export interface RiskAssessment {
  id: string;
  jobId: string;
  hazards: Array<{
    id: string;
    hazard: string;
    likelihood: 1 | 2 | 3 | 4 | 5;
    severity: 1 | 2 | 3 | 4 | 5;
    mitigation: string;
    residualRisk: 1 | 2 | 3 | 4 | 5;
  }>;
  overallRisk: "low" | "medium" | "high" | "extreme";
  approvedBy?: string;
  approvedAt?: string;
}

export interface PreflightDoc {
  id: string;
  jobId: string;
  checklist: ChecklistItem[];
  riskAssessment: RiskAssessment;
  pilotSignature?: string;
  supervisorSignature?: string;
  completedAt?: string;
}

// ─── TEAM & EQUIPMENT ────────────────────────────────────────────────────────

export interface Pilot {
  id: string;
  name: string;
  email: string;
  phone: string;
  caaNumber: string;
  pfcoExpiry: string;
  a2CofCExpiry?: string;
  dbsExpiry: string;
  insuranceExpiry: string;
  status: "active" | "inactive" | "suspended";
  rating: number;
  totalFlights: number;
  totalHours: number;
  location: string;
  specialisms: string[];
  avatar?: string;
  joinedAt: string;
}

export interface DroneEquipment {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  category: "drone" | "camera" | "lens" | "battery" | "controller" | "accessory";
  status: EquipmentStatus;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  nextServiceDue?: string;
  totalFlightHours?: number;
  totalFlights?: number;
  notes?: string;
  assignedPilotId?: string;
}

// ─── REPORTS & DELIVERY ──────────────────────────────────────────────────────

export interface Report {
  id: string;
  jobId: string;
  title: string;
  type: "mission" | "inspection" | "survey" | "delivery";
  sections: Array<{
    id: string;
    heading: string;
    content: string;
    assets: string[];
  }>;
  generatedBy: "manual" | "ai";
  status: "draft" | "review" | "approved" | "delivered";
  createdAt: string;
}

export interface DeliveryPortal {
  id: string;
  jobId: string;
  clientId: string;
  accessToken: string;
  title: string;
  message?: string;
  assets: MediaAsset[];
  report?: Report;
  expiresAt?: string;
  viewCount: number;
  downloadCount: number;
  createdAt: string;
}

// ─── DASHBOARD KPIs ──────────────────────────────────────────────────────────

export interface DashboardKPIs {
  activeJobs: number;
  activePilots: number;
  monthlyRevenue: number;
  revenueChange: number;
  totalFlightHours: number;
  flightHoursChange: number;
  pendingQuotes: number;
  overdueItems: number;
  avgJobValue: number;
  completionRate: number;
}

export interface ActivityItem {
  id: string;
  type: "job_created" | "job_completed" | "quote_sent" | "media_uploaded" | "flight_started" | "report_generated" | "pilot_assigned";
  title: string;
  description: string;
  jobId?: string;
  userId?: string;
  timestamp: string;
  metadata?: Record<string, string>;
}
