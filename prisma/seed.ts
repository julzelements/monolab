import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create a sample user
  const user = await prisma.user.create({
    data: {
      email: 'demo@monolab.app',
      name: 'Demo User',
    },
  })

  // Create a sample bank
  const bank = await prisma.bank.create({
    data: {
      name: 'Factory Presets',
      description: 'Default Monologue factory presets',
      authorId: user.id,
    },
  })

  // Create sample patches with mock SysEx data
  const patches = [
    {
      name: 'Init Program',
      description: 'Basic initialization patch',
      tags: ['init', 'basic'],
      parameters: {
        vco: { wave: 'saw', octave: 0, pitch: 0 },
        vcf: { cutoff: 127, resonance: 0, eg: 64, type: 'lpf' },
        vca: { level: 127 },
        eg: { attack: 0, decay: 64, sustain: 127, release: 64 },
        lfo: { rate: 64, intensity: 0, target: 'pitch', wave: 'triangle' }
      },
      bankId: bank.id,
      bankSlot: 0,
    },
    {
      name: 'Lead Saw',
      description: 'Bright lead synthesizer sound',
      tags: ['lead', 'bright', 'saw'],
      parameters: {
        vco: { wave: 'saw', octave: 1, pitch: 0 },
        vcf: { cutoff: 100, resonance: 32, eg: 96, type: 'lpf' },
        vca: { level: 127 },
        eg: { attack: 10, decay: 40, sustain: 80, release: 30 },
        lfo: { rate: 80, intensity: 16, target: 'cutoff', wave: 'triangle' }
      },
      bankId: bank.id,
      bankSlot: 1,
    },
    {
      name: 'Bass Pulse',
      description: 'Deep bass with pulse width modulation',
      tags: ['bass', 'pulse', 'deep'],
      parameters: {
        vco: { wave: 'pulse', octave: -1, pitch: 0 },
        vcf: { cutoff: 60, resonance: 40, eg: 32, type: 'lpf' },
        vca: { level: 127 },
        eg: { attack: 0, decay: 80, sustain: 40, release: 20 },
        lfo: { rate: 60, intensity: 32, target: 'pulse_width', wave: 'triangle' }
      },
      bankId: bank.id,
      bankSlot: 2,
    },
  ]

  for (const patchData of patches) {
    // Mock SysEx data - in real implementation this would be actual MIDI data
    const mockSysEx = Buffer.from([
      0xF0, 0x42, 0x30, 0x00, 0x01, 0x44, 0x00, 0x00, // Header
      ...Array(256).fill(0).map((_, i) => i % 128), // Parameter data
      0xF7 // End of SysEx
    ])

    await prisma.patch.create({
      data: {
        ...patchData,
        authorId: user.id,
        sysexData: mockSysEx,
        shareToken: `share_${Math.random().toString(36).substr(2, 9)}`,
      },
    })
  }

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })