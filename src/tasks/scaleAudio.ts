import { InputMetadata } from 'prostep-js'
import MediaTaskBase from './ffmpegTask'

export default class ScaleAudioTask extends MediaTaskBase {
  getInputMetadata(): InputMetadata {
    return {
      fields: [
        { name: 'input', type: 'string' },
        { name: 'output', type: 'string' },
        {
          name: 'quality',
          type: 'string',
          options: new Map<string, string>([
            ['Low', '8'],
            ['Medium', '6'],
            ['High', '3'],
          ]),
        },
      ],
    }
  }

  private getNewBitrate(input: unknown): string {
    if (typeof input === 'string') {
      const value = this.mapInputOption('quality', input)
      if (typeof value === 'string') return value
    }
    throw Error('Error: bitrate input wrong')
  }

  protected mapConvertArguments(input: Map<string, unknown>): string[] {
    return [
      `-codec:a`,
      `libmp3lame`,
      `-q:a`,
      `${this.getNewBitrate(input.get('quality'))}`,
    ]
  }
}
