#include <iostream>
#include <fstream>
#include <vector>
#include <regex>



class Compiler {
public:
    Compiler(const std::vector<std::string>& onLoads, const std::vector<std::string>& scriptFiles, const std::string& outPath, bool deleteComments = false)
        : onloads_(onLoads), scriptFiles_(scriptFiles), outPath_(outPath), deleteComments_(deleteComments)
        {}


    void compile()
    {
        std::string script = concatFiles(scriptFiles_);

        for (const std::string& filepath : onloads_)
        {
            script += "window.addEventListener(\"load\", function(e){\n" + addIndent(readFile(filepath), 4) + "\n});\n";
        }

        script = "!function(){\n" + addIndent(script, 4) + "\n}();";

        if (deleteComments_)
        {
            removeComments(script);
        }

        writeToFile(outPath_, script);
    }

private:
    std::vector<std::string> onloads_;
    std::vector<std::string> scriptFiles_;
    std::string outPath_;
    bool deleteComments_;


    std::string readFile(const std::string& filename)
    {
        std::ifstream file(filename);

        if (!file.is_open())
        {
            std::cerr << "Couldn't open file: " << filename << std::endl;
            exit(EXIT_FAILURE);
            return "";
        }

        return std::string((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    }


    std::string concatFiles(const std::vector<std::string>& files, const std::string space = "\n")
    {
        std::string content;

        for (const std::string& filepath : files)
        {
            content += readFile(filepath) + space;
        }

        return content;
    }


    std::string addIndent(std::string text, int size)
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
        static const std::regex ordinary("//[^\n]*");
        static const std::regex multi("/\\*.*?\\*/");
        static const std::regex jsdoc("/\\*\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/");

        jscode = std::regex_replace(jscode, ordinary, "");
        jscode = std::regex_replace(jscode, multi, "");
        jscode = std::regex_replace(jscode, jsdoc, "");
    }


    void writeToFile(const std::string& filename, const std::string& content)
    {
        static std::ofstream wfile;

        wfile.open(filename, std::ios::out);
        wfile << content << std::endl;
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


    Compiler compiler(onLoads, scriptFiles, outPath, true);
    compiler.compile();

    return 0;
}
