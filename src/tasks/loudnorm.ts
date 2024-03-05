import { InputMetadata } from 'prostep-js'
import MediaTaskBase from './ffmpegTask'
import { ExecutableRuntimeContext } from 'prostep-js/dist/lib/base'

export default class LoudnormTask extends MediaTaskBase {
  getInputMetadata(): InputMetadata {
    return {
      fields: [
        { name: 'input', type: 'string' },
        { name: 'output', type: 'string' },
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

  protected mapArguments(context: ExecutableRuntimeContext): string[] {
    let args = this.mapInputArguments(context.input)
    args = args.concat(this.mapConvertArguments(context.input))

    this.logger.verbose(`FFMPEG Arguments: ${JSON.stringify(args)}`)
    return args
  }

  protected mapConvertArguments(input: Map<string, unknown>): string[] {
    return [
      `-af`,
      `loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json`,
      `-f`,
      `null`,
      `-`,
    ]
  }
}
