import { useState } from 'react'
import { Leaf, FileText, Download } from 'lucide-react'
import { PropertySearch } from '@/components/PropertySearch'
import { PropertyResults } from '@/components/PropertyResults'
import { Button } from '@/components/ui/button'
import { PropertyService } from '@/services/propertyService'
import { PropertySearchResult } from '@/types/property'

function App() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()
  const [result, setResult] = useState<PropertySearchResult>()

  const handleSearch = async (fastighetsbeteckning: string) => {
    if (!PropertyService.validateFastighetsbeteckning(fastighetsbeteckning)) {
      setError('Ogiltig fastighetsbeteckning. Kontrollera formatet (t.ex. Stockholm 1:1)')
      return
    }

    setLoading(true)
    setError(undefined)
    setResult(undefined)

    try {
      const searchResult = await PropertyService.searchProperty(fastighetsbeteckning)
      setResult(searchResult)
    } catch (err) {
      setError('Ett fel uppstod vid sökning. Försök igen senare.')
      console.error('Search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportReport = () => {
    if (!result) return
    
    // In a real implementation, this would generate a PDF report
    const reportData = {
      property: result.property,
      environmental: result.environmental,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `miljörapport-${result.property.fastighetsbeteckning.replace(/[^a-zA-Z0-9]/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Miljödataportalen
                </h1>
                <p className="text-sm text-muted-foreground">
                  Fastighetsmiljöanalys för Sverige
                </p>
              </div>
            </div>
            
            {result && (
              <Button onClick={handleExportReport} variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exportera rapport
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Search Section */}
          <div className="text-center space-y-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Miljöinformation för svenska fastigheter
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Få omfattande miljödata om markföroreningar, närliggande verksamheter och miljörisker 
                baserat på data från Lantmäteriet, Naturvårdsverket och andra svenska myndigheter.
              </p>
            </div>
            
            <PropertySearch 
              onSearch={handleSearch}
              loading={loading}
              error={error}
            />
          </div>

          {/* Results Section */}
          {result && (
            <div className="animate-fade-in">
              <PropertyResults result={result} />
            </div>
          )}

          {/* Information Section */}
          {!result && !loading && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="text-center p-6 rounded-lg border bg-card">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Omfattande data</h3>
                  <p className="text-sm text-muted-foreground">
                    Information från Lantmäteriet, Naturvårdsverket, SGU och länsstyrelser
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg border bg-card">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Miljöfokus</h3>
                  <p className="text-sm text-muted-foreground">
                    Specialiserat på markföroreningar och miljöfarlig verksamhet
                  </p>
                </div>
                
                <div className="text-center p-6 rounded-lg border bg-card">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Download className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Exporterbara rapporter</h3>
                  <p className="text-sm text-muted-foreground">
                    Ladda ner detaljerade miljörapporter för vidare analys
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              Data hämtas från officiella svenska myndigheter och databaser
            </p>
            <p>
              © 2024 Miljödataportalen - Utvecklad för analys av fastighetsmiljödata
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App