'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Listing } from '@/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface DashboardMapPreviewProps {
  listings: Listing[];
}

export function DashboardMapPreview({ listings }: DashboardMapPreviewProps) {
  const router = useRouter();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-122.8, 49.15],
      zoom: 9,
      pitch: 30,
      interactive: true,
      attributionControl: false,
    });

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

      // Cluster outer glow
      map.current?.addLayer({
        id: 'clusters-glow-3',
        type: 'circle',
        source: 'listings',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#8b5cf6',
          'circle-radius': ['step', ['get', 'point_count'], 30, 10, 40, 30, 50],
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
          'circle-color': '#a855f7',
          'circle-radius': ['step', ['get', 'point_count'], 22, 10, 30, 30, 40],
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
            '#8b5cf6',
            10,
            '#a855f7',
            30,
            '#c084fc',
          ],
          'circle-radius': ['step', ['get', 'point_count'], 15, 10, 22, 30, 28],
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
          'text-size': 12,
        },
        paint: {
          'text-color': '#ffffff',
        },
      });

      // Individual point outer glow
      map.current?.addLayer({
        id: 'unclustered-point-glow-2',
        type: 'circle',
        source: 'listings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'status'],
            'active',
            '#22c55e',
            'expired',
            '#f97316',
            'terminated',
            '#eab308',
            '#6366f1',
          ],
          'circle-radius': 16,
          'circle-opacity': 0.2,
          'circle-blur': 0.8,
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
            'match',
            ['get', 'status'],
            'active',
            '#4ade80',
            'expired',
            '#fb923c',
            'terminated',
            '#facc15',
            '#818cf8',
          ],
          'circle-radius': 10,
          'circle-opacity': 0.4,
          'circle-blur': 0.4,
        },
      });

      // Individual point core
      map.current?.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'listings',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'status'],
            'active',
            '#bbf7d0',
            'expired',
            '#fed7aa',
            'terminated',
            '#fef08a',
            '#c7d2fe',
          ],
          'circle-radius': 5,
          'circle-opacity': 1,
        },
      });

      // Create popup for hover
      popup.current = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'listing-popup',
        offset: 12,
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
            ? '#f97316'
            : '#eab308';

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
            padding: 10px;
            min-width: 160px;
            font-family: system-ui, -apple-system, sans-serif;
          ">
            <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 6px;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: ${statusColor};"></div>
              <span style="font-size: 10px; color: ${statusColor}; font-weight: 500; text-transform: uppercase;">${statusText}</span>
            </div>
            <div style="font-weight: 600; color: #fff; font-size: 12px; margin-bottom: 3px;">
              ${props?.address || 'Unknown Address'}
            </div>
            <div style="color: #a1a1aa; font-size: 11px;">
              ${props?.city || ''}
            </div>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 10px; color: #71717a;">
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

      // Click on individual point - navigate to listing page
      map.current?.on('click', 'unclustered-point', (e) => {
        const features = map.current?.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point'],
        });
        if (!features?.length) return;
        const props = features[0].properties;
        if (props?.id) {
          popup.current?.remove();
          router.push(`/listings/${props.id}`);
        }
      });

      // Subtle pulsing animation for individual point outer glow
      let pulsePhase = 0;
      const pulseInterval = setInterval(() => {
        if (!map.current?.getLayer('unclustered-point-glow-2')) return;

        pulsePhase += 0.08; // Faster increment for more visible effect
        const pulseValue = Math.sin(pulsePhase) * 0.12 + 0.30; // Oscillate between 0.18 and 0.42
        const radiusValue = Math.sin(pulsePhase) * 3 + 16; // Oscillate between 13 and 19

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

    // Fit bounds if we have listings
    if (listings.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      listings.forEach((listing) => {
        bounds.extend([listing.longitude, listing.latitude]);
      });
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 12,
        duration: 1000,
      });
    }
  }, [listings, mapLoaded]);

  const expiredCount = listings.filter(
    (l) => l.listing_type === 'expired' && l.status !== 'active'
  ).length;
  const terminatedCount = listings.filter(
    (l) => l.listing_type === 'terminated' && l.status !== 'active'
  ).length;
  const activeCount = listings.filter((l) => l.status === 'active').length;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          Listings Map
        </CardTitle>
        <Link
          href="/map"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Open full map
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative h-[280px] rounded-b-lg overflow-hidden">
          <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

          {/* Legend overlay */}
          <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-3 py-2">
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">{expiredCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">{terminatedCount}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-muted-foreground">{activeCount}</span>
            </div>
          </div>

          {/* Total count */}
          <div className="absolute top-3 right-3 bg-card/90 backdrop-blur-sm rounded-lg border border-border px-3 py-1.5">
            <p className="text-sm font-medium">{listings.length} listings</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
