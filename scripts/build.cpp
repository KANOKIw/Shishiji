/**
 * set js path on main
 * build new js file by concatting them as one
*/
#include <iostream>
#include <streambuf>
#include <fstream>
#include <vector>
#include <regex>
#include <filesystem>
#include <functional>
#include <codecvt>

#include <stdint.h>
#include <math.h>
#include <time.h>
#include <stdio.h>
#include <windows.h>



class Builder {
public:
    Builder(const std::vector<std::string>& onLoads, const std::vector<std::string>& scriptFiles,
                            const std::string& outPath, const bool& deleteComments = false)
        : onLoads_(onLoads), scriptFiles_(scriptFiles), outPath_(outPath), deleteComments_(deleteComments){}


    void build()
    {
        std::string script = mergeF(scriptFiles_);

        for (const std::string& filepath : onLoads_){
            std::string _script = readF(filepath);
            addIndent(_script, indent_size);
            script += "window.addEventListener(\"load\", function(e) {\n" + _script + "\n});\n";
        }

        addIndent(script, indent_size);
        script = "!function() {\n" + script + "\n}();";

        if (deleteComments_){
            rmComments(script);
        }

        wFile(outPath_, script);
    }


    void minify()
    {
        const size_t dp = outPath_.find_last_of(".");
        const std::string basename = outPath_.substr(0, dp);
        
        const std::string cmd = "npx terser "+outPath_+" --mangle -o "+basename+".min.js";

        system(cmd.c_str());
    }


    void watch(const std::string& dirPath, const std::function<void()>& callback){
        std::string _path = dirPath;
        if (dirPath.back() == L'/'){
            _path.erase(_path.length() -1);
        }
        std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
        std::wstring _dirpath = converter.from_bytes(_path);
        std::cout << "watching directory: " << dirPath << std::endl;
        watchDir(_dirpath, callback);
    }

private:
    std::vector<std::string> onLoads_;
    std::vector<std::string> scriptFiles_;
    std::string outPath_;
    bool deleteComments_;
    int indent_size = 4;


    std::string readF(const std::string& filename)
    {
        std::ifstream file(filename);

        if (!file.is_open()){
            std::cerr << "Couldn't open file: " << filename << std::endl;
            exit(EXIT_FAILURE);
        }

        return std::string((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
    }


    std::string mergeF(const std::vector<std::string>& files, const std::string& space = "\n")
    {
        std::string content;

        for (const std::string& filepath : files){
            content += readF(filepath) + space;
        }

        return content;
    }


    void addIndent(std::string& text, const int& size)
    {
        std::string indent(size, ' ');
        size_t pos = 0;

        while ((pos = text.find("\n", pos)) != std::string::npos){
            text.insert(pos + 1, indent);
            pos += (size + 1);
        }

        text.insert(0, indent);
    }


    void rmComments(std::string& jscode)
    {
        static const std::regex ordinary("//[^\n]*");
        static const std::regex multi("/\\*.*?\\*/");
        static const std::regex jsdoc("/\\*\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/");

        jscode = std::regex_replace(jscode, ordinary, "");
        jscode = std::regex_replace(jscode, multi, "");
        jscode = std::regex_replace(jscode, jsdoc, "");
    }


    void wFile(const std::string& filename, const std::string& content)
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


    void watchDir(const std::wstring& dirpath, const std::function<void()>& callback)
    {
        HANDLE hDir = CreateFileW(
            dirpath.c_str(),
            FILE_LIST_DIRECTORY,
            FILE_SHARE_READ | FILE_SHARE_WRITE | FILE_SHARE_DELETE,
            NULL,
            OPEN_EXISTING,
            FILE_FLAG_BACKUP_SEMANTICS,
            NULL
        );

        if (hDir == INVALID_HANDLE_VALUE) {
            std::cerr << "Error opening directory\n";
            return;
        }

        while (true){callback();
            if (WaitForSingleObject(hDir, INFINITE) == WAIT_OBJECT_0){
                callback();
                FindNextChangeNotification(hDir);
            }
        }

        CloseHandle(hDir);
    }
};


int main()
{
    std::string folder = "../src/assets/";
    std::string outPath = folder + "builds/main.js";

    std::vector<std::string> onLoads = {
        folder + "canvas/setup.js",
        folder + "objects/listeners.js",
        folder + "main.js",
    };

    std::vector<std::string> scriptFiles = {
        folder + "globals.v.js",
        folder + "utils.js",
        folder + "mcformat.js",
        folder + "speed.js",

        folder + "canvas/calculate.js",
        folder + "canvas/display.js",
        folder + "canvas/react.js",

        folder + "objects/create.js",
        folder + "objects/move.js",
        folder + "objects/overview.js",
        folder + "objects/selector.js",
    };

    Builder builder(onLoads, scriptFiles, outPath, false);
    
    builder.build();
    builder.minify();
    
    builder.watch("./", [&builder]{
        builder.build();
        builder.minify();
    });

    return 0;
}
