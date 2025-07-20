import { PropertySearchResult, PropertyData, EnvironmentalData } from '@/types/property'

// Mock data service - in a real implementation, this would call actual Swedish APIs
export class PropertyService {
  static async searchProperty(fastighetsbeteckning: string): Promise<PropertySearchResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Mock data based on the input
    const mockProperty: PropertyData = {
      fastighetsbeteckning,
      coordinates: {
        lat: 59.3293 + (Math.random() - 0.5) * 0.1,
        lng: 18.0686 + (Math.random() - 0.5) * 0.1
      },
      area: Math.floor(Math.random() * 10000) + 1000,
      municipality: fastighetsbeteckning.split(' ')[0] || 'Stockholm',
      county: 'Stockholms län',
      landUse: 'Bostäder och komplementbyggnader'
    }

    // Generate mock environmental data
    const riskLevels = ['low', 'medium', 'high', 'critical'] as const
    const contaminants = ['Bly', 'Kvicksilver', 'Kadmium', 'Krom', 'Nickel', 'Zink', 'Koppar', 'Arsenik']
    const businessTypes = ['Bensinstation', 'Kemtvätt', 'Tryckeri', 'Bilverkstad', 'Industri', 'Avfallshantering']
    
    const soilRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)]
    const numContaminants = Math.floor(Math.random() * 4)
    const selectedContaminants = contaminants
      .sort(() => 0.5 - Math.random())
      .slice(0, numContaminants)

    const mockEnvironmental: EnvironmentalData = {
      soilPollution: {
        level: soilRisk,
        contaminants: selectedContaminants,
        lastUpdated: '2024-01-15',
        source: 'Naturvårdsverket, Länsstyrelsen'
      },
      nearbyBusinesses: Array.from({ length: Math.floor(Math.random() * 5) }, (_, i) => ({
        id: `ebh-${i}`,
        name: `${businessTypes[Math.floor(Math.random() * businessTypes.length)]} ${i + 1}`,
        type: businessTypes[Math.floor(Math.random() * businessTypes.length)],
        distance: Math.floor(Math.random() * 800) + 100,
        riskLevel: riskLevels[Math.floor(Math.random() * 3)], // Exclude critical for businesses
        activities: ['Hantering av kemikalier', 'Avfallshantering'].slice(0, Math.floor(Math.random() * 2) + 1),
        coordinates: {
          lat: mockProperty.coordinates.lat + (Math.random() - 0.5) * 0.01,
          lng: mockProperty.coordinates.lng + (Math.random() - 0.5) * 0.01
        }
      })),
      contaminated_sites: Array.from({ length: Math.floor(Math.random() * 3) }, (_, i) => ({
        id: `site-${i}`,
        name: `Förorenat område ${i + 1}`,
        status: ['active', 'remediated', 'under_investigation'][Math.floor(Math.random() * 3)] as any,
        contaminants: selectedContaminants.slice(0, Math.floor(Math.random() * 3) + 1),
        distance: Math.floor(Math.random() * 500) + 200,
        severity: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        coordinates: {
          lat: mockProperty.coordinates.lat + (Math.random() - 0.5) * 0.008,
          lng: mockProperty.coordinates.lng + (Math.random() - 0.5) * 0.008
        }
      })),
      riskAssessment: {
        overall: this.calculateOverallRisk(soilRisk, mockEnvironmental.nearbyBusinesses.length, mockEnvironmental.contaminated_sites.length),
        factors: this.generateRiskFactors(soilRisk, mockEnvironmental.nearbyBusinesses.length, mockEnvironmental.contaminated_sites.length)
      }
    }

    return {
      property: mockProperty,
      environmental: mockEnvironmental
    }
  }

  private static calculateOverallRisk(soilRisk: string, businessCount: number, siteCount: number): 'low' | 'medium' | 'high' | 'critical' {
    let score = 0
    
    // Soil pollution weight
    switch (soilRisk) {
      case 'low': score += 1; break
      case 'medium': score += 2; break
      case 'high': score += 3; break
      case 'critical': score += 4; break
    }
    
    // Nearby businesses weight
    score += Math.min(businessCount * 0.5, 2)
    
    // Contaminated sites weight
    score += Math.min(siteCount * 1, 3)
    
    if (score <= 2) return 'low'
    if (score <= 4) return 'medium'
    if (score <= 6) return 'high'
    return 'critical'
  }

  private static generateRiskFactors(soilRisk: string, businessCount: number, siteCount: number): string[] {
    const factors: string[] = []
    
    if (soilRisk !== 'low') {
      factors.push(`Förhöjda halter av föroreningar i marken (${soilRisk})`)
    }
    
    if (businessCount > 0) {
      factors.push(`${businessCount} miljöfarlig verksamhet i närområdet`)
    }
    
    if (siteCount > 0) {
      factors.push(`${siteCount} kända förorenade områden i närheten`)
    }
    
    if (factors.length === 0) {
      factors.push('Inga kända miljörisker identifierade')
    }
    
    return factors
  }

  static validateFastighetsbeteckning(input: string): boolean {
    // Basic validation for Swedish property designation
    const trimmed = input.trim()
    if (trimmed.length < 3) return false
    
    // Should contain at least one letter and one number with colon
    const hasLetter = /[a-zåäöA-ZÅÄÖ]/.test(trimmed)
    const hasNumberColon = /\d+:\d+/.test(trimmed)
    
    return hasLetter && hasNumberColon
  }
}