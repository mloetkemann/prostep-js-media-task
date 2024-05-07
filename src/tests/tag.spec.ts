import { assert } from 'chai'
import ScaleAudioTask from '../tasks/scaleAudio.js'
import { TaskBase } from 'prostep-js'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

describe('Process Runtime Tests', () => {
  const taskConfig = {
    name: 'tag',
    path: './src/tasks/tag.js',
  }

  it('Mp3 Tag file', async () => {
    const step = {
      stepName: 'MP3Tag',
      name: 'tag',
      type: 'Task',
      arguments: [],
    }

    const task = await TaskBase.getInstance(step, taskConfig)
    const currentDirname = dirname(fileURLToPath(import.meta.url))
    const stepContext = {
      input: new Map<string, unknown>([
        ['input', join(currentDirname, 'tagExample.mp3')],
        ['title', 'TEST TEST TEST'],
        ['album', 'TEST ALBUM'],
        ['album_artist', 'TEST ALBUM ARTIST'],
        ['artist', 'TEST ARTIST'],
        ['output', join(currentDirname, 'tagExampleResult.mp3')],
      ]),
      result: new Map<string, unknown>(),
    }
    await task.run(stepContext)
  })
})
