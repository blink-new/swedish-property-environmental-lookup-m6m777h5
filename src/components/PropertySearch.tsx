import { useState } from 'react'
import { Search, MapPin, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PropertySearchProps {
  onSearch: (fastighetsbeteckning: string) => void
  loading: boolean
  error?: string
}

export function PropertySearch({ onSearch, loading, error }: PropertySearchProps) {
  const [input, setInput] = useState('')

  const validateFastighetsbeteckning = (value: string): boolean => {
    // Basic validation for Swedish property designation format
    // Format: Municipality Name X:Y or similar variations
    const pattern = /^[A-ZÅÄÖ][a-zåäö\s]+\s+\d+:\d+$/
    return pattern.test(value.trim())
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onSearch(input.trim())
    }
  }

  const formatInput = (value: string) => {
    // Auto-format as user types
    return value.replace(/([a-zåäö])(\d)/gi, '$1 $2')
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <MapPin className="h-6 w-6 text-primary" />
          Fastighetssökning
        </CardTitle>
        <CardDescription>
          Ange fastighetsbeteckning för att få miljöinformation om fastigheten
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="property-input" className="text-sm font-medium">
              Fastighetsbeteckning
            </label>
            <div className="relative">
              <Input
                id="property-input"
                type="text"
                placeholder="t.ex. Stockholm 1:1"
                value={input}
                onChange={(e) => setInput(formatInput(e.target.value))}
                className="pr-10"
                disabled={loading}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">
              Format: Kommun X:Y (t.ex. Stockholm 1:1, Göteborg 123:45)
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-2">
            <Button 
              type="submit" 
              className="flex-1" 
              disabled={loading || !input.trim()}
            >
              {loading ? 'Söker...' : 'Sök fastighet'}
            </Button>
          </div>
        </form>

        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Exempel på fastighetsbeteckningar:</h4>
          <div className="flex flex-wrap gap-2">
            {[
              'Stockholm 1:1',
              'Göteborg 123:45',
              'Malmö 67:89',
              'Uppsala 12:34'
            ].map((example) => (
              <Badge
                key={example}
                variant="outline"
                className="cursor-pointer hover:bg-muted"
                onClick={() => setInput(example)}
              >
                {example}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}