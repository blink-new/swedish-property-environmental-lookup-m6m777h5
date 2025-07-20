import { MapPin, Building, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { PropertySearchResult } from '@/types/property'

interface PropertyResultsProps {
  result: PropertySearchResult
}

export function PropertyResults({ result }: PropertyResultsProps) {
  const { property, environmental } = result

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <CheckCircle className="h-4 w-4" />
      case 'medium': return <Info className="h-4 w-4" />
      case 'high': return <AlertTriangle className="h-4 w-4" />
      case 'critical': return <XCircle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto">
      {/* Property Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Fastighetsinformation
          </CardTitle>
          <CardDescription>Grundläggande information om fastigheten</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Fastighetsbeteckning</p>
              <p className="font-mono text-lg">{property.fastighetsbeteckning}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Kommun</p>
              <p>{property.municipality}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Län</p>
              <p>{property.county}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Areal</p>
              <p>{property.area.toLocaleString()} m²</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Markanvändning</p>
              <p>{property.landUse}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Koordinater</p>
              <p className="font-mono text-sm">
                {property.coordinates.lat.toFixed(6)}, {property.coordinates.lng.toFixed(6)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Environmental Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Miljöriskbedömning
          </CardTitle>
          <CardDescription>Övergripande bedömning av miljörisker</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className={getRiskColor(environmental.riskAssessment.overall)}>
            <div className="flex items-center gap-2">
              {getRiskIcon(environmental.riskAssessment.overall)}
              <AlertDescription className="font-medium">
                Övergripande risk: {environmental.riskAssessment.overall.toUpperCase()}
              </AlertDescription>
            </div>
          </Alert>
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Riskfaktorer:</p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {environmental.riskAssessment.factors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Soil Pollution */}
      <Card>
        <CardHeader>
          <CardTitle>Markföroreningar</CardTitle>
          <CardDescription>Information om föroreningar i marken</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getRiskColor(environmental.soilPollution.level)}>
                {environmental.soilPollution.level.toUpperCase()}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Uppdaterad: {environmental.soilPollution.lastUpdated}
              </span>
            </div>
            
            {environmental.soilPollution.contaminants.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Identifierade föroreningar:</p>
                <div className="flex flex-wrap gap-2">
                  {environmental.soilPollution.contaminants.map((contaminant, index) => (
                    <Badge key={index} variant="outline">{contaminant}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              Källa: {environmental.soilPollution.source}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nearby Businesses (EBH) */}
      <Card>
        <CardHeader>
          <CardTitle>Miljöfarlig verksamhet i närområdet</CardTitle>
          <CardDescription>EBH-registrerade verksamheter inom 1 km</CardDescription>
        </CardHeader>
        <CardContent>
          {environmental.nearbyBusinesses.length === 0 ? (
            <p className="text-muted-foreground">Inga miljöfarliga verksamheter registrerade i närområdet.</p>
          ) : (
            <div className="space-y-4">
              {environmental.nearbyBusinesses.map((business) => (
                <div key={business.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{business.name}</h4>
                    <Badge className={getRiskColor(business.riskLevel)}>
                      {business.riskLevel.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{business.type}</p>
                  <p className="text-sm mb-2">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    {business.distance}m från fastigheten
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {business.activities.map((activity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contaminated Sites */}
      <Card>
        <CardHeader>
          <CardTitle>Förorenade områden</CardTitle>
          <CardDescription>Kända förorenade områden i närområdet</CardDescription>
        </CardHeader>
        <CardContent>
          {environmental.contaminated_sites.length === 0 ? (
            <p className="text-muted-foreground">Inga kända förorenade områden i närområdet.</p>
          ) : (
            <div className="space-y-4">
              {environmental.contaminated_sites.map((site) => (
                <div key={site.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{site.name}</h4>
                    <div className="flex gap-2">
                      <Badge variant="outline">{site.status}</Badge>
                      <Badge className={getRiskColor(site.severity)}>
                        {site.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm mb-2">
                    <MapPin className="h-3 w-3 inline mr-1" />
                    {site.distance}m från fastigheten
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {site.contaminants.map((contaminant, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {contaminant}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Datakällor</CardTitle>
          <CardDescription>Information hämtad från följande myndigheter</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Lantmäteriet</p>
              <p className="text-muted-foreground">Fastighetsinformation, koordinater</p>
            </div>
            <div>
              <p className="font-medium">Naturvårdsverket</p>
              <p className="text-muted-foreground">Förorenade områden</p>
            </div>
            <div>
              <p className="font-medium">Länsstyrelser</p>
              <p className="text-muted-foreground">EBH-register, miljötillstånd</p>
            </div>
            <div>
              <p className="font-medium">SGU</p>
              <p className="text-muted-foreground">Geologisk information</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}