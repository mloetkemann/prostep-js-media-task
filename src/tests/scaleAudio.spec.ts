import { assert } from 'chai'
import ScaleAudioTask from '../tasks/scaleAudio'
import { TaskBase } from 'prostep-js'
import { join } from 'path'

describe('Process Runtime Tests', () => {
  const taskConfig = {
    name: 'scaleAudio',
    path: './src/tasks/scaleAudio',
  }

  it('Convert audio file', async () => {
    const step = {
      stepName: 'ConvertAudio',
      name: 'scaleAudio',
      type: 'Task',
      arguments: [],
    }

    const task = await TaskBase.getInstance(step, taskConfig)
    const stepContext = {
      input: new Map<string, unknown>([
        ['input', join(__dirname, 'example.ogg')],
        ['quality', 'Low'],
        ['output', join(__dirname, 'example.mp3')],
      ]),
      result: new Map<string, unknown>(),
    }
    //await task.run(stepContext)
  })
})
