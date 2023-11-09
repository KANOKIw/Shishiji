#include <iostream>
#include <string>
#include <fstream>
#include <ios>


std::string readTextFile(const std::string& filename)
{
    std::ifstream file(filename);

    if (!file.is_open()){
        std::cerr << "Couldn't open file: " << filename << std::endl;
        exit(EXIT_FAILURE);
        return "";
    }

    std::string content((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());

    file.close();

    return content;
}


std::string addIndent(std::string text, const int size)
{
    std::string indent(size, ' ');
    size_t pos = 0;

    while ((pos = text.find('\n', pos)) != std::string::npos)
    {
        text.insert(pos + 1, indent);
        pos += (size + 1);
    }

    text.insert(0, indent);

    return text;
}


int main()
{
    std::string fol = "../src/assets/";
    std::string outpath = fol+"builds/main.js";

    std::string onloads[] = {
        fol+"canvasReact.js",
        fol+"main.js",
    };

    std::string scriptFiles[] = {
        fol+"globals.v.js",
        fol+"utils.js",
        fol+"canvasSetup.js",
        fol+"speed.js",
        fol+"eventCalcu.js",
    };
    
    std::string script = "";

    for (std::string filepath : scriptFiles){
        script += readTextFile(filepath) + "\n\n";
    }
    for (std::string filepath : onloads){
        script += "window.addEventListener(\"load\", function(e){\n"+addIndent(readTextFile(filepath), 4)+"\n});\n";
    }

    script = "!function(){\n" + addIndent(script, 4) + "\n}();";

    std::ofstream wfile;
    wfile.open(outpath, std::ios::out);
    wfile << script << std::endl;

    return 0;
}
