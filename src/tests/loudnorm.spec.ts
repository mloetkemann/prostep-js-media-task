import { assert } from 'chai'
import LoudnormTask from '../tasks/loudnorm'
import { TaskBase } from 'prostep-js'
import { join } from 'path'

describe('Process Runtime Tests', () => {
  const taskConfig = {
    name: 'loudnorm',
    path: './src/tasks/loudnorm',
  }

  it('Change Loudness', async () => {
    const step = {
      stepName: 'ConvertAudio',
      name: 'loudnorm',
      type: 'Task',
      arguments: [],
    }

    //const task = await TaskBase.getInstance(step, taskConfig)
    const stepContext = {
      input: new Map<string, unknown>([
        ['input', join(__dirname, 'example.mp3')],
        ['output', join(__dirname, 'example2.mp3')],
      ]),
      result: new Map<string, unknown>(),
    }
    //await task.run(stepContext)
  })
})
