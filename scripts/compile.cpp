#include <stdio.h>
#include <iostream>
#include <string>
#include <fstream>
#include <vector>
#include <regex>



class Compile {
public:
    Compile(const std::vector<std::string> onLoads, const std::vector<std::string> scriptFiles, const std::string outPath, const bool deleteComments = false)
        : onloads(onLoads), scriptfiles(scriptFiles), outpath(outPath), deletecomments(deleteComments){}


    void compile()
    {
        std::string script = "";

        for (std::string filepath : scriptfiles){
            script += readFile(filepath) + '\n';
        }

        for (std::string filepath : onloads){
            script += "window.addEventListener(\"load\", function(e){\n"+addIndent(readFile(filepath), 4)+"\n});\n";
        }

        script = "!function(){\n" + addIndent(script, 4) + "\n}();";

        if (deletecomments)
        {
            removeComments(script);
        }

        std::ofstream wfile;

        wfile.open(outpath, std::ios::out);
        wfile << script << std::endl;
    }
        
private:
    std::vector<std::string> onloads;
    std::vector<std::string> scriptfiles;
    std::string outpath;
    bool deletecomments;


    std::string readFile(const std::string filename)
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


    void removeComments(std::string& jscode)
    {
        jscode = std::regex_replace(jscode, std::regex("//[^\n]*"), "");
        jscode = std::regex_replace(jscode, std::regex("/\\*.*?\\*/"), "");
        jscode = std::regex_replace(jscode, std::regex("/\\*\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/"), "");
    }
};



int main()
{
    std::string fol = "../src/assets/";
    std::string outpath = fol+"builds/main.js";

    std::vector<std::string> onloads = {
        fol+"canvasReact.js",
        fol+"main.js",
    };

    std::vector<std::string> scriptFiles = {
        fol+"globals.v.js",
        fol+"utils.js",
        fol+"canvasSetup.js",
        fol+"speed.js",
        fol+"eventCalcu.js",
    };


    Compile compiler(onloads, scriptFiles, outpath, false);

    compiler.compile();

    return 0;
}
