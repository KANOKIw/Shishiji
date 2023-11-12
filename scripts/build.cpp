#include <iostream>
#include <fstream>
#include <vector>
#include <regex>
#include <cstdio>

#include <stdio.h>
#include <windows.h>


class Compiler {
public:
    Compiler(const std::vector<std::string>& onLoads, const std::vector<std::string>& scriptFiles,
                            const std::string& outPath, bool deleteComments = false)
        : onLoads_(onLoads), scriptFiles_(scriptFiles), outPath_(outPath), deleteComments_(deleteComments){}


    void compile()
    {
        std::string script = mergeFiles(scriptFiles_);

        for (const std::string& filepath : onLoads_){
            std::string _script = loadFile(filepath);
            addIndent(_script, indent_size);
            script += "window.addEventListener(\"load\", function(e) {\n" + _script + "\n});\n";
        }

        addIndent(script, indent_size);
        script = "!function() {\n" + script + "\n}();";

        if (deleteComments_){
            removeComments(script);
        }

        writeToFile(outPath_, script);
    }

private:
    std::vector<std::string> onLoads_;
    std::vector<std::string> scriptFiles_;
    std::string outPath_;
    bool deleteComments_;
    int indent_size = 4;


    std::string loadFile(const std::string& filename)
    {
        std::ifstream file(filename);

        if (!file.is_open()){
            std::cerr << "Couldn't open file: " << filename << std::endl;
            exit(EXIT_FAILURE);
        }

        return std::string((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    }


    std::string mergeFiles(const std::vector<std::string>& files, const std::string& space = "\n")
    {
        std::string content;

        for (const std::string& filepath : files){
            content += loadFile(filepath) + space;
        }

        return content;
    }


    void addIndent(std::string& text, const int size)
    {
        std::string indent(size, ' ');
        size_t pos = 0;

        while ((pos = text.find('\n', pos)) != std::string::npos){
            text.insert(pos + 1, indent);
            pos += (size + 1);
        }

        text.insert(0, indent);
    }


    void removeComments(std::string& jscode)
    {
        static const std::regex ordinary("//[^\n]*");
        static const std::regex multi("/\\*.*?\\*/");
        static const std::regex jsdoc("/\\*\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/");

        jscode = std::regex_replace(jscode, ordinary, "");
        jscode = std::regex_replace(jscode, multi, "");
        jscode = std::regex_replace(jscode, jsdoc, "");
    }


    void writeToFile(const std::string& filename, const std::string& content)
    {
        std::ofstream wfile(filename, std::ios::out);

        if (wfile.is_open()){
            wfile << content << std::endl;
            wfile.close();
        } else {
            std::cerr << "Failed writing to file: " << filename << std::endl;
            exit(EXIT_FAILURE);
        }
    }
};


int main()
{
    std::string folder = "../src/assets/";
    std::string outPath = folder + "builds/main.js";

    std::vector<std::string> onLoads = {
        folder + "canvasReact.js",
        folder + "main.js",
    };

    std::vector<std::string> scriptFiles = {
        folder + "globals.v.js",
        folder + "utils.js",
        folder + "canvasSetup.js",
        folder + "speed.js",
        folder + "eventCalcu.js",
    };

    Compiler compiler(onLoads, scriptFiles, outPath, false);
    compiler.compile();

    return 0;
}
