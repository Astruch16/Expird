'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { createClient } from '@/lib/supabase/client';
import { calculateLeadScore } from '@/lib/scoring';
import { findLocationForNeighborhood, locationData } from '@/lib/locations';
import { PropertyType, Board } from '@/types';
import { toast } from 'sonner';
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  X,
  MapPin,
  DollarSign,
  Home,
  Calendar,
  Hash,
} from 'lucide-react';

interface ParsedListing {
  mlsNumber: string;
  address: string;
  neighborhood: string;
  price: number | null;
  dom: number | null;
  bedrooms: number | null;
  yearBuilt: number | null;
  lotSize: number | null;
  propertyType: PropertyType | null;
  propTypeRaw: string;
  dwellingType: string;
  listingStatus: 'expired' | 'terminated' | 'cancel_protected';
  cancelProtectedDate: string | null;
  // Mapped fields
  city: string | null;
  board: Board | null;
  valid: boolean;
  error?: string;
}

// Map Paragon TypeDwel to our property types
function mapPropertyType(propType: string, dwelType: string): PropertyType | null {
  const dwel = dwelType?.toUpperCase() || '';
  const prop = propType?.toLowerCase() || '';

  if (dwel === 'HOUSE' || dwel === 'DETACH' || prop.includes('detached')) return 'house';
  if (dwel === 'TWNHS' || dwel === 'TOWNHOUSE' || prop.includes('townhouse')) return 'townhouse';
  if (dwel === 'ROW' || dwel === 'ROWHOME' || prop.includes('row')) return 'row_home';
  if (dwel === 'CONDO' || dwel === 'APT' || dwel === 'APARTMENT' || prop.includes('condo') || prop.includes('apartment')) return 'condo';
  if (dwel === 'MOBILE' || dwel === 'MANUF' || prop.includes('mobile') || prop.includes('manufactured')) return 'mobile';

  // Check property type column for attached/detached
  if (prop.includes('attached') && !prop.includes('detached')) return 'townhouse';
  if (prop.includes('detached')) return 'house';

  return null;
}

// Map board name to our Board type
function mapBoardToType(boardName: string): Board | null {
  const name = boardName.toLowerCase();
  if (name.includes('greater vancouver') || name === 'greater vancouver') return 'greater_vancouver';
  if (name.includes('fraser valley') || name === 'fraser valley') return 'fraser_valley';
  if (name.includes('chilliwack') || name === 'chilliwack') return 'chilliwack';
  return null;
}

// Try to find the location from the S/A (sub-area) field
function findLocation(subArea: string): { city: string; board: Board; neighborhood: string } | null {
  if (!subArea) return null;

  const trimmedArea = subArea.trim();

  // First, try exact neighborhood match
  const location = findLocationForNeighborhood(trimmedArea);
  if (location) {
    const board = mapBoardToType(location.board);
    if (board) {
      return {
        city: location.city,
        board,
        neighborhood: trimmedArea,
      };
    }
  }

  // Try partial matching - the S/A might be a city name
  for (const [boardName, cities] of Object.entries(locationData)) {
    for (const [cityName, neighborhoods] of Object.entries(cities)) {
      // Check if S/A matches city name
      if (cityName.toLowerCase() === trimmedArea.toLowerCase()) {
        const board = mapBoardToType(boardName);
        if (board) {
          return {
            city: cityName,
            board,
            neighborhood: trimmedArea,
          };
        }
      }

      // Check if S/A partially matches a neighborhood
      for (const neighborhood of neighborhoods) {
        if (neighborhood.toLowerCase().includes(trimmedArea.toLowerCase()) ||
            trimmedArea.toLowerCase().includes(neighborhood.toLowerCase())) {
          const board = mapBoardToType(boardName);
          if (board) {
            return {
              city: cityName,
              board,
              neighborhood: neighborhood,
            };
          }
        }
      }
    }
  }

  return null;
}

// Parse price string to number
function parsePrice(priceStr: string): number | null {
  if (!priceStr) return null;
  const cleaned = priceStr.replace(/[$,]/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

// Parse number fields
function parseNumber(val: string): number | null {
  if (!val) return null;
  const cleaned = val.replace(/,/g, '');
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

export default function ImportListingsPage() {
  const router = useRouter();
  const supabase = createClient();

  const [file, setFile] = useState<File | null>(null);
  const [parsedListings, setParsedListings] = useState<ParsedListing[]>([]);
  const [selectedListings, setSelectedListings] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [step, setStep] = useState<'upload' | 'review' | 'complete'>('upload');
  const [importResults, setImportResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      parseCSV(selectedFile);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.csv'))) {
      setFile(droppedFile);
      parseCSV(droppedFile);
    } else {
      toast.error('Please upload a CSV file');
    }
  }, []);

  const parseCSV = (csvFile: File) => {
    setIsProcessing(true);

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const listings: ParsedListing[] = [];

        for (const row of results.data as Record<string, string>[]) {
          // Map CSV columns to our fields
          // Expected columns: ML #, Prop Type, Status, Address, S/A, Price, DOM, Tot BR, Yr Blt, Lot Sz(SF), TypeDwel
          const mlsNumber = row['ML #'] || row['MLS #'] || row['MLS'] || '';
          const address = row['Address'] || '';
          const subArea = row['S/A'] || row['Sub-Area'] || row['Neighborhood'] || '';
          const priceStr = row['Price'] || row['List Price'] || '';
          const domStr = row['DOM'] || row['Days on Market'] || '';
          const bedroomsStr = row['Tot BR'] || row['Bedrooms'] || row['BR'] || '';
          const yearBuiltStr = row['Yr Blt'] || row['Year Built'] || '';
          const lotSizeStr = row['Lot Sz(SF)'] || row['Lot Size'] || '';
          const propType = row['Prop Type'] || row['Property Type'] || '';
          const dwelType = row['TypeDwel'] || row['Dwelling Type'] || row['Type'] || '';
          const statusCode = (row['Status'] || '').trim().toUpperCase();

          // Skip rows without essential data
          if (!mlsNumber && !address) continue;

          const location = findLocation(subArea);
          const propertyType = mapPropertyType(propType, dwelType);
          // Map status: X = expired, T = terminated, C/CP = cancel protected
          // T or TERMINATED = terminated, C/CP/CANCEL = cancel_protected, everything else (X, EXPIRED, etc.) = expired
          let listingStatus: 'expired' | 'terminated' | 'cancel_protected' = 'expired';
          if (statusCode === 'T' || statusCode === 'TERMINATED') {
            listingStatus = 'terminated';
          } else if (statusCode === 'C' || statusCode === 'CP' || statusCode === 'CANCEL' || statusCode === 'CANCEL PROTECTED') {
            listingStatus = 'cancel_protected';
          }

          const listing: ParsedListing = {
            mlsNumber,
            address,
            neighborhood: location?.neighborhood || subArea,
            price: parsePrice(priceStr),
            dom: parseNumber(domStr),
            bedrooms: parseNumber(bedroomsStr),
            yearBuilt: parseNumber(yearBuiltStr),
            lotSize: parseNumber(lotSizeStr),
            propertyType,
            propTypeRaw: propType,
            dwellingType: dwelType,
            listingStatus,
            cancelProtectedDate: listingStatus === 'cancel_protected' ? new Date().toISOString().split('T')[0] : null,
            city: location?.city || null,
            board: location?.board || null,
            valid: !!location && !!address,
            error: !location ? 'Could not match location' : (!address ? 'Missing address' : undefined),
          };

          listings.push(listing);
        }

        setParsedListings(listings);
        // Auto-select valid listings
        const validMls = new Set(listings.filter(l => l.valid).map(l => l.mlsNumber));
        setSelectedListings(validMls);
        setStep('review');
        setIsProcessing(false);
      },
      error: (error) => {
        console.error('CSV parse error:', error);
        toast.error('Failed to parse CSV file');
        setIsProcessing(false);
      },
    });
  };

  const toggleSelection = (mlsNumber: string) => {
    const newSelected = new Set(selectedListings);
    if (newSelected.has(mlsNumber)) {
      newSelected.delete(mlsNumber);
    } else {
      newSelected.add(mlsNumber);
    }
    setSelectedListings(newSelected);
  };

  const selectAll = () => {
    const validMls = parsedListings.filter(l => l.valid).map(l => l.mlsNumber);
    setSelectedListings(new Set(validMls));
  };

  const deselectAll = () => {
    setSelectedListings(new Set());
  };

  const handleImport = async () => {
    if (selectedListings.size === 0) {
      toast.error('Please select at least one listing to import');
      return;
    }

    setIsImporting(true);
    let successCount = 0;
    let failedCount = 0;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error('You must be logged in to import listings');
      setIsImporting(false);
      return;
    }

    const listingsToImport = parsedListings.filter(l => selectedListings.has(l.mlsNumber) && l.valid);

    for (const listing of listingsToImport) {
      try {
        // Check for duplicate MLS number
        const { data: existing } = await supabase
          .from('listings')
          .select('id')
          .eq('mls_number', listing.mlsNumber)
          .eq('user_id', user.id)
          .single();

        if (existing) {
          failedCount++;
          continue; // Skip duplicates
        }

        // Calculate lead score
        const score = calculateLeadScore({
          expiry_date: new Date().toISOString(), // Today (just expired)
          price: listing.price,
          property_type: listing.propertyType,
          city: listing.city || undefined,
        });

        // Insert listing
        const { error } = await supabase.from('listings').insert({
          user_id: user.id,
          address: listing.address,
          city: listing.city,
          neighborhood: listing.neighborhood,
          board: listing.board,
          listing_type: listing.listingStatus,
          status: listing.listingStatus,
          expiry_date: new Date().toISOString().split('T')[0], // Today's date
          cancel_protected_date: listing.cancelProtectedDate,
          price: listing.price,
          bedrooms: listing.bedrooms,
          bathrooms: null, // Not in the export
          square_feet: listing.lotSize, // Using lot size as we don't have interior sq ft
          property_type: listing.propertyType,
          mls_number: listing.mlsNumber,
          latitude: 0, // Will need geocoding
          longitude: 0,
          score,
          stage: 'new',
        });

        if (error) {
          console.error('Insert error:', error);
          failedCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error('Import error:', err);
        failedCount++;
      }
    }

    setImportResults({ success: successCount, failed: failedCount });
    setStep('complete');
    setIsImporting(false);

    if (successCount > 0) {
      toast.success(`Successfully imported ${successCount} listing${successCount > 1 ? 's' : ''}`);
    }
    if (failedCount > 0) {
      toast.error(`Failed to import ${failedCount} listing${failedCount > 1 ? 's' : ''} (duplicates or errors)`);
    }
  };

  const resetImport = () => {
    setFile(null);
    setParsedListings([]);
    setSelectedListings(new Set());
    setStep('upload');
    setImportResults({ success: 0, failed: 0 });
  };

  const validCount = parsedListings.filter(l => l.valid).length;
  const invalidCount = parsedListings.filter(l => !l.valid).length;
  const selectedCount = selectedListings.size;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Import Listings</h1>
        <p className="text-muted-foreground">
          Bulk import expired listings from your MLS export (CSV format)
        </p>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-4 mb-8">
        {['upload', 'review', 'complete'].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step === s
                ? 'bg-cyber-blue text-white'
                : parsedListings.length > 0 && i < ['upload', 'review', 'complete'].indexOf(step)
                  ? 'bg-emerald-500 text-white'
                  : 'bg-muted text-muted-foreground'
            }`}>
              {i + 1}
            </div>
            <span className={step === s ? 'font-medium' : 'text-muted-foreground'}>
              {s === 'upload' ? 'Upload' : s === 'review' ? 'Review' : 'Complete'}
            </span>
            {i < 2 && <ArrowRight className="w-4 h-4 text-muted-foreground ml-2" />}
          </div>
        ))}
      </div>

      {/* Upload Step */}
      {step === 'upload' && (
        <Card className="border-dashed border-2">
          <CardContent className="p-12">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="flex flex-col items-center justify-center text-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-12 h-12 text-cyber-blue animate-spin mb-4" />
                  <p className="text-lg font-medium">Processing CSV...</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-cyber-blue/10 flex items-center justify-center mb-4">
                    <FileSpreadsheet className="w-8 h-8 text-cyber-blue" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">
                    Drag and drop your CSV file here
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    or click to browse your files
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <Button className="btn-glow cursor-pointer" asChild>
                      <span>
                        <span className="relative z-10 flex items-center">
                          <Upload className="w-4 h-4 mr-2" />
                          Select CSV File
                        </span>
                      </span>
                    </Button>
                  </label>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Step */}
      {step === 'review' && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{validCount}</p>
                  <p className="text-sm text-muted-foreground">Valid listings</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{invalidCount}</p>
                  <p className="text-sm text-muted-foreground">Issues found</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-cyber-blue/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5 text-cyber-blue" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{selectedCount}</p>
                  <p className="text-sm text-muted-foreground">Selected to import</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAll}>
                Select All Valid
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAll}>
                Deselect All
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetImport}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                className="btn-glow"
                onClick={handleImport}
                disabled={selectedCount === 0 || isImporting}
              >
                <span className="relative z-10 flex items-center">
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      Import {selectedCount} Listing{selectedCount !== 1 ? 's' : ''}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </span>
              </Button>
            </div>
          </div>

          {/* Listings Table */}
          <Card>
            <ScrollArea className="h-[500px]">
              <div className="divide-y divide-border">
                {parsedListings.map((listing, index) => (
                  <div
                    key={listing.mlsNumber || index}
                    className={`p-4 flex items-start gap-4 ${
                      !listing.valid ? 'bg-amber-500/5' : ''
                    }`}
                  >
                    <Checkbox
                      checked={selectedListings.has(listing.mlsNumber)}
                      onCheckedChange={() => toggleSelection(listing.mlsNumber)}
                      disabled={!listing.valid}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium truncate">{listing.address}</p>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {listing.mlsNumber}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {listing.city ? `${listing.neighborhood}, ${listing.city}` : listing.neighborhood}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                          {/* Status Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                              listing.listingStatus === 'expired'
                                ? 'bg-red-500/15 text-red-400'
                                : listing.listingStatus === 'cancel_protected'
                                  ? 'bg-orange-500/15 text-orange-400'
                                  : 'bg-amber-500/15 text-amber-400'
                            }`}
                          >
                            {listing.listingStatus === 'expired' ? 'Expired' : listing.listingStatus === 'cancel_protected' ? 'Cancel Protected' : 'Terminated'}
                          </span>
                          {/* Price Badge */}
                          {listing.price && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/15 text-emerald-400 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              {listing.price.toLocaleString()}
                            </span>
                          )}
                          {/* Bedrooms Badge */}
                          {listing.bedrooms && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/15 text-blue-400 flex items-center gap-1">
                              <Home className="w-3 h-3" />
                              {listing.bedrooms} BR
                            </span>
                          )}
                          {/* Days on Market Badge */}
                          {listing.dom && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-purple-500/15 text-purple-400 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {listing.dom} DOM
                            </span>
                          )}
                          {/* Property Type Badge */}
                          {listing.propertyType && (
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-500/15 text-slate-300 capitalize">
                              {listing.propertyType.replace('_', ' ')}
                            </span>
                          )}
                        </div>
                      </div>
                      {listing.error && (
                        <p className="text-sm text-amber-500 mt-2 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {listing.error} - Location: &quot;{listing.neighborhood}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </>
      )}

      {/* Complete Step */}
      {step === 'complete' && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
            <h3 className="text-xl font-bold mb-2">Import Complete!</h3>
            <p className="text-muted-foreground mb-6">
              Successfully imported {importResults.success} listing{importResults.success !== 1 ? 's' : ''}
              {importResults.failed > 0 && (
                <span className="text-amber-500">
                  {' '}({importResults.failed} failed - duplicates or errors)
                </span>
              )}
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={resetImport}>
                Import More
              </Button>
              <Button className="btn-glow" onClick={() => router.push('/app/listings')}>
                <span className="relative z-10 flex items-center">
                  View Listings
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Expected CSV Format</CardTitle>
          <CardDescription>
            Export your expired listings from your MLS system (Paragon/Matrix) in CSV format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">ML #</p>
              <p className="text-muted-foreground">MLS listing number</p>
            </div>
            <div>
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground">Full street address</p>
            </div>
            <div>
              <p className="font-medium">S/A</p>
              <p className="text-muted-foreground">Sub-area/neighborhood</p>
            </div>
            <div>
              <p className="font-medium">Price</p>
              <p className="text-muted-foreground">Listing price</p>
            </div>
            <div>
              <p className="font-medium">DOM</p>
              <p className="text-muted-foreground">Days on market</p>
            </div>
            <div>
              <p className="font-medium">Tot BR</p>
              <p className="text-muted-foreground">Total bedrooms</p>
            </div>
            <div>
              <p className="font-medium">Yr Blt</p>
              <p className="text-muted-foreground">Year built</p>
            </div>
            <div>
              <p className="font-medium">TypeDwel</p>
              <p className="text-muted-foreground">HOUSE, TWNHS, CONDO, etc.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
