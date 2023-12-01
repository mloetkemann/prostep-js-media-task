import { InputMetadata } from 'prostep-js'
import MediaTaskBase from './ffmpegTask'
import { parseToString } from 'alpha8-lib'
import { ExecutableRuntimeContext } from 'prostep-js/dist/lib/base'
import { Step, TaskConfig } from 'prostep-js'

export default class Mp3TagTask extends MediaTaskBase {
  constructor(stepConfig: Step, taskConfig: TaskConfig) {
    super(stepConfig, taskConfig)
    this.file = 'ffprobe'
  }
  getInputMetadata(): InputMetadata {
    return {
      fields: [{ name: 'input', type: 'string' }],
    }
  }

  async executeTask(context: ExecutableRuntimeContext) {
    this.inputFile = parseToString(context.input.get('input'))
    this.outputFile = parseToString(context.input.get('output'))
    const ffmpegArguments = this.mapArguments(context)
    const result = await this.runFFMPEGNode(ffmpegArguments)
    const resultAsNumber = parseFloat(result) * 1000

    context.result.set('result', resultAsNumber)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected mapArguments(context: ExecutableRuntimeContext): string[] {
    const args = this.mapConvertArguments()

    this.logger.verbose(`FFMPEG Arguments: ${JSON.stringify(args)}`)
    return args
  }

  protected mapConvertArguments(): string[] {
    if (this.inputFile) {
      const result = [
        '-v',
        'error',
        '-show_entries',
        'format=duration',
        '-of',
        'default=noprint_wrappers=1:nokey=1',
        this.inputFile,
      ]
      return result
    }
    return []
  }
}
