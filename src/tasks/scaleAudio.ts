import MediaTaskBase from './ffmpegTask'

export default class ScaleAudioTask extends MediaTaskBase {

    protected  mapConvertArguments(input: Map<string, unknown>) : string[]{
        return [
            `-codec:a`,
            `libmp3lame`,
            `-q:a`,
            `${input.get("quality")}`,
        ]
    }

}