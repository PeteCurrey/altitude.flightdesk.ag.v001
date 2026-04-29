"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Map, Source, Layer, NavigationControl, ScaleControl, Marker, Popup } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Navigation, 
  Layers, 
  MousePointer2, 
  Map as MapIcon, 
  ShieldAlert, 
  Wind, 
  Cloud, 
  Zap, 
  ChevronRight, 
  Save, 
  Plus, 
  Trash2, 
  Maximize2,
  Settings,
  Search,
  Box,
  Compass,
  FileUp,
  Download,
  RotateCcw,
  RotateCw,
  Ruler,
  Info,
  ChevronDown,
  LayoutGrid,
  Activity,
  Camera,
  Play,
  Square,
  RefreshCcw,
  Cpu,
  Eye,
  AlertTriangle,
  Move,
  CheckCircle2
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { DataCard, CommandButton, StatusBadge, SectionPanel } from "@/components/ui/altitude-ui";
import { ShotList } from "@/components/planner/shot-list";
import { MOCK_JOBS } from "@/lib/mock-data";

import { getLiveWeather } from "@/app/actions/weather";
import { convertGeoJSONToKML } from "@/lib/integrations/google-earth";
import { checkAirspace } from "@/app/actions/airspace";


// Helper for basic distance (Mocked for speed, should use Turf in production)
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

interface Waypoint {
  id: string;
  lat: number;
  lng: number;
  alt: number; // AGL
  speed: number;
  pitch: number;
  yaw: number;
  action: string;
}

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function AdvancedPlannerPage({ params }: { params: { id: string } }) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    latitude: 53.4792,
    longitude: -2.2901,
    zoom: 15,
    pitch: 45,
    bearing: 0
  });

  const [activeTab, setActiveTab] = useState("map");
  const [activeTool, setActiveTool] = useState("select");
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [selectedWpId, setSelectedWpId] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(true);
  const [activePattern, setActivePattern] = useState("manual");
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [weather, setWeather] = useState({
    temp: 14.5,
    windSpeed: 4.2,
    windDir: "NW",
    visibility: 10000,
    condition: "Clear"
  });
  const [airspaceData, setAirspaceData] = useState<any>(null);
  const [isCheckingAirspace, setIsCheckingAirspace] = useState(false);

  const job = MOCK_JOBS.find(j => j.id === params.id) || MOCK_JOBS[0];
  const isSplatJob = job.deliverables.some(d => d.toLowerCase().includes('splat') || d.toLowerCase().includes('3d'));

  // Weather Sync Loop
  useEffect(() => {
    const updateWeather = async () => {
      const result = await getLiveWeather(viewState.latitude, viewState.longitude);
      if (result.success) {
        setWeather(result.data as any);
      }
    };
    updateWeather();
    const weatherInterval = setInterval(updateWeather, 300000); // 5 mins
    return () => clearInterval(weatherInterval);
  }, [viewState.latitude, viewState.longitude]);

  // Path metrics calculations
  const metrics = useMemo(() => {
    let dist = 0;
    for (let i = 0; i < waypoints.length - 1; i++) {
      dist += getDistance(waypoints[i].lat, waypoints[i].lng, waypoints[i+1].lat, waypoints[i+1].lng);
    }
    const time = dist / 5; // Assumed 5m/s
    return {
      distance: (dist / 1000).toFixed(2),
      time: Math.round(time / 60),
      images: Math.round(time / 2), // 1 photo every 2s
      batteries: Math.ceil(time / (15 * 60)) // 15 min per battery
    };
  }, [waypoints]);

  const handleMapClick = (e: any) => {
    if (activeTool === "waypoint") {
      const newWp: Waypoint = {
        id: Math.random().toString(),
        lat: e.lngLat.lat,
        lng: e.lngLat.lng,
        alt: 60,
        speed: 5,
        pitch: -45,
        yaw: 0,
        action: "None"
      };
      setWaypoints([...waypoints, newWp]);
      setSelectedWpId(newWp.id);
    }
  };

  const updateWaypoint = (id: string, updates: Partial<Waypoint>) => {
    setWaypoints(waypoints.map(w => w.id === id ? { ...w, ...updates } : w));
  };

  const removeWaypoint = (id: string) => {
    setWaypoints(waypoints.filter(w => w.id !== id));
    if (selectedWpId === id) setSelectedWpId(null);
  };

  const handleExportKML = async () => {
    const geojson = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Flight Path" },
          geometry: {
            type: "LineString",
            coordinates: waypoints.map(w => [w.lng, w.lat])
          }
        }
      ]
    };
    const kmlString = await convertGeoJSONToKML(geojson, job.reference);
    const blob = new Blob([kmlString], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${job.reference}.kml`;
    a.click();
  };

  const handleCheckAirspace = async () => {
    setIsCheckingAirspace(true);
    const res = await checkAirspace(viewState.latitude, viewState.longitude, 10);
    if (res.success && res.features.length > 0) {
      setAirspaceData({
        type: "FeatureCollection",
        features: res.features
      });
    }
    setIsCheckingAirspace(false);
  };

  // Frustum visualisation helper
  const frustumData = useMemo(() => {
    const selected = waypoints.find(w => w.id === selectedWpId);
    if (!selected) return null;
    
    // Mocking FOV cone
    const angle = (selected.yaw * Math.PI) / 180;
    const fov = 0.0005; // Base FOV spread
    return {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [[
          [selected.lng, selected.lat],
          [selected.lng + Math.sin(angle - 0.4) * fov, selected.lat + Math.cos(angle - 0.4) * fov],
          [selected.lng + Math.sin(angle + 0.4) * fov, selected.lat + Math.cos(angle + 0.4) * fov],
          [selected.lng, selected.lat]
        ]]
      }
    };
  }, [waypoints, selectedWpId]);

  return (
    <div className="fixed inset-0 pt-20 pl-[72px] bg-void flex flex-col overflow-hidden">
      {/* Top Protocol Navigation */}
      <div className="h-14 bg-panel border-b border-border flex items-center px-6 justify-between z-[60]">
         <div className="flex border border-border bg-background-secondary">
            <ProtocolTab label="Geospatial Map" active={activeTab === 'map'} onClick={() => setActiveTab('map')} />
            <ProtocolTab label="Shot List Protocol" active={activeTab === 'shots'} onClick={() => setActiveTab('shots')} />
            <ProtocolTab label="Flight Brief PDF" active={activeTab === 'pdf'} onClick={() => setActiveTab('pdf')} />
         </div>
         <div className="flex gap-4">
            <CommandButton variant="ghost"><Settings size={14} /> Mission Config</CommandButton>
            <CommandButton variant="primary" onClick={() => setActiveTab('pdf')}><FileUp size={14} /> Generate Operations Brief</CommandButton>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
         <AnimatePresence mode="wait">
            {activeTab === 'map' && (
                <motion.div 
                  key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 flex overflow-hidden w-full h-full"
                >
                   {/* Sidebar Toolbar (Left) */}
                   <div className="w-16 bg-panel border-r border-border flex flex-col items-center py-6 gap-3 z-50">
                      <ToolbarButton icon={MousePointer2} active={activeTool === 'select'} onClick={() => setActiveTool('select')} />
                      <ToolbarButton icon={Plus} active={activeTool === 'waypoint'} onClick={() => setActiveTool('waypoint')} tooltip="Add Waypoint" />
                      <ToolbarButton icon={LayoutGrid} active={activeTool === 'grid'} onClick={() => setActiveTool('grid')} tooltip="Grid Pattern" />
                      <ToolbarButton icon={RefreshCcw} active={activeTool === 'orbit'} onClick={() => setActiveTool('orbit')} tooltip="Orbit Pattern" />
                      <ToolbarButton icon={Ruler} active={activeTool === 'ruler'} onClick={() => setActiveTool('ruler')} />
                      <ToolbarButton icon={ShieldAlert} active={!!airspaceData} onClick={handleCheckAirspace} tooltip="Check Airspace" />
                      <div className="w-8 h-[1px] bg-border my-2" />
                      <ToolbarButton icon={FileUp} tooltip="Import KML/KMZ" />
                      <ToolbarButton icon={Download} tooltip="Export KML" onClick={handleExportKML} />
                      <div className="w-8 h-[1px] bg-border my-2" />
                      <ToolbarButton icon={RotateCcw} onClick={() => setWaypoints([])} />
                      <ToolbarButton icon={Trash2} className="mt-auto text-danger/60 hover:text-danger" />
                   </div>

                   {/* Main Map Canvas */}
                   <div className="flex-1 relative w-full h-full min-h-[500px]">
                     <div className="absolute inset-0">
                       <Map
                         ref={mapRef}
                         {...viewState}
                         onMove={evt => setViewState(evt.viewState)}
                         onClick={handleMapClick}
                         style={{ width: '100%', height: '100%' }}
                       mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                       mapboxAccessToken={MAPBOX_TOKEN}
                       terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
                       fog={{ 'range': [0.5, 10], 'color': '#080A0F', 'horizon-blend': 0.1 }}
                     >


                      <Source id="mapbox-dem" type="raster-dem" url="mapbox://mapbox.mapbox-terrain-dem-v1" tileSize={512} maxzoom={14} />
                      
                      {/* Path Line Layer */}
                      <Source id="flight-path" type="geojson" data={{
                         type: "Feature",
                         geometry: {
                            type: "LineString",
                            coordinates: waypoints.map(w => [w.lng, w.lat])
                         }
                      }}>
                         <Layer 
                          id="path-line" 
                          type="line" 
                          paint={{ 
                            'line-color': '#00D4FF', 
                            'line-width': 2, 
                            'line-dasharray': [2, 2] 
                          }} 
                         />
                      </Source>

                       {/* Airspace Restrictions Layer */}
                       {airspaceData && (
                          <Source id="airspace" type="geojson" data={airspaceData}>
                             <Layer 
                               id="airspace-fill" 
                               type="fill" 
                               paint={{ 
                                 'fill-color': ['match', ['get', 'type'], 'FRZ', '#FF3B30', '#FFA500'], 
                                 'fill-opacity': 0.2 
                               }} 
                             />
                             <Layer 
                               id="airspace-line" 
                               type="line" 
                               paint={{ 
                                 'line-color': ['match', ['get', 'type'], 'FRZ', '#FF3B30', '#FFA500'], 
                                 'line-width': 2 
                               }} 
                             />
                          </Source>
                       )}

                      {/* Gimbal Frustum Visualisation */}
                      {frustumData && (
                         <Source id="frustum" type="geojson" data={frustumData as any}>
                            <Layer 
                              id="frustum-layer" 
                              type="fill" 
                              paint={{ 
                                'fill-color': '#00D4FF', 
                                'fill-opacity': 0.2,
                                'fill-outline-color': '#00D4FF'
                              }} 
                            />
                         </Source>
                      )}

                      {/* Waypoint Markers */}
                      {waypoints.map((wp, i) => (
                         <Marker 
                          key={wp.id} 
                          latitude={wp.lat} 
                          longitude={wp.lng} 
                          anchor="center"
                          draggable
                          onDragEnd={e => updateWaypoint(wp.id, { lat: e.lngLat.lat, lng: e.lngLat.lng })}
                          onClick={(e) => { e.originalEvent.stopPropagation(); setSelectedWpId(wp.id); }}
                         >
                            <div className={cn(
                              "w-6 h-6 border-2 flex items-center justify-center font-mono text-[9px] font-bold transition-all cursor-move shadow-[0_0_10px_rgba(0,0,0,0.5)]",
                              selectedWpId === wp.id ? "bg-accent border-white text-background scale-125" : "bg-panel border-accent text-accent"
                            )}>
                               {i + 1}
                            </div>
                         </Marker>
                      ))}

                      {/* HUD Status Header */}
                      <div className="absolute top-6 left-6 z-40 pointer-events-none">
                         <div className="bg-panel/80 backdrop-blur-xl border border-accent/20 p-4 min-w-[280px] pointer-events-auto">
                            <div className="flex items-center gap-3 mb-2">
                               <span className="font-mono text-[9px] text-accent uppercase tracking-[0.2em]">{job.reference}</span>
                               <StatusBadge status="MISSION DESIGN" type="accent" />
                            </div>
                            <h2 className="font-syne font-bold text-sm text-text-primary uppercase tracking-widest">{job.title}</h2>
                            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-border/40">
                               <Metric label="Distance" value={`${metrics.distance} km`} />
                               <Metric label="Duration" value={`${metrics.time} min`} />
                               <Metric label="Batteries" value={`${metrics.batteries}x TB65`} />
                               <Metric label="Images" value={`${metrics.images} JPG`} />
                            </div>
                         </div>
                      </div>

                      {/* Gaussian Splat Planner Panel */}
                      {isSplatJob && (
                         <div className="absolute top-6 right-6 z-40 flex flex-col gap-4">
                            <DataCard className="p-4 bg-background/80 backdrop-blur-xl border-accent/40 w-72">
                               <div className="flex items-center gap-3 mb-4">
                                  <Cpu size={16} className="text-accent" />
                                  <h5 className="font-mono text-[9px] text-accent uppercase tracking-widest font-bold">Neural Splat Intelligence</h5>
                               </div>
                               <div className="space-y-4">
                                  <SplatMetric label="Coverage Completeness" value={waypoints.length > 5 ? 84 : 12} />
                                  <SplatMetric label="Angle Diversity" value={waypoints.length > 10 ? 92 : 45} />
                                  <div className="h-[1px] bg-border my-2" />
                                  <div className="p-2 bg-accent/5 border border-accent/20">
                                     <p className="text-[8px] font-mono text-accent uppercase leading-tight">
                                        **Guidance:** {waypoints.length < 10 ? 'Insufficient vertical diversity. Add high-oblique orbit.' : 'Optimal for neural convergence.'}
                                     </p>
                                  </div>
                               </div>
                            </DataCard>
                         </div>
                      )}

                      <NavigationControl position="bottom-right" className="!mr-6 !mb-32" />
                     </Map>
                    </div>

                     {/* Tactical Weather HUD Overlay */}
                     <div className="absolute top-6 right-6 z-[60] pointer-events-none">
                        <DataCard className="p-4 bg-background/80 backdrop-blur-md border-accent/20 min-w-[180px] pointer-events-auto">
                           <div className="flex items-center gap-2 mb-3">
                              <Wind size={14} className="text-accent" />
                              <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest font-bold">Site Conditions</span>
                           </div>
                           <div className="space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                 <span className="text-text-muted uppercase">Wind</span>
                                 <span className="text-text-primary font-bold">{weather.windSpeed}m/s {weather.windDir}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                 <span className="text-text-muted uppercase">Visibility</span>
                                 <span className="text-text-primary font-bold">{weather.visibility >= 10000 ? ">10km" : `${(weather.visibility / 1000).toFixed(1)}km`}</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-mono">
                                 <span className="text-text-muted uppercase">Temp</span>
                                 <span className="text-text-primary font-bold">{weather.temp.toFixed(1)}°C</span>
                              </div>
                              <div className="flex justify-between items-center text-[10px] font-mono mt-2 pt-2 border-t border-border">
                                 <span className="text-accent uppercase text-[8px] font-bold">{weather.condition} protocol</span>
                                 <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_var(--success)]" />
                              </div>
                           </div>
                        </DataCard>
                     </div>

                    {/* Altitude Profile Panel */}
                    <AnimatePresence>
                       {showProfile && (
                         <motion.div 
                          initial={{ y: 200 }} animate={{ y: 0 }} exit={{ y: 200 }}
                          className="absolute bottom-20 inset-x-0 h-40 bg-panel/90 backdrop-blur-2xl border-t border-border z-40"
                         >
                            <div className="h-full flex flex-col">
                               <div className="px-6 py-2 border-b border-border flex justify-between items-center">
                                  <span className="font-mono text-[9px] text-text-muted uppercase tracking-widest">Altitude Profile (AGL)</span>
                                  <div className="flex gap-4">
                                     <div className="flex items-center gap-2"><div className="w-2 h-[1px] bg-accent" /> <span className="text-[8px] font-mono text-text-muted">PLAN</span></div>
                                     <div className="flex items-center gap-2"><div className="w-2 h-[1px] bg-danger" /> <span className="text-[8px] font-mono text-text-muted">TERRAIN</span></div>
                                  </div>
                               </div>
                               <div className="flex-1 relative overflow-hidden flex items-end px-6 pb-4">
                                  {/* Mock Terrain Profile */}
                                  <svg className="w-full h-full">
                                     <path 
                                      d="M0 100 L50 80 L100 95 L150 70 L200 85 L250 110 L300 90 L400 100 L500 70 L1000 100" 
                                      stroke="var(--danger)" strokeWidth="1" fill="rgba(255,59,48,0.05)" 
                                      className="w-full h-full"
                                     />
                                     {/* Waypoint Altitude Connectors */}
                                     {waypoints.map((wp, i) => {
                                        const x = (i / Math.max(1, waypoints.length - 1)) * 100;
                                        return (
                                           <g key={wp.id}>
                                              <circle cx={`${x}%`} cy={`${100 - wp.alt}%`} r="3" fill="var(--accent)" />
                                              <text x={`${x}%`} y={`${90 - wp.alt}%`} fontSize="8" fill="var(--text-muted)" textAnchor="middle" fontFamily="monospace">{wp.alt}m</text>
                                           </g>
                                        );
                                     })}
                                  </svg>
                               </div>
                            </div>
                         </motion.div>
                       )}
                    </AnimatePresence>

                    {/* Bottom Status Rail */}
                    <div className="absolute bottom-0 inset-x-0 h-20 bg-panel border-t border-border flex items-center px-10 gap-12 z-50">
                       <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 text-text-muted hover:text-accent transition-all">
                          <Activity size={14} />
                          <span className="font-mono text-[9px] uppercase tracking-widest">Toggle Profile</span>
                       </button>
                       <div className="h-8 w-[1px] bg-border" />
                       <div className="flex items-center gap-6">
                          <TemplateButton label="Grid" active={activePattern === 'grid'} />
                          <TemplateButton label="Corridor" active={activePattern === 'corridor'} />
                          <TemplateButton label="Orbit" active={activePattern === 'orbit'} />
                          <TemplateButton label="Perimeter" active={activePattern === 'perimeter'} />
                       </div>
                       <div className="flex-1" />
                       <div className="flex gap-4">
                          <CommandButton variant="ghost">Simulate Mission</CommandButton>
                          <CommandButton variant="primary">Commit to Aircraft</CommandButton>
                       </div>
                    </div>
                  </div>

                  {/* Right Waypoint Inspector */}
                  <div className="w-[320px] bg-panel border-l border-border flex flex-col z-50">
                     <div className="p-6 border-b border-border bg-background-secondary/50 flex items-center justify-between">
                        <h4 className="font-syne font-bold text-xs uppercase tracking-widest">Waypoint Inspector</h4>
                        {selectedWpId && (
                           <button onClick={() => removeWaypoint(selectedWpId!)} className="text-danger hover:scale-110 transition-all">
                              <Trash2 size={14} />
                           </button>
                        )}
                     </div>
                     
                     <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                        {selectedWpId ? (
                           <AnimatePresence mode="wait">
                              <motion.div 
                                key={selectedWpId} 
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                              >
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-accent text-background flex items-center justify-center font-bold font-mono">
                                       {waypoints.findIndex(w => w.id === selectedWpId) + 1}
                                    </div>
                                    <span className="font-mono text-[10px] text-text-muted uppercase">WP-PROTOCOL-ACTIVE</span>
                                 </div>

                                 <SectionPanel title="Motion Parameters">
                                    <div className="space-y-4">
                                       <RangeInput 
                                         label="Altitude (AGL)" 
                                         value={waypoints.find(w => w.id === selectedWpId)?.alt} 
                                         min={0} max={120} unit="m"
                                         onChange={(v) => updateWaypoint(selectedWpId!, { alt: v })}
                                       />
                                       <RangeInput 
                                         label="Flight Speed" 
                                         value={waypoints.find(w => w.id === selectedWpId)?.speed} 
                                         min={1} max={15} unit="m/s"
                                         onChange={(v) => updateWaypoint(selectedWpId!, { speed: v })}
                                       />
                                    </div>
                                 </SectionPanel>

                                 <SectionPanel title="Gimbal & Heading">
                                    <div className="space-y-4">
                                       <RangeInput 
                                         label="Gimbal Pitch" 
                                         value={waypoints.find(w => w.id === selectedWpId)?.pitch} 
                                         min={-90} max={0} unit="°"
                                         onChange={(v) => updateWaypoint(selectedWpId!, { pitch: v })}
                                       />
                                       <RangeInput 
                                         label="Heading (Yaw)" 
                                         value={waypoints.find(w => w.id === selectedWpId)?.yaw} 
                                         min={0} max={360} unit="°"
                                         onChange={(v) => updateWaypoint(selectedWpId!, { yaw: v })}
                                       />
                                    </div>
                                 </SectionPanel>

                                 <SectionPanel title="Mission Action">
                                    <select 
                                       className="input-field py-2 text-[10px] uppercase font-mono"
                                       value={waypoints.find(w => w.id === selectedWpId)?.action}
                                       onChange={(e) => updateWaypoint(selectedWpId!, { action: e.target.value })}
                                    >
                                       <option>None</option>
                                       <option>Photo</option>
                                       <option>Start Video</option>
                                       <option>Stop Video</option>
                                       <option>Timed Interval</option>
                                       <option>Hover</option>
                                    </select>
                                 </SectionPanel>
                              </motion.div>
                           </AnimatePresence>
                        ) : (
                           <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                              <MousePointer2 size={32} className="mb-4 text-text-muted" />
                              <p className="font-mono text-[9px] uppercase tracking-widest text-text-muted">
                                 Select a waypoint to <br /> access technical parameters
                              </p>
                           </div>
                        )}
                     </div>
                  </div>
               </motion.div>
            )}

            {activeTab === 'shots' && (
               <motion.div 
                 key="shots" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                 className="flex-1 overflow-y-auto p-10 custom-scrollbar"
               >
                  <ShotList jobId={job.id} waypoints={waypoints} />
               </motion.div>
            )}

            {activeTab === 'pdf' && (
               <motion.div 
                 key="pdf" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                 className="flex-1 flex flex-col items-center justify-center gap-8 bg-background-secondary/30 p-10"
               >
                  <div className="max-w-4xl w-full card-elevated p-12 space-y-12">
                     <div className="flex justify-between items-start">
                        <div className="space-y-2">
                           <span className="font-mono text-xs text-accent uppercase tracking-widest font-bold">Protocol Output</span>
                           <h2 className="text-4xl font-syne font-black text-text-primary uppercase tracking-tight">Pre-Flight Brief PDF</h2>
                           <p className="text-text-muted font-mono text-[10px] uppercase tracking-widest">Compiler: Neural v2.1 — Audit Ready</p>
                        </div>
                        <div className="p-6 border border-border bg-panel text-accent">
                           <FileUp size={48} strokeWidth={1} />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 gap-12 border-y border-border py-12">
                        <PdfChecklist label="Site Overview" desc="Static map, coords, W3W, site type." />
                        <PdfChecklist label="Flight Path" desc="Waypoint list, mission pattern, metrics." />
                        <PdfChecklist label="Altitude Profile" desc="Terrain profile, clearance analysis." />
                        <PdfChecklist label="Shot List" desc="Deliverable registry, linked waypoints." />
                        <PdfChecklist label="Manifest" desc="Fleet assignment, battery cycles." />
                        <PdfChecklist label="Compliance" desc="CAA permissions, Insurance, NOTAMs." />
                     </div>

                     <div className="flex justify-between items-end pt-4">
                        <div className="space-y-1">
                           <span className="font-mono text-[9px] text-text-muted uppercase">Output Format</span>
                           <p className="text-xs font-bold text-text-primary font-mono">PDF / A-1b (Editorial Style)</p>
                        </div>
                        <CommandButton 
                           variant="primary" 
                           className="py-4 px-10 text-xs shadow-[0_0_30px_var(--accent)]"
                           onClick={() => {
                              setIsGeneratingPdf(true);
                              setTimeout(() => setIsGeneratingPdf(false), 3000);
                           }}
                           disabled={isGeneratingPdf}
                        >
                           {isGeneratingPdf ? 'Compiling Neural Brief...' : 'Generate Operations Brief'}
                        </CommandButton>
                     </div>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </div>
    </div>
  );
}

function ProtocolTab({ label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-8 py-3 text-[10px] font-mono uppercase tracking-[0.2em] transition-all",
        active ? "bg-accent text-background font-bold" : "text-text-muted hover:text-text-primary"
      )}
    >
      {label}
    </button>
  );
}

function PdfChecklist({ label, desc }: any) {
  return (
    <div className="flex gap-4">
       <div className="w-5 h-5 border border-accent bg-accent/10 flex items-center justify-center shrink-0 mt-1">
          <CheckCircle2 size={12} className="text-accent" />
       </div>
       <div className="space-y-1">
          <h5 className="font-syne font-bold text-xs uppercase tracking-widest text-text-primary">{label}</h5>
          <p className="text-[10px] font-mono text-text-muted uppercase leading-tight">{desc}</p>
       </div>
    </div>
  );
}

function ToolbarButton({ icon: Icon, active, className, tooltip, onClick }: any) {
  return (
    <div className="group relative">
      <button 
        onClick={onClick}
        className={cn(
        "w-10 h-10 flex items-center justify-center border transition-all",
        active ? "bg-accent border-accent text-background shadow-[0_0_15px_rgba(0,212,255,0.4)]" : "bg-panel border-border text-text-muted hover:text-accent hover:border-accent",
        className
      )}>
         <Icon size={16} />
      </button>
      {tooltip && (
        <span className="absolute left-full ml-3 px-2 py-1 bg-panel border border-border text-[8px] font-mono uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
           {tooltip}
        </span>
      )}
    </div>
  );
}

function Metric({ label, value }: any) {
  return (
    <div className="flex flex-col">
       <span className="font-mono text-[8px] text-text-muted uppercase tracking-widest">{label}</span>
       <span className="font-mono text-xs font-bold text-text-primary mt-0.5">{value}</span>
    </div>
  );
}

function SplatMetric({ label, value }: any) {
  return (
    <div className="space-y-1.5">
       <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-widest">
          <span className="text-text-muted">{label}</span>
          <span className="text-accent font-bold">{value}%</span>
       </div>
       <div className="h-0.5 bg-void w-full">
          <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-accent" />
       </div>
    </div>
  );
}

function RangeInput({ label, value, min, max, unit, onChange }: any) {
  return (
    <div className="space-y-2">
       <div className="flex justify-between items-center">
          <label className="text-[9px] font-mono text-text-muted uppercase tracking-widest">{label}</label>
          <span className="text-[10px] font-bold text-accent font-mono">{value}{unit}</span>
       </div>
       <input 
         type="range" min={min} max={max} value={value} 
         onChange={(e) => onChange(parseFloat(e.target.value))}
         className="w-full accent-accent h-1 bg-void appearance-none" 
       />
    </div>
  );
}

function TemplateButton({ label, active }: any) {
  return (
    <button className={cn(
      "px-4 py-2 border text-[9px] font-mono uppercase tracking-widest transition-all",
      active ? "bg-accent border-accent text-background shadow-[0_0_10px_var(--accent)]" : "bg-panel border-border text-text-muted hover:text-accent"
    )}>
       {label}
    </button>
  );
}
