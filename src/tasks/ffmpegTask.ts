import { ExecutableRuntimeContext, TaskBase } from "prostep-js";
import { spawn } from 'child_process';

export default class MediaTaskBase extends TaskBase {


    runFFMPEG(path:string, command: string[]) : Promise<void>{
        const promise = new Promise<void>( (resolve, reject) => {
            this.logger.verbose("Start ffmpeg");
            const ffmpeg = spawn(path, command);

            ffmpeg.stderr.setEncoding("utf8")
            ffmpeg.stderr.on("data", (data) => {
                this.logger.verbose(`stderr: ${data}`);
            });

            ffmpeg.stdout.on('data', (data) => {
                this.logger.verbose(`stdout: ${data}`);
            });
        
            ffmpeg.on("exit", (code,signal) => {
                this.logger.verbose("FFMPEG Exit");
                if(signal)
                    code = parseInt(signal);
                if(code != 0) {
                    
                    this.logger.error(`ffmpeg Error ${code}`);
                    reject();
                }
                else {
                    this.logger.verbose("FFMPEG Done");
                    resolve();
                }
            });
        });
        return promise;
    }
  
    async run(context: ExecutableRuntimeContext) {
       
        const ffmpegArguments = this.mapArguments(context);
        await this.runFFMPEG(context.input.get("ffmpegPath").toString(), ffmpegArguments );
 
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
            `${input.get("input")}`
        ]
    }
    
    private mapOutputArguments(input: Map<string, unknown>) : string[]{
        return [
            `${input.get("output")}`
        ]
    }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected  mapConvertArguments(input: Map<string, unknown>) : string[]{
        throw Error('Not Implmented');
    }
 }