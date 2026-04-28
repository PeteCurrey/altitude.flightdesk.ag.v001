import type {
  Client, Brief, Quote, Job, FlightPlan, ShotListItem,
  Pilot, DroneEquipment, MediaAsset, Report, ActivityItem,
  DashboardKPIs, FlightSession, TelemetryData, ChecklistItem,
} from "@/types";

// ─── CLIENTS ─────────────────────────────────────────────────────────────────

export const MOCK_CLIENTS: Client[] = [
  {
    id: "c1", name: "James Harrington", company: "Harrington Property Group",
    email: "j.harrington@hpg.co.uk", phone: "+44 7711 234567",
    address: "12 King Street", city: "London", postcode: "EC2V 8AP",
    industry: "Real Estate", totalJobs: 14, totalSpend: 42800,
    createdAt: "2024-03-15", lastJobAt: "2025-04-10",
  },
  {
    id: "c2", name: "Sarah Whitfield", company: "Whitfield Civil Engineering",
    email: "s.whitfield@wce.co.uk", phone: "+44 7822 345678",
    address: "45 Commerce Park", city: "Birmingham", postcode: "B11 2RQ",
    industry: "Construction", totalJobs: 8, totalSpend: 31200,
    createdAt: "2024-06-01", lastJobAt: "2025-04-18",
  },
  {
    id: "c3", name: "Tom Ashworth", company: "Ashworth Productions",
    email: "t.ashworth@ashworthpro.com", phone: "+44 7933 456789",
    address: "7 Studio Mews", city: "Manchester", postcode: "M15 4FT",
    industry: "Film & TV", totalJobs: 22, totalSpend: 87500,
    createdAt: "2023-11-20", lastJobAt: "2025-04-22",
  },
  {
    id: "c4", name: "Emily Crane", company: "National Grid PLC",
    email: "e.crane@nationalgrid.co.uk", phone: "+44 7544 567890",
    address: "1 Strand", city: "London", postcode: "WC2N 5EH",
    industry: "Infrastructure", totalJobs: 6, totalSpend: 52300,
    createdAt: "2024-09-01", lastJobAt: "2025-03-30",
  },
  {
    id: "c5", name: "David Okafor", company: "Bloom Events Ltd",
    email: "d.okafor@bloomevents.co.uk", phone: "+44 7655 678901",
    address: "22 Festival Drive", city: "Leeds", postcode: "LS1 4QP",
    industry: "Events", totalJobs: 11, totalSpend: 19400,
    createdAt: "2024-01-10", lastJobAt: "2025-04-25",
  },
];

// ─── PILOTS ──────────────────────────────────────────────────────────────────

export const MOCK_PILOTS: Pilot[] = [
  {
    id: "p1", name: "Marcus Webb", email: "m.webb@altitude.com",
    phone: "+44 7777 111222", caaNumber: "GBR-PFCO-002341",
    pfcoExpiry: "2026-08-15", a2CofCExpiry: "2027-03-01",
    dbsExpiry: "2026-04-30", insuranceExpiry: "2026-12-31",
    status: "active", rating: 4.9, totalFlights: 312, totalHours: 498,
    location: "London", specialisms: ["Real Estate", "Construction", "3D Capture"],
    joinedAt: "2023-02-10",
  },
  {
    id: "p2", name: "Priya Patel", email: "p.patel@altitude.com",
    phone: "+44 7888 223344", caaNumber: "GBR-PFCO-003122",
    pfcoExpiry: "2026-11-20", dbsExpiry: "2026-08-15",
    insuranceExpiry: "2026-12-31",
    status: "active", rating: 4.8, totalFlights: 189, totalHours: 267,
    location: "Manchester", specialisms: ["Film & TV", "Events", "Aerial Photography"],
    joinedAt: "2023-09-05",
  },
  {
    id: "p3", name: "Jack Thornton", email: "j.thornton@altitude.com",
    phone: "+44 7999 334455", caaNumber: "GBR-PFCO-004567",
    pfcoExpiry: "2025-12-10", dbsExpiry: "2025-11-30",
    insuranceExpiry: "2026-12-31",
    status: "active", rating: 4.7, totalFlights: 98, totalHours: 134,
    location: "Birmingham", specialisms: ["Infrastructure", "Thermal Imaging", "Survey"],
    joinedAt: "2024-03-18",
  },
];

// ─── EQUIPMENT ───────────────────────────────────────────────────────────────

export const MOCK_EQUIPMENT: DroneEquipment[] = [
  {
    id: "eq1", name: "DJI Matrice 350 RTK",
    manufacturer: "DJI", model: "Matrice 350 RTK",
    serialNumber: "M350-24-00341",
    category: "drone", status: "operational",
    purchaseDate: "2024-01-15", purchasePrice: 12800, currentValue: 10200,
    nextServiceDue: "2025-07-01", totalFlightHours: 189, totalFlights: 124,
  },
  {
    id: "eq2", name: "DJI Air 3S",
    manufacturer: "DJI", model: "Air 3S",
    serialNumber: "AIR3S-24-00782",
    category: "drone", status: "operational",
    purchaseDate: "2024-06-20", purchasePrice: 1299, currentValue: 1050,
    totalFlightHours: 78, totalFlights: 89,
  },
  {
    id: "eq3", name: "Sony A7R IV",
    manufacturer: "Sony", model: "A7R IV",
    serialNumber: "SONA7R-22-04521",
    category: "camera", status: "operational",
    purchaseDate: "2022-08-10", purchasePrice: 3200, currentValue: 2100,
  },
  {
    id: "eq4", name: "DJI TB65 Battery Pack (x4)",
    manufacturer: "DJI", model: "TB65",
    serialNumber: "TB65-BATCH-007",
    category: "battery", status: "operational",
    purchaseDate: "2024-01-15", purchasePrice: 640, currentValue: 480,
    nextServiceDue: "2025-06-01",
  },
  {
    id: "eq5", name: "Zenmuse L2 LiDAR",
    manufacturer: "DJI", model: "Zenmuse L2",
    serialNumber: "ZL2-24-00112",
    category: "accessory", status: "operational",
    purchaseDate: "2024-02-01", purchasePrice: 7400, currentValue: 6800,
    totalFlightHours: 67,
  },
];

// ─── BRIEFS ──────────────────────────────────────────────────────────────────

export const MOCK_BRIEFS: Brief[] = [
  {
    id: "b1", jobId: "j1", clientId: "c1", client: MOCK_CLIENTS[0],
    title: "Canary Wharf Development — Aerial Survey",
    description: "Complete aerial photographic survey of new residential development in Canary Wharf. Client requires high-resolution stills and 4K video for investor presentation. Key angles: all four elevations, roof plan, street-level approach, Thames context shots.",
    serviceType: ["Aerial Photography", "4K Video", "Orthophoto"],
    location: "Canary Wharf, London E14",
    coordinates: { lat: 51.5054, lng: -0.0235 },
    scheduledDate: "2025-05-12",
    duration: 180,
    altitude: 120,
    deliverables: ["50x edited stills", "3min highlight reel", "Orthophoto mosaic"],
    status: "active",
    priority: "high",
    createdAt: "2025-04-20",
    updatedAt: "2025-04-22",
  },
  {
    id: "b2", jobId: "j2", clientId: "c2", client: MOCK_CLIENTS[1],
    title: "Spaghetti Junction Bridge Inspection",
    description: "Structural inspection of bridge underside and support columns. LiDAR scan required for dimensional analysis. Thermal imaging to identify water ingress points.",
    serviceType: ["Thermal Imaging", "LiDAR Survey", "Inspection"],
    location: "A38(M), Birmingham",
    coordinates: { lat: 52.5107, lng: -1.8529 },
    scheduledDate: "2025-05-08",
    duration: 240,
    altitude: 80,
    deliverables: ["LiDAR point cloud", "Thermal report", "Annotated inspection images"],
    status: "quoted",
    priority: "urgent",
    createdAt: "2025-04-18",
    updatedAt: "2025-04-20",
  },
  {
    id: "b3", jobId: "j3", clientId: "c3", client: MOCK_CLIENTS[2],
    title: "Feature Film — Chase Sequence, Peak District",
    description: "Aerial support for action sequence across moorland terrain. Multiple low-altitude passes, tracking shot of motorcycle, establishing wide landscapes. Director requires real-time live feed.",
    serviceType: ["Film Support", "FPV Racing", "Live Feed"],
    location: "Peak District, Derbyshire",
    coordinates: { lat: 53.3699, lng: -1.8313 },
    scheduledDate: "2025-05-20",
    duration: 480,
    altitude: 150,
    deliverables: ["RAW footage", "Live HDMI feed", "Director's cut selects"],
    status: "active",
    priority: "high",
    createdAt: "2025-04-15",
    updatedAt: "2025-04-23",
  },
  {
    id: "b4", jobId: "j4", clientId: "c4", client: MOCK_CLIENTS[3],
    title: "Wind Farm Asset Inspection — Yorkshire",
    description: "Visual and thermal inspection of 12 turbine towers and blade assemblies. Full 360° coverage of each turbine. GIS data overlay required for asset management system.",
    serviceType: ["Thermal Imaging", "Asset Inspection", "GIS Export"],
    location: "Yorkshire Wolds, East Riding",
    coordinates: { lat: 53.9001, lng: -0.5391 },
    scheduledDate: "2025-06-02",
    duration: 360,
    altitude: 140,
    deliverables: ["Thermal report per turbine", "GIS shapefile", "Executive summary"],
    status: "brief",
    priority: "medium",
    createdAt: "2025-04-25",
    updatedAt: "2025-04-25",
  },
];

// ─── JOBS ─────────────────────────────────────────────────────────────────────

export const MOCK_JOBS: Job[] = [
  {
    id: "j1", reference: "ALT-2025-0341",
    title: "Canary Wharf Development — Aerial Survey",
    client: MOCK_CLIENTS[0], brief: MOCK_BRIEFS[0],
    pilotId: "p1", pilot: MOCK_PILOTS[0],
    status: "active", scheduledDate: "2025-05-12",
    location: "Canary Wharf, London E14",
    coordinates: { lat: 51.5054, lng: -0.0235 },
    serviceTypes: ["Aerial Photography", "4K Video", "Orthophoto"],
    value: 4800, invoiceStatus: "pending",
    createdAt: "2025-04-20", updatedAt: "2025-04-22",
  },
  {
    id: "j2", reference: "ALT-2025-0342",
    title: "Spaghetti Junction Bridge Inspection",
    client: MOCK_CLIENTS[1], brief: MOCK_BRIEFS[1],
    pilotId: "p3", pilot: MOCK_PILOTS[2],
    status: "quoted", scheduledDate: "2025-05-08",
    location: "A38(M), Birmingham",
    coordinates: { lat: 52.5107, lng: -1.8529 },
    serviceTypes: ["Thermal Imaging", "LiDAR Survey", "Inspection"],
    value: 7200, invoiceStatus: "pending",
    createdAt: "2025-04-18", updatedAt: "2025-04-20",
  },
  {
    id: "j3", reference: "ALT-2025-0343",
    title: "Feature Film — Chase Sequence",
    client: MOCK_CLIENTS[2], brief: MOCK_BRIEFS[2],
    pilotId: "p2", pilot: MOCK_PILOTS[1],
    status: "active", scheduledDate: "2025-05-20",
    location: "Peak District, Derbyshire",
    coordinates: { lat: 53.3699, lng: -1.8313 },
    serviceTypes: ["Film Support", "FPV Racing", "Live Feed"],
    value: 12400, invoiceStatus: "pending",
    createdAt: "2025-04-15", updatedAt: "2025-04-23",
  },
  {
    id: "j4", reference: "ALT-2025-0340",
    title: "Residential Development — Salford Quays",
    client: MOCK_CLIENTS[0], brief: MOCK_BRIEFS[0],
    pilotId: "p1", pilot: MOCK_PILOTS[0],
    status: "completed", scheduledDate: "2025-04-10",
    completedDate: "2025-04-10",
    location: "Salford Quays, Manchester",
    coordinates: { lat: 53.4728, lng: -2.2955 },
    serviceTypes: ["Aerial Photography", "4K Video"],
    value: 3200, invoiceStatus: "paid",
    createdAt: "2025-04-01", updatedAt: "2025-04-10",
  },
  {
    id: "j5", reference: "ALT-2025-0339",
    title: "Glastonbury Stage Construction Survey",
    client: MOCK_CLIENTS[4], brief: MOCK_BRIEFS[0],
    pilotId: "p2", pilot: MOCK_PILOTS[1],
    status: "completed", scheduledDate: "2025-04-05",
    completedDate: "2025-04-05",
    location: "Glastonbury, Somerset",
    coordinates: { lat: 51.1445, lng: -2.7158 },
    serviceTypes: ["Survey", "4K Video"],
    value: 2800, invoiceStatus: "invoiced",
    createdAt: "2025-03-28", updatedAt: "2025-04-05",
  },
];

// ─── MEDIA ASSETS ─────────────────────────────────────────────────────────────

export const MOCK_MEDIA: MediaAsset[] = [
  {
    id: "m1", jobId: "j4", filename: "cwarf_elev_north_001.jpg",
    originalName: "DJI_0041.JPG", fileType: "image", mimeType: "image/jpeg",
    size: 12400000, url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400",
    width: 5472, height: 3648,
    aiTags: ["building", "construction", "aerial", "urban", "daytime", "overcast"],
    aiDescription: "North elevation of residential tower under construction, clear sightlines, no obstructions",
    status: "delivered", uploadedAt: "2025-04-10",
  },
  {
    id: "m2", jobId: "j4", filename: "cwarf_elev_south_002.jpg",
    originalName: "DJI_0052.JPG", fileType: "image", mimeType: "image/jpeg",
    size: 13800000, url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400",
    width: 5472, height: 3648,
    aiTags: ["building", "skyline", "aerial", "urban", "London"],
    aiDescription: "South elevation with Thames river context visible in background",
    status: "approved", uploadedAt: "2025-04-10",
  },
  {
    id: "m3", jobId: "j4", filename: "cwarf_highlight_reel_v2.mp4",
    originalName: "DJI_0089.MP4", fileType: "video", mimeType: "video/mp4",
    size: 4200000000, url: "#",
    duration: 187,
    aiTags: ["video", "aerial", "development", "construction", "4K"],
    aiDescription: "3-minute highlight reel capturing all four elevations and contextual establishing shots",
    status: "delivered", uploadedAt: "2025-04-10",
  },
  {
    id: "m4", jobId: "j5", filename: "glastonbury_stage_survey.jpg",
    originalName: "DJI_0012.JPG", fileType: "image", mimeType: "image/jpeg",
    size: 11200000, url: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
    thumbnailUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400",
    width: 5472, height: 3648,
    aiTags: ["event", "construction", "stage", "festival", "aerial"],
    aiDescription: "Stage A under construction, scaffolding 70% complete, crane visible NE corner",
    status: "delivered", uploadedAt: "2025-04-05",
  },
];

// ─── DASHBOARD KPIs ──────────────────────────────────────────────────────────

export const MOCK_KPIS: DashboardKPIs = {
  activeJobs: 3,
  activePilots: 3,
  monthlyRevenue: 28400,
  revenueChange: 14.2,
  totalFlightHours: 67.4,
  flightHoursChange: 8.1,
  pendingQuotes: 2,
  overdueItems: 1,
  avgJobValue: 4820,
  completionRate: 94.7,
};

// ─── ACTIVITY FEED ───────────────────────────────────────────────────────────

export const MOCK_ACTIVITY: ActivityItem[] = [
  {
    id: "a1", type: "job_created",
    title: "New Job Created",
    description: "ALT-2025-0341 · Canary Wharf Development Survey",
    jobId: "j1", timestamp: "2025-04-28T09:14:22Z",
  },
  {
    id: "a2", type: "quote_sent",
    title: "Quote Dispatched",
    description: "£7,200 quote sent to Whitfield Civil Engineering",
    jobId: "j2", timestamp: "2025-04-28T08:55:10Z",
  },
  {
    id: "a3", type: "pilot_assigned",
    title: "Pilot Assigned",
    description: "Marcus Webb → ALT-2025-0341 (Canary Wharf)",
    jobId: "j1", timestamp: "2025-04-28T08:30:00Z",
  },
  {
    id: "a4", type: "media_uploaded",
    title: "Media Ingested",
    description: "48 files uploaded · Salford Quays job complete",
    jobId: "j4", timestamp: "2025-04-27T17:42:00Z",
  },
  {
    id: "a5", type: "job_completed",
    title: "Job Completed",
    description: "ALT-2025-0339 · Glastonbury Stage Construction Survey",
    jobId: "j5", timestamp: "2025-04-27T15:20:00Z",
  },
  {
    id: "a6", type: "report_generated",
    title: "Report Generated",
    description: "AI mission report compiled for Salford Quays",
    jobId: "j4", timestamp: "2025-04-27T11:05:00Z",
  },
  {
    id: "a7", type: "flight_started",
    title: "Flight Commenced",
    description: "Marcus Webb airborne · Salford Quays development",
    jobId: "j4", timestamp: "2025-04-27T09:15:00Z",
  },
];

// ─── REVENUE CHART DATA ───────────────────────────────────────────────────────

export const MOCK_REVENUE_DATA = [
  { month: "Nov", revenue: 18400, jobs: 8 },
  { month: "Dec", revenue: 12800, jobs: 5 },
  { month: "Jan", revenue: 21200, jobs: 9 },
  { month: "Feb", revenue: 19600, jobs: 8 },
  { month: "Mar", revenue: 24800, jobs: 11 },
  { month: "Apr", revenue: 28400, jobs: 12 },
];

// ─── FLIGHT PLAN MOCK ─────────────────────────────────────────────────────────

export const MOCK_FLIGHT_PLAN: FlightPlan = {
  id: "fp1", jobId: "j1",
  name: "Canary Wharf Survey — Plan A",
  waypoints: [
    { id: "w1", index: 0, lat: 51.5054, lng: -0.0235, altitude: 50, speed: 5, action: "hover" },
    { id: "w2", index: 1, lat: 51.5060, lng: -0.0228, altitude: 100, speed: 8, action: "transit" },
    { id: "w3", index: 2, lat: 51.5065, lng: -0.0220, altitude: 120, speed: 6, action: "capture" },
    { id: "w4", index: 3, lat: 51.5058, lng: -0.0215, altitude: 120, speed: 6, action: "capture" },
    { id: "w5", index: 4, lat: 51.5050, lng: -0.0218, altitude: 120, speed: 6, action: "capture" },
    { id: "w6", index: 5, lat: 51.5045, lng: -0.0230, altitude: 80, speed: 8, action: "transit" },
    { id: "w7", index: 6, lat: 51.5054, lng: -0.0235, altitude: 30, speed: 4, action: "landing" },
  ],
  totalDistance: 1840,
  estimatedDuration: 48,
  maxAltitude: 120,
  airspaceClass: "G",
  notamChecked: true,
  weatherChecked: true,
  status: "approved",
  createdAt: "2025-04-20",
};

// ─── PREFLIGHT CHECKLIST ──────────────────────────────────────────────────────

export const MOCK_CHECKLIST: ChecklistItem[] = [
  { id: "ck1",  category: "Documents",    item: "PFCO / Operator ID verified",            required: true,  checked: true  },
  { id: "ck2",  category: "Documents",    item: "Insurance certificate present",           required: true,  checked: true  },
  { id: "ck3",  category: "Documents",    item: "NOTAM / airspace checked",               required: true,  checked: true  },
  { id: "ck4",  category: "Documents",    item: "Risk assessment completed",              required: true,  checked: true  },
  { id: "ck5",  category: "Aircraft",     item: "Pre-flight structural inspection",        required: true,  checked: true  },
  { id: "ck6",  category: "Aircraft",     item: "Propellers secured and undamaged",        required: true,  checked: true  },
  { id: "ck7",  category: "Aircraft",     item: "Battery charge ≥ 80%",                  required: true,  checked: true  },
  { id: "ck8",  category: "Aircraft",     item: "SD cards formatted and ready",           required: true,  checked: false },
  { id: "ck9",  category: "Aircraft",     item: "Gimbal calibration complete",            required: true,  checked: true  },
  { id: "ck10", category: "Aircraft",     item: "Remote ID broadcasting verified",        required: true,  checked: true  },
  { id: "ck11", category: "Environment",  item: "Wind speed < 10.7 m/s (Beaufort 5)",    required: true,  checked: true  },
  { id: "ck12", category: "Environment",  item: "Visibility > 500m (VLOS confirmed)",    required: true,  checked: true  },
  { id: "ck13", category: "Environment",  item: "Weather forecast reviewed",              required: true,  checked: true  },
  { id: "ck14", category: "Site",         item: "Exclusion zone perimeter established",  required: true,  checked: false },
  { id: "ck15", category: "Site",         item: "Crowd dispersal plan confirmed",         required: false, checked: false },
  { id: "ck16", category: "Site",         item: "Landowner permission on file",          required: true,  checked: true  },
  { id: "ck17", category: "Communication","item": "Emergency contact briefed",           required: true,  checked: true  },
  { id: "ck18", category: "Communication","item": "ATC/frequency noted if required",     required: false, checked: false },
];

// ─── LIVE TELEMETRY MOCK ─────────────────────────────────────────────────────

export const MOCK_TELEMETRY: TelemetryData = {
  timestamp: new Date().toISOString(),
  altitude: 87.4,
  speed: 6.2,
  heading: 142,
  battery: 74,
  gpsLat: 51.5054,
  gpsLng: -0.0235,
  signalStrength: 92,
  flightMode: "auto",
  satellites: 14,
  windSpeed: 3.8,
  windDirection: 225,
  temperature: 12,
};

// ─── SHOT LIST ────────────────────────────────────────────────────────────────

export const MOCK_SHOT_LIST: ShotListItem[] = [
  {
    id: "s1", index: 1, shotType: "Establishing Wide",
    description: "Full building elevation from 100m, looking south with Thames context",
    camera: "DJI Zenmuse X7", lens: "16mm",
    settings: { iso: 100, aperture: "f/5.6", shutterSpeed: "1/800", resolution: "6K" },
    waypointId: "w3", status: "pending",
  },
  {
    id: "s2", index: 2, shotType: "Elevation — North",
    description: "Flat orthographic view of north face, 50m standoff",
    camera: "DJI Zenmuse X7", lens: "24mm",
    settings: { iso: 100, aperture: "f/4", shutterSpeed: "1/1000", resolution: "6K" },
    waypointId: "w4", status: "pending",
  },
  {
    id: "s3", index: 3, shotType: "Orbit — Reveal",
    description: "360° orbit at 80m altitude, slow reveal, 4K video",
    camera: "DJI Zenmuse X7",
    settings: { iso: 200, aperture: "f/4", shutterSpeed: "1/500", resolution: "4K" },
    status: "pending",
  },
  {
    id: "s4", index: 4, shotType: "Detail — Roof Plant",
    description: "Close approach to plant room, technical reference shots",
    camera: "DJI Zenmuse X7", lens: "50mm",
    settings: { iso: 400, aperture: "f/5.6", shutterSpeed: "1/500", resolution: "6K" },
    status: "pending",
  },
  {
    id: "s5", index: 5, shotType: "Context — Thames",
    description: "High wide establishing shot from 150m showing Thames and Canary Wharf context",
    camera: "DJI Zenmuse X7", lens: "16mm",
    settings: { iso: 100, aperture: "f/8", shutterSpeed: "1/1000", resolution: "6K" },
    status: "pending",
  },
];
