import { FieldMetaData, InputMetadata, TaskBase } from 'prostep-js'
import { writeFile } from 'fs/promises'
import { ExecutableRuntimeContext } from 'prostep-js/dist/lib/base'

export default class NodeProcessTaskBase extends TaskBase {
  getInputMetadata(): InputMetadata {
    return {
      fields: new Array<FieldMetaData>(),
    }
  }

  protected async runNodeProcess(
    command: string,
    args: string[]
  ): Promise<string> {
    let execa
    if (typeof execa == 'undefined') {
      const mod = await (eval(`import('execa')`) as Promise<
        typeof import('execa')
      >)
      ;({ execa } = mod)
    }
    const { stdout, stderr } = await execa(command, args)
    this.logger.verbose('stdout:')
    this.logger.verbose(stdout.toString())
    this.logger.verbose('stderr:')
    this.logger.verbose(stderr.toString())
    return stdout.toString()
  }
}
