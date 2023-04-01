import { ExecutableRuntimeContext, TaskBase } from "prostep-js";
import { writeFile } from 'fs/promises';
import { FFmpeg, createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true});

export default class MediaTaskBase extends TaskBase {
    private inputFile: string | undefined
    private outputFile: string | undefined
    

    private async runFFMPEGWasm(command: string[]) {
        this.logger.verbose("Prepare ffmpeg");
        await ffmpeg.load();
        if(this.inputFile && this.outputFile) {
            this.logger.verbose("Fetch file");
            ffmpeg.FS('writeFile', this.inputFile, await fetchFile(this.inputFile ));
            //ffmpeg.FS('readFile', this.inputFile)
            
            this.logger.verbose("Run ffmpeg");
            
            await ffmpeg.run(...command);
            ffmpeg.exit();
        }
        
    }
  
    async run(context: ExecutableRuntimeContext) {
        this.inputFile = context.input.get("input");
        this.outputFile = context.input.get("output");
        const ffmpegArguments = this.mapArguments(context);
        await this.runFFMPEGWasm(ffmpegArguments );
 
    }

    private mapArguments(context: ExecutableRuntimeContext): string[] {
        let args = this.mapInputArguments(context.input);
        args = args.concat(this.mapConvertArguments(context.input));
        args = args.concat(this.mapOutputArguments(context.input));
        
        this.logger.verbose(`FFMPEG Arguments: ${JSON.stringify(args)}`);
        return args;
    }
    
    private mapInputArguments(input: Map<string, unknown>) : string[]{
        return [
            '-y', 
            '-i',
            `file:${input.get("input")}`
        ]
    }
    
    private mapOutputArguments(input: Map<string, unknown>) : string[]{
        return [
            `file:${input.get("output")}`
        ]
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected  mapConvertArguments(input: Map<string, unknown>) : string[]{
        throw Error('Not Implmented');
    }
 }