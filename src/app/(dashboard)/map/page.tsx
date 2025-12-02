'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RefreshCw,
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  Home,
  X,
  ExternalLink,
  Send,
  Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Link from 'next/link';
import type { Listing } from '@/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Board center coordinates
const BOARD_CENTERS = {
  all: { center: [-122.8, 49.15] as [number, number], zoom: 9 },
  greater_vancouver: { center: [-123.1, 49.25] as [number, number], zoom: 10 },
  fraser_valley: { center: [-122.3, 49.05] as [number, number], zoom: 10 },
  chilliwack: { center: [-121.95, 49.15] as [number, number], zoom: 11 },
};

export default function MapPage() {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBoard, setSelectedBoard] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const supabase = createClient();

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    let query = supabase
      .from('listings')
      .select('*')
      .eq('user_id', user?.id);

    if (selectedBoard !== 'all') {
      query = query.eq('board', selectedBoard);
    }
    if (selectedType !== 'all') {
      if (selectedType === 'active') {
        query = query.eq('status', 'active');
      } else {
        query = query.eq('listing_type', selectedType).neq('status', 'active');
      }
    }

    const { data, error } = await query;

    if (error) {
      toast.error('Failed to fetch listings');
    } else {
      setListings(data || []);
    }
    setLoading(false);
  }, [selectedBoard, selectedType]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: BOARD_CENTERS.all.center,
      zoom: BOARD_CENTERS.all.zoom,
      pitch: 45,
      bearing: -10,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);

      // Add a source for the listing clusters
      map.current?.addSource('listings', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      });

      // Cluster outer glow (largest, most transparent)
      map.current?.addLayer({
        id: 'clusters-glow-3',
        type: 'circle',
        source: 'listings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#93c5fd',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            35,
            10,
            50,
            30,
            65,
          ],
          'circle-opacity': 0.15,
          'circle-blur': 1,
        },
      });

      // Cluster middle glow
      map.current?.addLayer({
        id: 'clusters-glow-2',
        type: 'circle',
        source: 'listings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#bfdbfe',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            25,
            10,
            38,
            30,
            50,
          ],
          'circle-opacity': 0.3,
          'circle-blur': 0.5,
        },
      });

      // Cluster core
      map.current?.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'listings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#93c5fd', // blue-300 powder blue for small clusters
            10,
            '#bfdbfe', // blue-200 for medium clusters
            30,
            '#dbeafe', // blue-100 for large clusters
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            18,
            10,
            26,
            30,
            34,
          ],
          'circle-opacity': 0.9,
        },
      });

      // Cluster count labels
      map.current?.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'listings',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 13,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      // Individual point outer glow (hotspot effect)
      map.current?.addLayer({
        id: 'unclustered-point-glow-3',
        type: 'circle',
        source: 'listings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'active'],
            '#22c55e',
            ['==', ['get', 'listing_type'], 'expired'],
            '#f43f5e',
            '#8b5cf6',
          ],
          'circle-radius': 28,
          'circle-opacity': 0.15,
          'circle-blur': 1,
        },
      });

      // Individual point middle glow
      map.current?.addLayer({
        id: 'unclustered-point-glow-2',
        type: 'circle',
        source: 'listings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'active'],
            '#4ade80',
            ['==', ['get', 'listing_type'], 'expired'],
            '#fb7185',
            '#a78bfa',
          ],
          'circle-radius': 18,
          'circle-opacity': 0.3,
          'circle-blur': 0.5,
        },
      });

      // Individual point inner glow
      map.current?.addLayer({
        id: 'unclustered-point-glow-1',
        type: 'circle',
        source: 'listings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'active'],
            '#86efac',
            ['==', ['get', 'listing_type'], 'expired'],
            '#fda4af',
            '#c4b5fd',
          ],
          'circle-radius': 12,
          'circle-opacity': 0.5,
          'circle-blur': 0.3,
        },
      });

      // Individual point core (bright center)
      map.current?.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'listings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'case',
            ['==', ['get', 'status'], 'active'],
            '#bbf7d0',
            ['==', ['get', 'listing_type'], 'expired'],
            '#fecdd3',
            '#ddd6fe',
          ],
          'circle-radius': 6,
          'circle-opacity': 1,
        },
      });

      // Create popup for hover
      popup.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'listing-popup',
        offset: 15,
      });

      // Cursor change on hover for clusters
      map.current?.on('mouseenter', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';
      });
      map.current?.on('mouseleave', 'clusters', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
      });

      // Hover popup for individual points
      map.current?.on('mouseenter', 'unclustered-point', (e) => {
        if (map.current) map.current.getCanvas().style.cursor = 'pointer';

        if (!e.features?.length || !popup.current) return;
        const feature = e.features[0];
        if (feature.geometry.type !== 'Point') return;

        const coordinates = feature.geometry.coordinates.slice() as [number, number];
        const props = feature.properties;

        // Get status color
        const statusColor = props?.status === 'active'
          ? '#22c55e'
          : props?.listing_type === 'expired'
            ? '#f43f5e'
            : '#8b5cf6';

        const statusText = props?.status === 'active'
          ? 'Active'
          : props?.listing_type === 'expired'
            ? 'Expired'
            : 'Terminated';

        // Create popup HTML
        const html = `
          <div style="
            background: rgba(23, 23, 23, 0.95);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 8px;
            padding: 12px;
            min-width: 180px;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: ${statusColor};"></div>
              <span style="font-size: 11px; color: ${statusColor}; font-weight: 500; text-transform: uppercase;">${statusText}</span>
            </div>
            <div style="font-weight: 600; color: #fff; font-size: 13px; margin-bottom: 4px;">
              ${props?.address || 'Unknown Address'}
            </div>
            <div style="color: #a1a1aa; font-size: 12px;">
              ${props?.city || ''}
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 11px; color: #71717a;">
              Click to view details
            </div>
          </div>
        `;

        popup.current
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(map.current!);
      });

      map.current?.on('mouseleave', 'unclustered-point', () => {
        if (map.current) map.current.getCanvas().style.cursor = '';
        popup.current?.remove();
      });

      // Click on cluster to zoom
      map.current?.on('click', 'clusters', (e) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ['clusters'],
        });
        if (!features?.length) return;
        const clusterId = features[0].properties?.cluster_id;
        const source = map.current?.getSource('listings') as mapboxgl.GeoJSONSource;
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !features[0].geometry || features[0].geometry.type !== 'Point') return;
          map.current?.easeTo({
            center: features[0].geometry.coordinates as [number, number],
            zoom: zoom || 12,
          });
        });
      });

      // Click on individual point - navigate to listing page
      map.current?.on('click', 'unclustered-point', (e) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point'],
        });
        if (!features?.length) return;
        const props = features[0].properties;
        if (props?.id) {
          // Remove popup before navigating
          popup.current?.remove();
          // Navigate to the listing detail page
          router.push(`/listings/${props.id}`);
        }
      });

      // Subtle pulsing animation for individual point outer glow
      let pulsePhase = 0;
      const pulseInterval = setInterval(() => {
        if (!map.current?.getLayer('unclustered-point-glow-2')) return;

        pulsePhase += 0.08; // Faster increment for more visible effect
        const pulseValue = Math.sin(pulsePhase) * 0.15 + 0.35; // Oscillate between 0.20 and 0.50
        const radiusValue = Math.sin(pulsePhase) * 4 + 18; // Oscillate between 14 and 22

        map.current?.setPaintProperty('unclustered-point-glow-2', 'circle-opacity', pulseValue);
        map.current?.setPaintProperty('unclustered-point-glow-2', 'circle-radius', radiusValue);
      }, 50);

      // Store interval ID for cleanup
      (map.current as mapboxgl.Map & { pulseInterval?: NodeJS.Timeout }).pulseInterval = pulseInterval;
    });

    return () => {
      const mapInstance = map.current as mapboxgl.Map & { pulseInterval?: NodeJS.Timeout } | null;
      if (mapInstance?.pulseInterval) {
        clearInterval(mapInstance.pulseInterval);
      }
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Update map data when listings change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const source = map.current.getSource('listings') as mapboxgl.GeoJSONSource;
    if (!source) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: listings.map((listing) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [listing.longitude, listing.latitude],
        },
        properties: {
          id: listing.id,
          address: listing.address,
          city: listing.city,
          status: listing.status,
          listing_type: listing.listing_type,
        },
      })),
    };

    source.setData(geojson);
  }, [listings, mapLoaded]);

  // Update map view when board changes
  useEffect(() => {
    if (!map.current) return;
    const boardConfig = BOARD_CENTERS[selectedBoard as keyof typeof BOARD_CENTERS] || BOARD_CENTERS.all;
    map.current.flyTo({
      center: boardConfig.center,
      zoom: boardConfig.zoom,
      duration: 1500,
    });
  }, [selectedBoard]);

  const handleZoomIn = () => map.current?.zoomIn();
  const handleZoomOut = () => map.current?.zoomOut();
  const handleReset = () => {
    const boardConfig = BOARD_CENTERS[selectedBoard as keyof typeof BOARD_CENTERS] || BOARD_CENTERS.all;
    map.current?.flyTo({
      center: boardConfig.center,
      zoom: boardConfig.zoom,
      pitch: 45,
      bearing: -10,
      duration: 1500,
    });
  };

  const getStatusColor = (listing: Listing) => {
    if (listing.status === 'active') return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (listing.listing_type === 'expired') return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
    return 'bg-violet-500/10 text-violet-500 border-violet-500/20';
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Map View
          </h1>
          <p className="text-muted-foreground mt-1">
            Visualize expired and terminated listings across Greater Vancouver, Fraser Valley, and Chilliwack
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <Select value={selectedBoard} onValueChange={setSelectedBoard}>
              <SelectTrigger className="w-[180px] bg-input border-border">
                <SelectValue placeholder="Select Board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Boards</SelectItem>
                <SelectItem value="greater_vancouver">Greater Vancouver</SelectItem>
                <SelectItem value="fraser_valley">Fraser Valley</SelectItem>
                <SelectItem value="chilliwack">Chilliwack</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[160px] bg-input border-border">
                <SelectValue placeholder="Listing Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="active">Active</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchListings}
              disabled={loading}
              className="border-border"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>

            <div className="flex-1" />

            {/* Legend */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="text-muted-foreground">Expired</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-violet-500" />
                <span className="text-muted-foreground">Terminated</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-muted-foreground">Active</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Container */}
      <div className="flex-1 min-h-[500px] relative rounded-lg overflow-hidden border border-border/50">
        <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

        {/* Map Controls */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomIn}
            className="bg-card/90 backdrop-blur-sm border border-border"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleZoomOut}
            className="bg-card/90 backdrop-blur-sm border border-border"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={handleReset}
            className="bg-card/90 backdrop-blur-sm border border-border"
          >
            <Home className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg border border-border p-3">
          <p className="text-sm font-medium">{listings.length} listings</p>
          <p className="text-xs text-muted-foreground">
            {selectedBoard === 'all' ? 'All boards' : selectedBoard.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </p>
        </div>

        {/* Selected Listing Panel */}
        {selectedListing && (
          <div className="absolute top-4 right-4 w-80 bg-card/95 backdrop-blur-sm rounded-lg border border-border shadow-xl">
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      selectedListing.status === 'active'
                        ? 'bg-green-500'
                        : selectedListing.listing_type === 'expired'
                          ? 'bg-rose-500'
                          : 'bg-violet-500'
                    }`}
                  />
                  <Badge className={getStatusColor(selectedListing)}>
                    {selectedListing.status === 'active'
                      ? 'Active'
                      : selectedListing.listing_type}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setSelectedListing(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="mt-3 space-y-2">
                <h3 className="font-semibold">{selectedListing.address}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedListing.city}
                  {selectedListing.neighborhood && `, ${selectedListing.neighborhood}`}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                  {selectedListing.price && (
                    <div>
                      <span className="text-muted-foreground">Price:</span>
                      <span className="ml-1 font-medium">
                        ${selectedListing.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Expiry:</span>
                    <span className="ml-1">
                      {format(new Date(selectedListing.expiry_date), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {selectedListing.bedrooms && (
                    <div>
                      <span className="text-muted-foreground">Beds:</span>
                      <span className="ml-1">{selectedListing.bedrooms}</span>
                    </div>
                  )}
                  {selectedListing.bathrooms && (
                    <div>
                      <span className="text-muted-foreground">Baths:</span>
                      <span className="ml-1">{selectedListing.bathrooms}</span>
                    </div>
                  )}
                </div>

                {selectedListing.sent_at && (
                  <div className="flex items-center gap-1.5 text-sm text-primary mt-2">
                    <Send className="w-3.5 h-3.5" />
                    Sent on {format(new Date(selectedListing.sent_at), 'MMM d, yyyy')}
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Link href={`/listings/${selectedListing.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-border"
                  >
                    <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                    View Details
                  </Button>
                </Link>
                <Link href={`/follow-ups?listing=${selectedListing.id}`}>
                  <Button variant="secondary" size="sm">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    Follow-up
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
