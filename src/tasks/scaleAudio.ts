import { InputMetadata } from 'prostep-js'
import MediaTaskBase from './ffmpegTask.js'
import { parseToString } from 'alpha8-lib'
import { ExecutableRuntimeContext } from 'prostep-js/dist/lib/base.js'

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

  async executeTask(context: ExecutableRuntimeContext) {
    this.inputFile = parseToString(context.input.get('input'))
    this.outputFile = parseToString(context.input.get('output'))
    const ffmpegArguments = this.mapArguments(context)
    await this.runFFMPEGNode(ffmpegArguments, context)
    //await this.runFFMPEGWasm(ffmpegArguments)
  }

  protected mapArguments(context: ExecutableRuntimeContext): string[] {
    let args = this.mapInputArguments(context.input)
    args = args.concat(this.mapConvertArguments(context.input))
    args = args.concat(this.mapOutputArguments(context.input))

    this.logger.verbose(`FFMPEG Arguments: ${JSON.stringify(args)}`)
    return args
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
