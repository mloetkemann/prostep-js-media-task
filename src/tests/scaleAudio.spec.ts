import { assert } from 'chai'
import ScaleAudioTask from '../tasks/scaleAudio'
import { StepType, TaskBase } from 'prostep-js'
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
      type: StepType.Task,
      arguments: [ ],
    }

    const task = await TaskBase.getInstance(step, taskConfig)
    const stepContext = {
      input: new Map<string, unknown>([
        [ "input", join(__dirname, 'example.ogg')],
        [ "quality", "8"],
        [ "output", join(__dirname, 'example.mp3')],
        [ "ffmpegPath", 'C:\\Program Files (x86)\\ffmpeg\\bin\\ffmpeg.exe']
      ]),
      result: new Map<string, unknown>(),
    }
    await task.run(stepContext)

  })

})
