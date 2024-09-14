import sharp from "sharp";
import * as fs from 'fs';
import * as path from 'path';


/**
 * @throws {Error}
 * @param fp 
 */
async function resizeImage(fp: string, m: number, to?: string){
    try{
        const image = sharp(fp);
        const metadata = await image.metadata();
    
        if (!metadata.width || !metadata.height) {
            throw new Error("Failed to get meta data.");
        }
    
        var newWidth: number;
        var newHeight: number;
    
        if (metadata.width > metadata.height){
            if (metadata.width > m){
                newWidth = m;
                newHeight = Math.round((metadata.height / metadata.width) * m);
            } else {
                newWidth = metadata.width;
                newHeight = metadata.height;
            }
        } else {
            if (metadata.height > m){
                newHeight = m;
                newWidth = Math.round((metadata.width / metadata.height) * m);
            } else {
                newWidth = metadata.width;
                newHeight = metadata.height;
            }
        }
    
        const im = await image
            .resize(newWidth, newHeight)
            .toFile(to || "./.tmp/omg.png");
        if (to) return;
        const h = sharp("./.tmp/omg.png");
        await h.toFile(fp);
    }catch(e){
        console.log(fp);
    }
}


function resizeAllImages(dir: string): void {
    fs.readdir(dir, async (err, files) => {
        for (const file of files){
            const filepath = path.join(dir, file);
            const stats = fs.lstatSync(filepath);

            if (stats.isDirectory()){
                resizeAllImages(filepath);
            } else if (stats.isFile()){
                try{
                    await resizeImage(filepath, 100);
                }catch(e){}
            }
        }
    });
}


resizeImage("./resources/button/description.png", 100);
