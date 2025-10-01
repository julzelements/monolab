import { MonologuePatch, SharedPatch, UrlEncodedPatch } from '@/types'

/**
 * Utility functions for encoding and sharing Monologue patches via URLs
 */

export class PatchSharingUtils {
  private static readonly VERSION = 1
  private static readonly COMPRESSION_THRESHOLD = 500 // bytes

  /**
   * Encode a patch for URL sharing
   */
  static encodePatchForUrl(patch: MonologuePatch, metadata?: { name?: string; author?: string }): string {
    try {
      const patchData: UrlEncodedPatch = {
        v: this.VERSION,
        p: this.compressPatch(patch),
        m: metadata ? this.encodeMetadata(metadata) : undefined
      }

      const jsonString = JSON.stringify(patchData)
      const base64 = btoa(jsonString)
      
      // Make URL-safe
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    } catch (error) {
      console.error('Failed to encode patch for URL:', error)
      throw new Error('Failed to encode patch')
    }
  }

  /**
   * Decode a patch from URL parameter
   */
  static decodePatchFromUrl(encodedData: string): SharedPatch | null {
    try {
      // Restore base64 padding and characters
      let base64 = encodedData.replace(/-/g, '+').replace(/_/g, '/')
      while (base64.length % 4) {
        base64 += '='
      }

      const jsonString = atob(base64)
      const patchData: UrlEncodedPatch = JSON.parse(jsonString)

      if (patchData.v !== this.VERSION) {
        console.warn('Unsupported patch version:', patchData.v)
        return null
      }

      const patch = this.decompressPatch(patchData.p)
      const metadata = patchData.m ? this.decodeMetadata(patchData.m) : {}

      return {
        token: encodedData,
        patch,
        metadata: {
          name: metadata.name || 'Shared Patch',
          author: metadata.author,
          createdAt: new Date()
        }
      }
    } catch (error) {
      console.error('Failed to decode patch from URL:', error)
      return null
    }
  }

  /**
   * Generate a shareable URL for a patch
   */
  static generateShareUrl(
    patch: MonologuePatch, 
    baseUrl: string = 'https://monolab.app',
    metadata?: { name?: string; author?: string }
  ): string {
    const encodedPatch = this.encodePatchForUrl(patch, metadata)
    return `${baseUrl}/patch/${encodedPatch}`
  }

  /**
   * Compress patch data using simple RLE compression
   */
  private static compressPatch(patch: MonologuePatch): string {
    const simplified = this.simplifyPatch(patch)
    const jsonString = JSON.stringify(simplified)
    
    if (jsonString.length < this.COMPRESSION_THRESHOLD) {
      return btoa(jsonString)
    }

    // Simple run-length encoding for repetitive data
    const compressed = this.runLengthEncode(jsonString)
    return btoa(compressed)
  }

  /**
   * Decompress patch data
   */
  private static decompressPatch(compressedData: string): MonologuePatch {
    const decoded = atob(compressedData)
    
    // Try to decompress first
    let jsonString: string
    try {
      jsonString = this.runLengthDecode(decoded)
    } catch {
      // If decompression fails, assume it's not compressed
      jsonString = decoded
    }

    const simplified = JSON.parse(jsonString)
    return this.expandPatch(simplified)
  }

  /**
   * Simplify patch data for more efficient encoding
   */
  private static simplifyPatch(patch: MonologuePatch): any {
    return {
      n: patch.name,
      d: patch.description,
      t: patch.tags,
      v: {
        w: this.waveToNumber(patch.vco.wave),
        o: patch.vco.octave + 2, // Normalize to 0-4
        p: patch.vco.pitch,
        pw: patch.vco.pulseWidth
      },
      f: {
        c: patch.vcf.cutoff,
        r: patch.vcf.resonance,
        e: patch.vcf.eg + 64, // Normalize to 0-127
        t: patch.vcf.type === 'lpf' ? 0 : 1,
        d: patch.vcf.drive
      },
      a: {
        l: patch.vca.level
      },
      e: {
        a: patch.eg.attack,
        d: patch.eg.decay,
        s: patch.eg.sustain,
        r: patch.eg.release
      },
      l: {
        w: this.lfoWaveToNumber(patch.lfo.wave),
        r: patch.lfo.rate,
        i: patch.lfo.intensity,
        tg: this.lfoTargetToNumber(patch.lfo.target)
      },
      dl: {
        t: patch.delay.time,
        f: patch.delay.feedback,
        h: patch.delay.hiCut
      },
      g: {
        p: patch.global.portamento,
        vm: this.voiceModeToNumber(patch.global.voiceMode),
        ss: patch.global.syncSource === 'internal' ? 0 : 1,
        mc: patch.global.midiChannel
      }
    }
  }

  /**
   * Expand simplified patch data back to full format
   */
  private static expandPatch(simplified: any): MonologuePatch {
    return {
      name: simplified.n || 'Shared Patch',
      description: simplified.d,
      tags: simplified.t || [],
      vco: {
        wave: this.numberToWave(simplified.v.w),
        octave: Math.max(-2, Math.min(2, (simplified.v.o || 2) - 2)) as -2 | -1 | 0 | 1 | 2, // Denormalize from 0-4
        pitch: simplified.v.p || 0,
        pulseWidth: simplified.v.pw
      },
      vcf: {
        cutoff: simplified.f.c || 127,
        resonance: simplified.f.r || 0,
        eg: (simplified.f.e || 64) - 64, // Denormalize from 0-127
        type: simplified.f.t === 0 ? 'lpf' : 'hpf',
        drive: simplified.f.d || 0
      },
      vca: {
        level: simplified.a.l || 127
      },
      eg: {
        attack: simplified.e.a || 0,
        decay: simplified.e.d || 64,
        sustain: simplified.e.s || 127,
        release: simplified.e.r || 64
      },
      lfo: {
        wave: this.numberToLfoWave(simplified.l.w),
        rate: simplified.l.r || 64,
        intensity: simplified.l.i || 0,
        target: this.numberToLfoTarget(simplified.l.tg)
      },
      delay: {
        time: simplified.dl.t || 0,
        feedback: simplified.dl.f || 0,
        hiCut: simplified.dl.h || 127
      },
      global: {
        portamento: simplified.g.p || 0,
        voiceMode: this.numberToVoiceMode(simplified.g.vm),
        syncSource: simplified.g.ss === 0 ? 'internal' : 'external',
        midiChannel: simplified.g.mc || 1
      }
    }
  }

  /**
   * Simple run-length encoding
   */
  private static runLengthEncode(data: string): string {
    let encoded = ''
    let i = 0
    
    while (i < data.length) {
      let count = 1
      const char = data[i]
      
      while (i + count < data.length && data[i + count] === char && count < 255) {
        count++
      }
      
      if (count > 3) {
        encoded += `~${count}${char}`
      } else {
        encoded += char.repeat(count)
      }
      
      i += count
    }
    
    return encoded
  }

  /**
   * Simple run-length decoding
   */
  private static runLengthDecode(data: string): string {
    let decoded = ''
    let i = 0
    
    while (i < data.length) {
      if (data[i] === '~') {
        const countEnd = i + 1
        let countStr = ''
        let j = countEnd
        
        while (j < data.length && /\d/.test(data[j])) {
          countStr += data[j]
          j++
        }
        
        const count = parseInt(countStr, 10)
        const char = data[j]
        decoded += char.repeat(count)
        i = j + 1
      } else {
        decoded += data[i]
        i++
      }
    }
    
    return decoded
  }

  private static encodeMetadata(metadata: { name?: string; author?: string }): string {
    return btoa(JSON.stringify(metadata))
  }

  private static decodeMetadata(encoded: string): { name?: string; author?: string } {
    try {
      return JSON.parse(atob(encoded))
    } catch {
      return {}
    }
  }

  // Helper conversion functions
  private static waveToNumber(wave: string): number {
    const waves = ['saw', 'triangle', 'square', 'pulse']
    return waves.indexOf(wave) || 0
  }

  private static numberToWave(num: number): 'saw' | 'triangle' | 'square' | 'pulse' {
    const waves: ('saw' | 'triangle' | 'square' | 'pulse')[] = ['saw', 'triangle', 'square', 'pulse']
    return waves[num] || 'saw'
  }

  private static lfoWaveToNumber(wave: string): number {
    const waves = ['saw', 'triangle', 'square']
    return waves.indexOf(wave) || 1
  }

  private static numberToLfoWave(num: number): 'saw' | 'triangle' | 'square' {
    const waves: ('saw' | 'triangle' | 'square')[] = ['saw', 'triangle', 'square']
    return waves[num] || 'triangle'
  }

  private static lfoTargetToNumber(target: string): number {
    const targets = ['pitch', 'cutoff', 'pulse_width']
    return targets.indexOf(target) || 0
  }

  private static numberToLfoTarget(num: number): 'pitch' | 'cutoff' | 'pulse_width' {
    const targets: ('pitch' | 'cutoff' | 'pulse_width')[] = ['pitch', 'cutoff', 'pulse_width']
    return targets[num] || 'pitch'
  }

  private static voiceModeToNumber(mode: string): number {
    const modes = ['mono', 'legato', 'priority_last', 'priority_low', 'priority_high']
    return modes.indexOf(mode) || 0
  }

  private static numberToVoiceMode(num: number): 'mono' | 'legato' | 'priority_last' | 'priority_low' | 'priority_high' {
    const modes: ('mono' | 'legato' | 'priority_last' | 'priority_low' | 'priority_high')[] = 
      ['mono', 'legato', 'priority_last', 'priority_low', 'priority_high']
    return modes[num] || 'mono'
  }
}