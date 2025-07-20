export interface PropertyData {
  fastighetsbeteckning: string
  coordinates: {
    lat: number
    lng: number
  }
  area: number
  municipality: string
  county: string
  landUse: string
  owner?: string
}

export interface EnvironmentalData {
  soilPollution: {
    level: 'low' | 'medium' | 'high' | 'critical'
    contaminants: string[]
    lastUpdated: string
    source: string
  }
  nearbyBusinesses: EBHBusiness[]
  contaminated_sites: ContaminatedSite[]
  riskAssessment: {
    overall: 'low' | 'medium' | 'high' | 'critical'
    factors: string[]
  }
}

export interface EBHBusiness {
  id: string
  name: string
  type: string
  distance: number
  riskLevel: 'low' | 'medium' | 'high'
  activities: string[]
  coordinates: {
    lat: number
    lng: number
  }
}

export interface ContaminatedSite {
  id: string
  name: string
  status: 'active' | 'remediated' | 'under_investigation'
  contaminants: string[]
  distance: number
  severity: 'low' | 'medium' | 'high' | 'critical'
  coordinates: {
    lat: number
    lng: number
  }
}

export interface PropertySearchResult {
  property: PropertyData
  environmental: EnvironmentalData
}