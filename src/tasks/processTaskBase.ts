import { FieldMetaData, InputMetadata, TaskBase } from 'prostep-js'
import { writeFile } from 'fs/promises'
import { ExecutableRuntimeContext } from 'prostep-js/dist/lib/base'
import Stream from 'stream'

export class OutputStream extends Stream.Writable {
  constructor(private callback: (str: string) => void) {
    super()
  }

  _write(
    chunk: any,
    encoding: BufferEncoding,
    next: (error?: Error | null | undefined) => void
  ) {
    this.callback(chunk.toString())
    next()
  }
}

export default class NodeProcessTaskBase extends TaskBase {
  protected stdErrStream: OutputStream | undefined
  protected sdtoutStream: OutputStream | undefined

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

    const promise = execa(command, args, {
      encoding: 'buffer',
    })

    if (this.stdErrStream) {
      const pipeStderr = promise.pipeStderr
      if (pipeStderr) pipeStderr(this.stdErrStream)
    }

    if (this.sdtoutStream) {
      const pipeStdout = promise.pipeStdout
      if (pipeStdout) pipeStdout(this.sdtoutStream)
    }

    const { stdout, stderr } = await promise

    this.logger.verbose('stdout:')
    this.logger.verbose(stdout.toString())
    this.logger.verbose('stderr:')
    this.logger.verbose(stderr.toString())
    return stdout.toString()
  }
}
