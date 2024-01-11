import fs from "fs";
import path from "path";


export function listFiles(dir: string): string[]{
	const files: string[] = [];
  
	function tverse(cdir: string){
	  	const ims = fs.readdirSync(cdir);
  
	  	for (const im of ims){
			const impath = path.join(cdir, im);
	
			if (fs.statSync(impath).isDirectory()){
				tverse(impath);
			} else {
				files.push(impath);
			}
	  	}
	}

	tverse(dir);
	return files.map(f => { return f.replace(dir, ""); });
}


export function toSlashPath(path: string){
	return path.replace(/\\/g, "/")
			   .replace(/\\\\/g, "/")
			   .replace(/\/\//g, "/");
}


export { }
