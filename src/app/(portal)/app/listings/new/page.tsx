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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Loader2, MapPin, Search, Plus, X, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { calculateLeadScore } from '@/lib/scoring';
import { DatePicker } from '@/components/ui/date-picker';
import { getCitiesForBoard, getNeighborhoodsForCity } from '@/lib/locations';
import type { PropertyType } from '@/types';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Vancouver area center coordinates
const VANCOUVER_CENTER: [number, number] = [-123.1207, 49.2827];

// Map board values to location data keys
const getBoardKey = (board: string) => {
  const mapping: Record<string, string> = {
    'greater_vancouver': 'Greater Vancouver',
    'fraser_valley': 'Fraser Valley',
    'chilliwack': 'Chilliwack',
  };
  return mapping[board] || '';
};

export default function NewListingPage() {
  const router = useRouter();
  const supabase = createClient();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);

  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateListing, setDuplicateListing] = useState<{ id: string; address: string; city: string; expiry_date: string } | null>(null);
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
    property_type: '',
    owner_names: [''],
    owner_phone: '',
    owner_email: '',
    notes: '',
    latitude: VANCOUVER_CENTER[1],
    longitude: VANCOUVER_CENTER[0],
  });

  // Get available cities based on selected board
  const availableCities = getCitiesForBoard(getBoardKey(formData.board));

  // Get available neighborhoods based on selected board and city
  const availableNeighborhoods = formData.city
    ? getNeighborhoodsForCity(getBoardKey(formData.board), formData.city)
    : [];

  // Handle board change - reset city and neighborhood
  const handleBoardChange = (value: string) => {
    setFormData({ ...formData, board: value, city: '', neighborhood: '' });
  };

  // Handle city change - reset neighborhood
  const handleCityChange = (value: string) => {
    setFormData({ ...formData, city: value, neighborhood: '' });
  };

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

  // Check for duplicate addresses
  const checkForDuplicate = async (): Promise<{ id: string; address: string; city: string; expiry_date: string } | null> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Normalize the address for comparison (lowercase, trim whitespace)
    const normalizedAddress = formData.address.toLowerCase().trim();
    const normalizedCity = formData.city.toLowerCase().trim();

    const { data: existingListings } = await supabase
      .from('listings')
      .select('id, address, city, expiry_date')
      .eq('user_id', user.id)
      .ilike('address', normalizedAddress)
      .ilike('city', normalizedCity);

    if (existingListings && existingListings.length > 0) {
      return existingListings[0];
    }

    return null;
  };

  // Actually create the listing
  const createListing = async () => {
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

    // Calculate lead score
    const parsedPrice = formData.price ? parseFloat(formData.price.replace(/,/g, '')) : null;
    const score = calculateLeadScore({
      expiry_date: formData.expiry_date,
      price: parsedPrice,
      property_type: (formData.property_type || null) as PropertyType | null,
      city: formData.city,
      owner_name: formData.owner_names.filter(name => name.trim()).join(', ') || null,
      owner_phone: formData.owner_phone || null,
      owner_email: formData.owner_email || null,
    });

    const { error } = await supabase.from('listings').insert({
      user_id: user.id,
      address: formData.address,
      city: formData.city,
      neighborhood: formData.neighborhood || null,
      board: formData.board,
      listing_type: formData.listing_type,
      status: formData.listing_type,
      expiry_date: formData.expiry_date,
      price: parsedPrice,
      bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
      bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
      square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
      mls_number: formData.mls_number || null,
      property_type: formData.property_type && formData.property_type !== '' ? formData.property_type : null,
      owner_name: formData.owner_names.filter(name => name.trim()).join(', ') || null,
      owner_phone: formData.owner_phone || null,
      owner_email: formData.owner_email || null,
      notes: formData.notes || null,
      latitude: finalLat,
      longitude: finalLng,
      score: score,
      stage: 'new',
    });

    if (error) {
      toast.error(`Failed to create listing: ${error.message}`);
      console.error('Supabase error:', error);
      console.error('Error details:', error.details, error.hint, error.code);
    } else {
      toast.success('Listing created successfully');
      router.push('/listings');
    }
    setLoading(false);
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

    // Check for duplicate address
    const duplicate = await checkForDuplicate();
    if (duplicate) {
      setDuplicateListing(duplicate);
      setShowDuplicateDialog(true);
      setLoading(false);
      return;
    }

    // No duplicate found, proceed with creation
    await createListing();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/app/listings">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
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
                        className="shrink-0 cursor-pointer"
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
                    <Label htmlFor="board">Board *</Label>
                    <Select
                      value={formData.board}
                      onValueChange={handleBoardChange}
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
                    <Label htmlFor="city">City *</Label>
                    <Select
                      value={formData.city}
                      onValueChange={handleCityChange}
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Region</Label>
                    <Select
                      value={formData.neighborhood}
                      onValueChange={(value) => setFormData({ ...formData, neighborhood: value })}
                      disabled={!formData.city}
                    >
                      <SelectTrigger className="bg-input border-border">
                        <SelectValue placeholder="Select region" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableNeighborhoods.map((neighborhood) => (
                          <SelectItem key={neighborhood} value={neighborhood}>
                            {neighborhood}
                          </SelectItem>
                        ))}
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
                    <DatePicker
                      value={formData.expiry_date}
                      onChange={(value) => setFormData({ ...formData, expiry_date: value })}
                      placeholder="Select date"
                      className="w-full"
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
                <div className="space-y-2">
                  <Label htmlFor="property_type">Property Type</Label>
                  <Select
                    value={formData.property_type}
                    onValueChange={(value) => setFormData({ ...formData, property_type: value })}
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="row_home">Row Home</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                      <Input
                        id="price"
                        type="text"
                        value={formData.price}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9]/g, '');
                          const formatted = value ? parseInt(value).toLocaleString() : '';
                          setFormData({ ...formData, price: formatted });
                        }}
                        placeholder="599,000"
                        className="bg-input border-border pl-7"
                      />
                    </div>
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
                <CardDescription>Contact details for the property owner(s)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Owner Name(s)</Label>
                  <div className="space-y-2">
                    {formData.owner_names.map((name, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={name}
                          onChange={(e) => {
                            const newNames = [...formData.owner_names];
                            newNames[index] = e.target.value;
                            setFormData({ ...formData, owner_names: newNames });
                          }}
                          placeholder={index === 0 ? "John Doe" : "Jane Doe"}
                          className="bg-input border-border"
                        />
                        {formData.owner_names.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              const newNames = formData.owner_names.filter((_, i) => i !== index);
                              setFormData({ ...formData, owner_names: newNames });
                            }}
                            className="shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData({ ...formData, owner_names: [...formData.owner_names, ''] });
                      }}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Owner
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Link href="/app/listings">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={loading}
            className="btn-glow"
          >
            <span className="relative z-10 flex items-center">
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
            </span>
          </Button>
        </div>
      </form>

      {/* Duplicate Listing Dialog */}
      <AlertDialog open={showDuplicateDialog} onOpenChange={setShowDuplicateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Duplicate Listing Found
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3">
                <p>A listing with this address already exists in your account:</p>
                {duplicateListing && (
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="font-medium">{duplicateListing.address}</p>
                    <p className="text-sm text-muted-foreground">{duplicateListing.city}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Expiry Date: {new Date(duplicateListing.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <p>Do you want to create another listing for this address anyway?</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDuplicateListing(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDuplicateDialog(false);
                setDuplicateListing(null);
                createListing();
              }}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Create Anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
