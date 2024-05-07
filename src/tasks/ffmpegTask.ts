import { Step, TaskConfig, NodeProcessTaskBase, OutputStream } from 'prostep-js'
import { parseToString } from 'alpha8-lib'
import * as crypto from 'crypto'
import { ExecutableRuntimeContext } from 'prostep-js/dist/lib/base'

export default class MediaTaskBase extends NodeProcessTaskBase {
  protected inputFile: string | undefined
  protected outputFile: string | undefined
  protected file = 'ffmpeg'

  private duration: number | undefined
  private reDuration =
    /Duration: (?<duration>(?<hours>\d\d):(?<minutes>\d\d):(?<seconds>\d\d).(?<milliseconds>\d\d))/i
  private reTime =
    /time=(?<duration>(?<hours>\d\d):(?<minutes>\d\d):(?<seconds>\d\d).(?<milliseconds>\d\d))/i

  private getDuration(groups: { [key: string]: string }): number | undefined {
    let duration
    if (groups) {
      duration =
        parseInt(groups.seconds) +
        parseInt(groups.minutes) * 60 +
        parseInt(groups.hours) * 3600
    }
    return duration
  }

  private outputstreamCallback(str: string) {
    let groups = str.match(this.reDuration)?.groups
    if (groups) {
      const duration = this.getDuration(groups)
      if (duration) this.duration = duration
    }
    groups = str.match(this.reTime)?.groups
    if (groups) {
      const time = this.getDuration(groups)
      if (time && this.duration) {
        const progress = Math.round((time / this.duration) * 100)
        this.logger.info(`Progress ${progress}%`)
      }
    }
  }

  constructor(stepConfig: Step, taskConfig: TaskConfig) {
    super(stepConfig, taskConfig)

    this.stdErrStream = new OutputStream(x => this.outputstreamCallback(x))
  }

  protected async runFFMPEGNode(
    command: string[],
    context: ExecutableRuntimeContext
  ): Promise<string> {
    const result = await this.runNodeProcess(this.file, command)
    context.result.set('output', this.outputFile)
    this.logger.verbose(result)
    return result
  }

  protected mapInputArguments(input: Map<string, unknown>): string[] {
    const inputArg = parseToString(input.get('input'))
    if (inputArg) {
      return ['-y', '-i', `file:${inputArg}`]
    }
    this.logger.error('Input task argument for ffmpeg task not found.')
    throw Error('Input task argument for ffmpeg task not found.')
  }

  protected mapOutputArguments(input: Map<string, unknown>): string[] {
    const outputArg = parseToString(input.get('output'))
    if (outputArg) {
      return [`file:${outputArg}`]
    } else {
      const instanceUUID = crypto.randomUUID()
      this.outputFile = `${instanceUUID}.mp3`
      return [`file:${instanceUUID}.mp3`]
    }
    this.logger.error('Output task argument for ffmpeg task not found.')
    throw Error('Output task argument for ffmpeg task not found.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected mapConvertArguments(input: Map<string, unknown>): string[] {
    throw Error('Not Implmented')
  }
}
