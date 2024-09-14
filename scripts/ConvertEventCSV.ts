import * as fs from "fs/promises";
import * as csv_parse from "csv-parse/sync";


interface EventRecord {
    name: string;
    genre: "band" | "dance" | "misc";
    venue: string;
    takes: string;
}


async function parseCSVToEventRecords(filePath: string): Promise<EventRecord[]>{
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        
        const records = csv_parse.parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });

        const eventRecords: EventRecord[] = records.map((record: any) => {
            const jagenre = record["ジャンル"];
            var genre = "misc";
            
            if (jagenre == "ダンス") genre = "dance";
            if (jagenre == "バンド")　genre = "band";
            return {
                name: record["団体名"],
                genre: genre as "band" | "dance" | "misc",
                venue: record["会場"],
                takes: record["時間"]
            };
        });

        return eventRecords;
    } catch (error){
        return [];
    }
}


async function main(){
    const eventrecords = await parseCSVToEventRecords("./.data/event/all.csv");
    const savedata: {
        [key: string]: any[]
    } = { band: [], dance: [], misc: [] };

    for (const eventrecord of eventrecords){
        const genre = eventrecord.genre;
        
        savedata[genre].push({
            name: eventrecord.name,
            venue: eventrecord.venue,
            takes: eventrecord.takes
        })
    }

    fs.writeFile("./.data/event/all.json", JSON.stringify(savedata, null, 4))
}


main();
