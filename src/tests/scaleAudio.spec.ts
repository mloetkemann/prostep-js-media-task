import { TaskBase } from 'prostep-js'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

describe('Process Runtime Tests', () => {
  const taskConfig = {
    name: 'scaleAudio',
    path: './src/tasks/scaleAudio.js',
  }

  it('Convert audio file', async () => {
    const step = {
      stepName: 'ConvertAudio',
      name: 'scaleAudio',
      type: 'Task',
      arguments: [],
    }

    const task = await TaskBase.getInstance(step, taskConfig)
    const currentDirname = dirname(fileURLToPath(import.meta.url))
    const stepContext = {
      input: new Map<string, unknown>([
        ['input', join(currentDirname, 'example.ogg')],
        ['quality', 'Low'],
        ['output', join(currentDirname, 'example.mp3')],
      ]),
      result: new Map<string, unknown>(),
    }
    await task.run(stepContext)
  })
})
