import { assert } from 'chai'
import ScaleAudioTask from '../tasks/scaleAudio'
import { TaskBase } from 'prostep-js'
import { join } from 'path'

describe('Process Runtime Tests', () => {
  const taskConfig = {
    name: 'tag',
    path: './src/tasks/tag',
  }

  it('Mp3 Tag file', async () => {
    const step = {
      stepName: 'MP3Tag',
      name: 'tag',
      type: 'Task',
      arguments: [],
    }

    const task = await TaskBase.getInstance(step, taskConfig)
    const stepContext = {
      input: new Map<string, unknown>([
        ['input', join(__dirname, 'tagExample.mp3')],
        ['title', 'TEST TEST TEST'],
        ['album', 'TEST ALBUM'],
        ['album_artist', 'TEST ALBUM ARTIST'],
        ['artist', 'TEST ARTIST'],
        ['output', join(__dirname, 'tagExampleResult.mp3')],
      ]),
      result: new Map<string, unknown>(),
    }
    //await task.run(stepContext)
  })
})
