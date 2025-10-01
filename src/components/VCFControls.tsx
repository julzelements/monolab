'use client'

import { useState, useEffect } from 'react'
import { MVPPatch, ParameterChangeEvent } from '@/types/mvp'
import { SimpleMIDIManager } from '@/utils/simple-midi'

interface VCFControlsProps {
  patch: MVPPatch
  onPatchChange: (patch: MVPPatch) => void
}

export function VCFControls({ patch, onPatchChange }: VCFControlsProps) {
  const [isConnected, setIsConnected] = useState(false)
  const midiManager = SimpleMIDIManager.getInstance()

  useEffect(() => {
    // Initialize MIDI
    midiManager.initialize().then(success => {
      if (success) {
        setIsConnected(midiManager.isMonologueConnected())
      }
    })

    // Listen for parameter changes from hardware
    const handleParameterChange = (event: ParameterChangeEvent) => {
      if (event.source === 'hardware') {
        const updatedPatch = {
          ...patch,
          [event.parameter]: event.value
        }
        onPatchChange(updatedPatch)
      }
    }

    // Listen for device connections
    const handleDeviceChange = () => {
      setIsConnected(midiManager.isMonologueConnected())
    }

    midiManager.on('parameterChange', handleParameterChange)
    midiManager.on('deviceChange', handleDeviceChange)
    midiManager.on('monologueConnected', handleDeviceChange)

    return () => {
      midiManager.off('parameterChange', handleParameterChange)
      midiManager.off('deviceChange', handleDeviceChange)
      midiManager.off('monologueConnected', handleDeviceChange)
    }
  }, [patch, onPatchChange, midiManager])

  const handleCutoffChange = (value: number) => {
    const updatedPatch = { ...patch, cutoff: value }
    onPatchChange(updatedPatch)
    
    // Send to hardware
    midiManager.sendParameterChange('cutoff', value)
  }

  const handleResonanceChange = (value: number) => {
    const updatedPatch = { ...patch, resonance: value }
    onPatchChange(updatedPatch)
    
    // Send to hardware
    midiManager.sendParameterChange('resonance', value)
  }

  return (
    <div className="space-y-8 p-6 bg-card rounded-lg border">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">VCF Controls</h2>
        <div className="flex items-center space-x-2">
          <div 
            className={`w-3 h-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-muted-foreground">
            {isConnected ? 'Monologue Connected' : 'Not Connected'}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cutoff Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              Cutoff
            </label>
            <span className="text-sm text-muted-foreground">
              {patch.cutoff}
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="127"
              value={patch.cutoff}
              onChange={(e) => handleCutoffChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>

        {/* Resonance Control */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">
              Resonance
            </label>
            <span className="text-sm text-muted-foreground">
              {patch.resonance}
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="127"
              value={patch.resonance}
              onChange={(e) => handleResonanceChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>

      {/* Patch Info */}
      <div className="pt-4 border-t">
        <h3 className="text-lg font-medium mb-2">Current Patch</h3>
        <p className="text-muted-foreground">{patch.name}</p>
      </div>
    </div>
  )
}