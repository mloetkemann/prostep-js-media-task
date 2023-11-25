import NodeProcessTaskBase from './processTaskBase'

export default class MediaTaskBase extends NodeProcessTaskBase {
  protected inputFile: string | undefined
  protected outputFile: string | undefined

  protected async runFFMPEGNode(command: string[]) {
    const result = await this.runNodeProcess('ffmpeg', command)
    this.logger.verbose(result.toString())
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
