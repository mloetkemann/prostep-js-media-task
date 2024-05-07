import { assert } from 'chai'
import ScaleAudioTask from '../tasks/scaleAudio.js'
import { TaskBase } from 'prostep-js'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

describe('Process Runtime Tests', () => {
  const taskConfig = {
    name: 'duration',
    path: './src/tasks/getDurationTask.js',
  }

  it('Mp3 Tag file', async () => {
    const step = {
      stepName: 'Duration',
      name: 'duration',
      type: 'Task',
      arguments: [],
    }

    const task = await TaskBase.getInstance(step, taskConfig)
    const currentDirname = dirname(fileURLToPath(import.meta.url))
    const stepContext = {
      input: new Map<string, unknown>([
        ['input', join(currentDirname, 'tagExample.mp3')],
      ]),
      result: new Map<string, unknown>(),
    }
    await task.run(stepContext)
    const result = stepContext.result.get('result') as number
    assert.equal(result, 74031.02)
  })
})
