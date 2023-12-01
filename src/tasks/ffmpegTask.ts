import NodeProcessTaskBase from './processTaskBase'

export default class MediaTaskBase extends NodeProcessTaskBase {
  protected inputFile: string | undefined
  protected outputFile: string | undefined
  protected file = 'ffmpeg'

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
