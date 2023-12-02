import { Step, TaskConfig } from 'prostep-js'
import NodeProcessTaskBase, { OutputStream } from './processTaskBase'

export default class MediaTaskBase extends NodeProcessTaskBase {
  protected inputFile: string | undefined
  protected outputFile: string | undefined
  protected file = 'ffmpeg'

  private duration: number | undefined
  private reDuration =
    /Duration: (?<duration>(?<hours>\d\d):(?<minutes>\d\d):(?<seconds>\d\d).(?<milliseconds>\d\d))/i
  private reTime =
    /time=(?<duration>(?<hours>\d\d):(?<minutes>\d\d):(?<seconds>\d\d).(?<milliseconds>\d\d))/i

  private getDuration(groups: any): number | undefined {
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
    const duration = this.getDuration(groups)
    if (duration) this.duration = duration

    groups = str.match(this.reTime)?.groups
    const time = this.getDuration(groups)
    if (time && this.duration) {
      const progress = Math.round((time / this.duration) * 100)
      this.logger.info(`Progress ${progress}%`)
    }
  }

  constructor(stepConfig: Step, taskConfig: TaskConfig) {
    super(stepConfig, taskConfig)

    this.stdErrStream = new OutputStream(x => this.outputstreamCallback(x))
  }

  protected async runFFMPEGNode(command: string[]): Promise<string> {
    const result = await this.runNodeProcess(this.file, command)
    this.logger.verbose(result)
    return result
  }

  protected mapInputArguments(input: Map<string, unknown>): string[] {
    return ['-y', '-i', `file:${input.get('input')}`]
  }

  protected mapOutputArguments(input: Map<string, unknown>): string[] {
    return [`file:${input.get('output')}`]
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected mapConvertArguments(input: Map<string, unknown>): string[] {
    throw Error('Not Implmented')
  }
}
