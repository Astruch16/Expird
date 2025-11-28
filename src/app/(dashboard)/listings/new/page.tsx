'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, MapPin, Search } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Vancouver area center coordinates
const VANCOUVER_CENTER: [number, number] = [-123.1207, 49.2827];

export default function NewListingPage() {
  const router = useRouter();
  const supabase = createClient();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    neighborhood: '',
    board: 'greater_vancouver',
    listing_type: 'expired',
    expiry_date: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    mls_number: '',
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    notes: '',
    latitude: VANCOUVER_CENTER[1],
    longitude: VANCOUVER_CENTER[0],
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [formData.longitude, formData.latitude],
      zoom: 10,
    });

    marker.current = new mapboxgl.Marker({
      color: '#6366f1',
      draggable: true,
    })
      .setLngLat([formData.longitude, formData.latitude])
      .addTo(map.current);

    marker.current.on('dragend', () => {
      const lngLat = marker.current?.getLngLat();
      if (lngLat) {
        setFormData((prev) => ({
          ...prev,
          latitude: lngLat.lat,
          longitude: lngLat.lng,
        }));
      }
    });

    map.current.on('click', (e) => {
      marker.current?.setLngLat(e.lngLat);
      setFormData((prev) => ({
        ...prev,
        latitude: e.lngLat.lat,
        longitude: e.lngLat.lng,
      }));
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  const geocodeAddress = async (showToast = true): Promise<{ lat: number; lng: number } | null> => {
    if (!formData.address || !formData.city) {
      if (showToast) toast.error('Please enter an address and city');
      return null;
    }

    setGeocoding(true);
    try {
      const query = `${formData.address}, ${formData.city}, BC, Canada`;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}&country=CA`
      );
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        marker.current?.setLngLat([lng, lat]);
        map.current?.flyTo({ center: [lng, lat], zoom: 15 });
        if (showToast) toast.success('Location found and updated');
        setGeocoding(false);
        return { lat, lng };
      } else {
        if (showToast) toast.error('Could not find address. Please adjust the pin manually.');
      }
    } catch (error) {
      if (showToast) toast.error('Failed to geocode address');
    }
    setGeocoding(false);
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error('You must be logged in');
      setLoading(false);
      return;
    }

    // Auto-geocode if coordinates are still at default Vancouver center
    let finalLat = formData.latitude;
    let finalLng = formData.longitude;

    const isDefaultLocation =
      formData.latitude === VANCOUVER_CENTER[1] &&
      formData.longitude === VANCOUVER_CENTER[0];

    if (isDefaultLocation && formData.address && formData.city) {
      const coords = await geocodeAddress(false);
      if (coords) {
        finalLat = coords.lat;
        finalLng = coords.lng;
      }
    }

    const { error } = await supabase.from('listings').insert({
      user_id: user.id,
      address: formData.address,
      city: formData.city,
      neighborhood: formData.neighborhood || null,
      board: formData.board,
      listing_type: formData.listing_type,
      status: formData.listing_type,
      expiry_date: formData.expiry_date,
      price: formData.price ? parseFloat(formData.price) : null,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
      square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
      mls_number: formData.mls_number || null,
      owner_name: formData.owner_name || null,
      owner_phone: formData.owner_phone || null,
      owner_email: formData.owner_email || null,
      notes: formData.notes || null,
      latitude: finalLat,
      longitude: finalLng,
    });

    if (error) {
      toast.error('Failed to create listing');
      console.error(error);
    } else {
      toast.success('Listing created successfully');
      router.push('/listings');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/listings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Add New Listing
          </h1>
          <p className="text-muted-foreground mt-1">
            Enter the details of the expired or terminated listing
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-6">
            {/* Basic Info */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Property Information</CardTitle>
                <CardDescription>Enter the basic property details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="123 Main Street"
                        className="bg-input border-border"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={geocodeAddress}
                        disabled={geocoding}
                        className="shrink-0"
                      >
                        {geocoding ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Vancouver"
                      className="bg-input border-border"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Neighborhood</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      placeholder="Kitsilano"
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="board">Board *</Label>
                    <Select
                      value={formData.board}
                      onValueChange={(value) => setFormData({ ...formData, board: value })}
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="greater_vancouver">Greater Vancouver</SelectItem>
                        <SelectItem value="fraser_valley">Fraser Valley</SelectItem>
                        <SelectItem value="chilliwack">Chilliwack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="listing_type">Listing Type *</Label>
                    <Select
                      value={formData.listing_type}
                      onValueChange={(value) => setFormData({ ...formData, listing_type: value })}
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="expired">Expired</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiry_date">Expiry/Termination Date *</Label>
                    <Input
                      id="expiry_date"
                      type="date"
                      value={formData.expiry_date}
                      onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                      className="bg-input border-border"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mls_number">MLS Number</Label>
                    <Input
                      id="mls_number"
                      value={formData.mls_number}
                      onChange={(e) => setFormData({ ...formData, mls_number: e.target.value })}
                      placeholder="R2123456"
                      className="bg-input border-border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
                <CardDescription>Optional property specifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="599000"
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Beds</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                      placeholder="3"
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Baths</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                      placeholder="2"
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="square_feet">Sq Ft</Label>
                    <Input
                      id="square_feet"
                      type="number"
                      value={formData.square_feet}
                      onChange={(e) => setFormData({ ...formData, square_feet: e.target.value })}
                      placeholder="1500"
                      className="bg-input border-border"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Owner Information</CardTitle>
                <CardDescription>Contact details for the property owner</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner_name">Name</Label>
                    <Input
                      id="owner_name"
                      value={formData.owner_name}
                      onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                      placeholder="John Doe"
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner_phone">Phone</Label>
                    <Input
                      id="owner_phone"
                      value={formData.owner_phone}
                      onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                      placeholder="604-555-0123"
                      className="bg-input border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="owner_email">Email</Label>
                    <Input
                      id="owner_email"
                      type="email"
                      value={formData.owner_email}
                      onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                      placeholder="owner@email.com"
                      className="bg-input border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Any additional notes about this listing..."
                    className="bg-input border-border min-h-[100px]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Map */}
          <div className="space-y-6">
            <Card className="border-border/50 bg-card/50 backdrop-blur-sm sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Location
                </CardTitle>
                <CardDescription>
                  Click on the map or drag the marker to set the exact location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  ref={mapContainer}
                  className="w-full h-[400px] rounded-lg overflow-hidden border border-border"
                />
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="p-2 rounded bg-input">
                    <span className="text-muted-foreground">Lat: </span>
                    <span className="font-mono">{formData.latitude.toFixed(6)}</span>
                  </div>
                  <div className="p-2 rounded bg-input">
                    <span className="text-muted-foreground">Lng: </span>
                    <span className="font-mono">{formData.longitude.toFixed(6)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Link href="/listings">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <MapPin className="w-4 h-4 mr-2" />
                Create Listing
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
