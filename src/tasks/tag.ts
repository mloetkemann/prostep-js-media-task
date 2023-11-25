import { InputMetadata } from 'prostep-js'
import MediaTaskBase from './ffmpegTask'
import { parseToString } from 'alpha8-lib'
import { ExecutableRuntimeContext } from 'prostep-js/dist/lib/base'

export default class Mp3TagTask extends MediaTaskBase {
  getInputMetadata(): InputMetadata {
    return {
      fields: [
        { name: 'input', type: 'string' },
        { name: 'output', type: 'string' },
        {
          name: 'artist',
          type: 'string',
        },
        { name: 'title', type: 'string' },
        { name: 'album', type: 'string' },
        { name: 'genre', type: 'string' },
        { name: 'track', type: 'string' },
        { name: 'date', type: 'string' },
        { name: 'album_artist', type: 'string' },
      ],
    }
  }

  async executeTask(context: ExecutableRuntimeContext) {
    this.inputFile = parseToString(context.input.get('input'))
    this.outputFile = parseToString(context.input.get('output'))
    const ffmpegArguments = this.mapArguments(context)
    await this.runFFMPEGNode(ffmpegArguments)
    //await this.runFFMPEGWasm(ffmpegArguments)
  }

  protected mapArguments(context: ExecutableRuntimeContext): string[] {
    let args = this.mapInputArguments(context.input)
    args = args.concat(this.mapConvertArguments(context.input))
    args = args.concat(this.mapOutputArguments(context.input))

    this.logger.verbose(`FFMPEG Arguments: ${JSON.stringify(args)}`)
    return args
  }

  protected mapConvertArguments(input: Map<string, unknown>): string[] {
    let result = this.addMetaField(input, 'title')
    result = result.concat(this.addMetaField(input, 'artist'))
    result = result.concat(this.addMetaField(input, 'album'))
    result = result.concat(this.addMetaField(input, 'album_artist'))
    result = result.concat(this.addMetaField(input, 'genre'))
    result = result.concat(this.addMetaField(input, 'track'))
    result = result.concat(this.addMetaField(input, 'date'))

    return result
  }

  private addMetaField(input: Map<string, unknown>, tag: string): string[] {
    const tagValue = input.get(tag)
    if (tagValue) {
      return ['-metadata', `${tag}=${tagValue}`]
    }
    return []
  }
}
