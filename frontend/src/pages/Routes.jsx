import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, AlertCircle, CheckCircle, Key, Settings, X, Save, ExternalLink, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { routeAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Loader from '../components/Loader';

const Routes = () => {
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({ from: '', to: '', mode: 'walking' });
  const [mapboxKey, setMapboxKey] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [showModal, setShowModal] = useState(false);
  // FIX: combine routes + selectedRoute into ONE state so useEffect fires ONCE not twice
  const [routeState, setRouteState] = useState({ routes: [], selectedRoute: null });
  const { routes, selectedRoute } = routeState;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markers = useRef([]);
  // KEY FIX: track how many route layers currently exist on the map
  // so clearMap never relies on the stale `routes` state
  const layerCount = useRef(0);

  const modes = [
    { value: 'walking', label: 'Walking', icon: '🚶', color: '#10B981' },
    { value: 'cycling', label: 'Cycling', icon: '🚴', color: '#3B82F6' },
    { value: 'driving', label: 'Driving', icon: '🚗', color: '#EF4444' },
  ];

  // Load saved key on mount
  useEffect(() => {
    if (!isAuthenticated) return;
    if (user?.mapboxApiKey) {
      setMapboxKey(user.mapboxApiKey);
      setInputKey(user.mapboxApiKey);
    } else {
      setShowModal(true);
    }
  }, [user, isAuthenticated]);

  // Initialize map whenever mapboxKey changes
  useEffect(() => {
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
      layerCount.current = 0;
    }
    if (!mapboxKey || !mapRef.current) return;
    try {
      mapboxgl.accessToken = mapboxKey;
      mapInstance.current = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [78.9629, 20.5937],
        zoom: 4.5,
      });
      mapInstance.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      mapInstance.current.addControl(new mapboxgl.ScaleControl(), 'bottom-right');

      mapInstance.current.on('error', (e) => {
        if (e.error?.status === 401 || e.error?.status === 403) {
          toast.error('Invalid Mapbox key — please update it.');
          setShowModal(true);
        }
      });
    } catch (e) {
      console.error('Map init failed:', e);
      toast.error('Map failed to load. Check your Mapbox API key.');
      setShowModal(true);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
        layerCount.current = 0;
      }
    };
  }, [mapboxKey]);

  // FIX: clearMap uses layerCount ref — never depends on stale `routes` state
  const clearMap = () => {
    if (!mapInstance.current) return;
    for (let i = 0; i < layerCount.current; i++) {
      [`route-glow-${i}`, `route-outline-${i}`, `route-${i}`].forEach(id => {
        if (mapInstance.current.getLayer(id)) mapInstance.current.removeLayer(id);
      });
      if (mapInstance.current.getSource(`route-${i}`)) mapInstance.current.removeSource(`route-${i}`);
    }
    markers.current.forEach(m => m.remove());
    markers.current = [];
    layerCount.current = 0;
  };

  // Full redraw ONLY when routes array changes (new search)
  useEffect(() => {
    if (!mapInstance.current || routes.length === 0) return;

    const draw = () => {
      clearMap();

      const aqiColor = (aqi) => {
        if (aqi <= 50)  return '#00C950'; // vivid green  — Good
        if (aqi <= 100) return '#FFB300'; // amber        — Moderate
        if (aqi <= 150) return '#FF6B00'; // deep orange  — Unhealthy for sensitive
        if (aqi <= 200) return '#E53935'; // vivid red    — Unhealthy
        return '#7B1FA2';                 // purple       — Very unhealthy
      };

      const aqiGlow = (aqi) => {
        if (aqi <= 50)  return '#86EFAC'; // light green glow
        if (aqi <= 100) return '#FDE68A'; // light amber glow
        if (aqi <= 150) return '#FDBA74'; // light orange glow
        if (aqi <= 200) return '#FCA5A5'; // light red glow
        return '#E9D5FF';                 // light purple glow
      };

      routes.forEach((route, i) => {
        if (!route.geometry?.coordinates?.length) return;
        const sel = selectedRoute === i;
        const lineColor = sel ? '#6366F1' : aqiColor(route.avgAQI);   // indigo when selected
        const glowColor = sel ? '#A5B4FC' : aqiGlow(route.avgAQI);
        const lineWidth = sel ? 9 : 5;

        mapInstance.current.addSource(`route-${i}`, {
          type: 'geojson',
          data: { type: 'Feature', properties: {}, geometry: route.geometry },
        });

        // Outer glow layer
        mapInstance.current.addLayer({
          id: `route-glow-${i}`, type: 'line', source: `route-${i}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': glowColor, 'line-width': lineWidth + 8, 'line-opacity': sel ? 0.35 : 0.25, 'line-blur': 4 },
        });

        // Dark outline for contrast
        mapInstance.current.addLayer({
          id: `route-outline-${i}`, type: 'line', source: `route-${i}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#1E1B4B', 'line-width': lineWidth + 3, 'line-opacity': sel ? 0.6 : 0.35 },
        });

        // Main vivid line
        mapInstance.current.addLayer({
          id: `route-${i}`, type: 'line', source: `route-${i}`,
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': lineColor, 'line-width': lineWidth, 'line-opacity': sel ? 1 : 0.8 },
        });

        mapInstance.current.on('click', `route-${i}`, () =>
          setRouteState(prev => ({ ...prev, selectedRoute: i }))
        );
        mapInstance.current.on('mouseenter', `route-${i}`, () => {
          mapInstance.current.getCanvas().style.cursor = 'pointer';
        });
        mapInstance.current.on('mouseleave', `route-${i}`, () => {
          mapInstance.current.getCanvas().style.cursor = '';
        });
      });

      layerCount.current = routes.length;

      // Custom styled markers
      const coords = routes[0].geometry.coordinates;

      const startEl = document.createElement('div');
      startEl.innerHTML = `
        <div style="
          width:36px;height:36px;border-radius:50%;
          background:linear-gradient(135deg,#00C950,#059669);
          border:3px solid white;
          box-shadow:0 4px 12px rgba(0,201,80,0.6);
          display:flex;align-items:center;justify-content:center;
          font-size:16px;
        ">🟢</div>`;

      const endEl = document.createElement('div');
      endEl.innerHTML = `
        <div style="
          width:36px;height:36px;border-radius:50%;
          background:linear-gradient(135deg,#EF4444,#B91C1C);
          border:3px solid white;
          box-shadow:0 4px 12px rgba(239,68,68,0.6);
          display:flex;align-items:center;justify-content:center;
          font-size:16px;
        ">🔴</div>`;

      const popupStyle = `
        font-family:system-ui,sans-serif;
        font-size:13px;
        font-weight:700;
        color:#111827;
        line-height:1.4;
      `;

      markers.current = [
        new mapboxgl.Marker({ element: startEl })
          .setLngLat(coords[0])
          .setPopup(new mapboxgl.Popup({ offset: 20 }).setHTML(
            `<div style="${popupStyle}">🟢 Start<br><span style="font-weight:500;color:#6B7280">${formData.from}</span></div>`
          ))
          .addTo(mapInstance.current),
        new mapboxgl.Marker({ element: endEl })
          .setLngLat(coords[coords.length - 1])
          .setPopup(new mapboxgl.Popup({ offset: 20 }).setHTML(
            `<div style="${popupStyle}">🔴 End<br><span style="font-weight:500;color:#6B7280">${formData.to}</span></div>`
          ))
          .addTo(mapInstance.current),
      ];

      // Fit bounds
      const all = routes.flatMap(r => r.geometry.coordinates);
      const bounds = all.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(all[0], all[0]));
      mapInstance.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 380, right: 80 },
        maxZoom: 14,
        duration: 1000,
      });
    };

    if (mapInstance.current.loaded()) {
      draw();
    } else {
      mapInstance.current.once('load', draw);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes]);

  // Only update paint colors/widths when selection changes — no redraw
  useEffect(() => {
    if (!mapInstance.current || routes.length === 0 || selectedRoute === null) return;

    const aqiColor = (aqi) => {
      if (aqi <= 50)  return '#00C950';
      if (aqi <= 100) return '#FFB300';
      if (aqi <= 150) return '#FF6B00';
      if (aqi <= 200) return '#E53935';
      return '#7B1FA2';
    };

    const aqiGlow = (aqi) => {
      if (aqi <= 50)  return '#86EFAC';
      if (aqi <= 100) return '#FDE68A';
      if (aqi <= 150) return '#FDBA74';
      if (aqi <= 200) return '#FCA5A5';
      return '#E9D5FF';
    };

    routes.forEach((route, i) => {
      const sel = selectedRoute === i;
      const lineColor = sel ? '#6366F1' : aqiColor(route.avgAQI);
      const glowColor = sel ? '#A5B4FC' : aqiGlow(route.avgAQI);
      const lineWidth = sel ? 9 : 5;

      if (mapInstance.current.getLayer(`route-${i}`)) {
        mapInstance.current.setPaintProperty(`route-${i}`,         'line-color',   lineColor);
        mapInstance.current.setPaintProperty(`route-${i}`,         'line-width',   lineWidth);
        mapInstance.current.setPaintProperty(`route-${i}`,         'line-opacity', sel ? 1 : 0.8);
        mapInstance.current.setPaintProperty(`route-outline-${i}`, 'line-width',   lineWidth + 3);
        mapInstance.current.setPaintProperty(`route-outline-${i}`, 'line-opacity', sel ? 0.6 : 0.35);
        mapInstance.current.setPaintProperty(`route-glow-${i}`,    'line-color',   glowColor);
        mapInstance.current.setPaintProperty(`route-glow-${i}`,    'line-width',   lineWidth + 8);
        mapInstance.current.setPaintProperty(`route-glow-${i}`,    'line-opacity', sel ? 0.35 : 0.25);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRoute]);

  const handleSaveKey = async () => {
    if (!inputKey?.trim()) { toast.error('Enter your Mapbox API key'); return; }
    if (!inputKey.startsWith('pk.')) { toast.error('Key must start with "pk."'); return; }

    setSaving(true);
    try {
      await authAPI.updateProfile({ mapboxApiKey: inputKey.trim() });
      setMapboxKey(inputKey.trim());
      setShowModal(false);
      toast.success('Mapbox API key saved! 🗺️');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save key. Check your connection.');
    } finally {
      setSaving(false);
    }
  };

  const findRoutes = async () => {
    if (!isAuthenticated) { toast.error('Please login'); return; }
    if (!mapboxKey) { toast.error('Add your Mapbox API key first'); setShowModal(true); return; }
    if (!formData.from || !formData.to) { toast.error('Enter both locations'); return; }
    if (formData.from.trim().toLowerCase() === formData.to.trim().toLowerCase()) { toast.error('Locations must be different'); return; }

    setLoading(true);
    // Reset in one shot so useEffect doesn't fire mid-clear
    setRouteState({ routes: [], selectedRoute: null });
    clearMap();

    try {
      const { data } = await routeAPI.findRoutes(formData);
      if (data.data?.routes?.length > 0) {
        // Single setState = single useEffect trigger
        setRouteState({ routes: data.data.routes, selectedRoute: 0 });
        toast.success(`Found ${data.data.routes.length} routes! 🗺️`);
      } else {
        toast.error('No routes found. Try more specific locations.');
      }
    } catch (err) {
      if (err.response?.data?.requiresMapboxKey) {
        setShowModal(true);
        toast.error('Mapbox key missing on server side. Re-save your key.');
      } else {
        toast.error(err.response?.data?.message || 'Failed to find routes');
      }
    } finally {
      setLoading(false);
    }
  };

  const aqiColor = (aqi) => {
    if (aqi <= 50)  return '#00C950';
    if (aqi <= 100) return '#FFB300';
    if (aqi <= 150) return '#FF6B00';
    if (aqi <= 200) return '#E53935';
    return '#7B1FA2';
  };

  const cur = selectedRoute !== null ? routes[selectedRoute] : null;

  // NEVER return early with <Loader> — that destroys mapRef!
  // Instead show loader as overlay so map container stays mounted

  return (
    <div className="min-h-screen bg-white">

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={e => { if (e.target === e.currentTarget && mapboxKey) setShowModal(false); }}
          >
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="bg-white rounded-3xl p-8 border-4 border-gray-900 shadow-[8px_8px_0px_0px_#111827] max-w-lg w-full"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-3 rounded-2xl border-2 border-gray-900">
                    <Key className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900">Mapbox API Key</h2>
                </div>
                {mapboxKey && (
                  <button onClick={() => setShowModal(false)} className="p-2 rounded-xl border-2 border-gray-900 hover:bg-gray-100">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-5 mb-6">
                <p className="font-black text-gray-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Why do I need this?
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Route finding uses Mapbox's mapping API. You need your own free key — it takes 2 minutes to get one and it's completely free.
                </p>
                <div className="mt-3 space-y-1 text-sm">
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /><span>100% Free — no credit card</span></div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /><span>Saved securely to your account</span></div>
                  <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /><span>Used only for your route searches</span></div>
                </div>
              </div>

              <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Step 1 — Get your free key</p>
              <a href="https://account.mapbox.com/auth/signup/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-5 py-3 rounded-xl font-bold border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all mb-1"
              >
                Get Free API Key <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-xs text-gray-500 mb-5">Sign up → go to your account → copy the "Default public token"</p>

              <p className="text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Step 2 — Paste it here</p>
              <input
                type="text"
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="pk.eyJ1IjoieW91cnVzZXI..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1"
              />
              <p className="text-xs text-gray-500 mb-5">Must start with "pk."</p>

              <button
                onClick={handleSaveKey}
                disabled={saving || !inputKey}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-black py-4 rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] hover:translate-y-[2px] hover:translate-x-[2px] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {saving ? <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}><Sparkles className="w-5 h-5" /></motion.div> Saving...</> : <><Save className="w-5 h-5" /> Save & Continue</>}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-black text-white mb-3">Smart Route Finder 🗺️</h1>
          <p className="text-xl text-white/90">Find the cleanest air route with real-time visualization</p>
        </div>
      </section>

      {/* BODY */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">

          {!isAuthenticated && (
            <div className="bg-yellow-300 border-2 border-gray-900 rounded-2xl p-5 mb-6 max-w-3xl mx-auto shadow-[4px_4px_0px_0px_#111827] flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-gray-900 flex-shrink-0" />
              <p className="font-black text-gray-900">Please login to use the route finder</p>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6">

            {/* Left panel */}
            <div className="lg:col-span-1 space-y-5">
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-gray-900">🔍 Enter Locations</h3>
                  {mapboxKey && (
                    <button onClick={() => { setInputKey(mapboxKey); setShowModal(true); }} className="p-2 rounded-xl border-2 border-gray-900 hover:bg-gray-100" title="Update API Key">
                      <Settings className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {!mapboxKey && (
                  <div className="mb-4 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-xl">
                    <p className="text-sm font-bold text-gray-800 mb-1">⚠️ Mapbox API Key Required</p>
                    <button onClick={() => setShowModal(true)} className="text-blue-600 underline font-bold text-sm">Add your key here</button>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-900 font-bold mb-1 text-xs uppercase">Starting Point</label>
                    <input type="text" name="from" value={formData.from} onChange={e => setFormData({ ...formData, from: e.target.value })}
                      placeholder="e.g. Connaught Place, Delhi"
                      disabled={!isAuthenticated || !mapboxKey}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-900 font-bold mb-1 text-xs uppercase">Destination</label>
                    <input type="text" name="to" value={formData.to} onChange={e => setFormData({ ...formData, to: e.target.value })}
                      placeholder="e.g. India Gate, Delhi"
                      disabled={!isAuthenticated || !mapboxKey}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-900 font-bold mb-1 text-xs uppercase">Travel Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                      {modes.map(m => (
                        <button key={m.value} onClick={() => setFormData({ ...formData, mode: m.value })}
                          disabled={!isAuthenticated || !mapboxKey}
                          className={`p-3 rounded-xl border-2 border-gray-900 text-center transition-all disabled:opacity-40 ${formData.mode === m.value ? 'shadow-[4px_4px_0px_0px_#111827]' : 'hover:shadow-[2px_2px_0px_0px_#111827]'}`}
                          style={{ backgroundColor: formData.mode === m.value ? m.color : 'white' }}
                        >
                          <div className="text-2xl">{m.icon}</div>
                          <div className={`font-black text-xs mt-1 ${formData.mode === m.value ? 'text-white' : 'text-gray-900'}`}>{m.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={findRoutes} disabled={!isAuthenticated || !mapboxKey || loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-black py-3 rounded-xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827] hover:shadow-[2px_2px_0px_0px_#111827] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Searching...</>
                      : <><Navigation className="w-5 h-5" /> Find Routes</>
                    }
                  </button>
                </div>
              </div>

              {/* Route list */}
              {routes.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]">
                  <h4 className="font-black text-gray-900 mb-3">🛣️ Routes ({routes.length})</h4>
                  <div className="space-y-2">
                    {routes.map((r, i) => (
                      <button key={i} onClick={() => setRouteState(prev => ({ ...prev, selectedRoute: i }))}
                        className={`w-full p-4 rounded-xl border-2 border-gray-900 text-left transition-all ${selectedRoute === i ? 'bg-green-500 text-white shadow-[4px_4px_0px_0px_#111827]' : 'bg-white hover:bg-gray-50'}`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-black text-sm">{r.name}</p>
                          {r.recommended && <span className="bg-yellow-300 text-gray-900 px-2 py-0.5 rounded-full text-xs font-black border border-gray-900">⭐ BEST</span>}
                        </div>
                        <div className="flex gap-3 text-xs font-bold opacity-80">
                          <span>🚗 {r.distance} km</span>
                          <span>⏱ {r.duration} min</span>
                          <span>💨 AQI {r.avgAQI}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Route detail */}
              {cur && (
                <div className="bg-white rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]">
                  <h4 className="font-black text-gray-900 mb-3">📊 Route Details</h4>
                  <div className="space-y-2">
                    {[
                      { label: 'Distance', value: `${cur.distance} km`, bg: 'bg-blue-50' },
                      { label: 'Duration', value: `${cur.duration} min`, bg: 'bg-purple-50' },
                      { label: 'Avg AQI', value: cur.avgAQI, bg: 'bg-orange-50' },
                      { label: 'Exposure', value: cur.exposureScore.toLocaleString(), bg: 'bg-pink-50' },
                    ].map(item => (
                      <div key={item.label} className={`flex justify-between p-3 ${item.bg} rounded-xl border-2 border-gray-900`}>
                        <span className="font-bold">{item.label}:</span>
                        <span className="font-black">{item.value}</span>
                      </div>
                    ))}
                  </div>
                  {cur.avgAQI > 100 && (
                    <div className="mt-3 bg-yellow-300 border-2 border-gray-900 rounded-xl p-3 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-gray-900 flex-shrink-0" />
                      <p className="text-sm font-bold text-gray-900">
                        {cur.avgAQI > 150 ? '⚠️ Unhealthy — wear N95 mask' : '⚠️ Moderate — take precautions'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Map panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-6 border-2 border-gray-900 shadow-[4px_4px_0px_0px_#111827]" style={{ height: '800px' }}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-black text-gray-900">🗺️ Route Map</h3>
                  {routes.length > 0 && <div className="bg-green-500 text-white px-4 py-1.5 rounded-xl border-2 border-gray-900 font-bold text-sm">{routes.length} routes found</div>}
                </div>
                <div ref={mapRef} className="w-full rounded-2xl border-2 border-gray-900 overflow-hidden relative" style={{ height: 'calc(100% - 56px)' }}>
                  {!mapboxKey && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                      <Key className="w-16 h-16 text-gray-400 mb-4" />
                      <p className="font-bold text-gray-600 mb-1">Mapbox API Key Required</p>
                      <p className="text-sm text-gray-500 mb-4">Add your key to see the map</p>
                      <button onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-5 py-2.5 rounded-xl font-bold border-2 border-gray-900 shadow-[2px_2px_0px_0px_#111827] hover:shadow-none transition-all">
                        Add API Key
                      </button>
                    </div>
                  )}
                  {loading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                        <p className="font-black text-gray-900 text-lg">Finding cleanest routes...</p>
                        <p className="text-sm text-gray-500">Checking air quality along your path</p>
                      </div>
                    </div>
                  )}
                  {/* AQI Color Legend */}
                  {routes.length > 0 && (
                    <div className="absolute bottom-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-xl border-2 border-gray-900 shadow-[3px_3px_0px_0px_#111827] px-3 py-2">
                      <p className="text-xs font-black text-gray-700 mb-1.5 uppercase tracking-wide">AQI Legend</p>
                      <div className="flex flex-col gap-1">
                        {[
                          { color: '#00C950', label: 'Good (≤50)' },
                          { color: '#FFB300', label: 'Moderate (≤100)' },
                          { color: '#FF6B00', label: 'Sensitive (≤150)' },
                          { color: '#E53935', label: 'Unhealthy (≤200)' },
                          { color: '#7B1FA2', label: 'Hazardous (>200)' },
                          { color: '#6366F1', label: 'Selected Route' },
                        ].map(({ color, label }) => (
                          <div key={label} className="flex items-center gap-2">
                            <div className="w-6 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}` }} />
                            <span className="text-xs font-semibold text-gray-700">{label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Routes;