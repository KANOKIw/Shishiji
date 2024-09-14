/**
 * set js path on main
 * builds new js file by concatting them as one
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
        std::string script;
        if (endsWith(outPath_, ".css") || endsWith(outPath_, ".html")){
            script = mergeF(scriptFiles_);
        } else {
            script = mergeF(scriptFiles_);

            while (script.find("//@ts-check\n\"use strict\";") != std::string::npos){
                script = replaceStr(script, "//@ts-check\n\"use strict\";", "");
            }

            std::string _onload = mergeF(onLoads_, "\n\n");

            addIndent(_onload, 4);
            script += "window.addEventListener(\"load\", function(e){\n" + _onload + "\n});\n";

            addIndent(script, indent_size);
            script = "(() => {\n    //@ts-check\n" + script + "\n    return 0;\n})();";
        }

        if (deleteComments_){
            rmComments(script);
        }

        wFile(outPath_, script);
    }


    void minify()
    {
        const size_t dp = outPath_.find_last_of(".");
        const std::string basename = outPath_.substr(0, dp);
        std::string cmd;

        std::string file_extension = "js";

        if (endsWith(outPath_, ".css")){
            file_extension = "css";
            cmd = "cleancss -o "+basename+".min."+file_extension+" "+outPath_;
        } else if(endsWith(outPath_, ".html")){
            file_extension = "html";
            cmd = "cleancss -o "+basename+"."+file_extension+" "+outPath_;
            std::cout << cmd << std::endl;
        } else {
            cmd = "npx terser "+outPath_+" --mangle -o "+basename+".min."+file_extension;
        }

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
            std::cerr << "couldn't open file: " << filename << std::endl;
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

        if (hDir == INVALID_HANDLE_VALUE){
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

    bool endsWith(const std::string& str, const std::string& suffix)
    {
        if (str.length() < suffix.length()) {
            return false;
        }
        return str.compare(str.length() - suffix.length(), suffix.length(), suffix) == 0;
    }

    std::string replaceStr(std::string &replacedStr, std::string from, std::string to){
        const unsigned int pos = replacedStr.find(from);
        const int len = from.length();

        if (pos == std::string::npos || from.empty()) {
            return replacedStr;
        }

        return replacedStr.replace(pos, len, to);
    }
};


int _main()
{
    std::string foldor = "../src/assets/manage/editor/";
    std::string outFoldor = "../src/assets/builds/editor/";

    std::vector<std::string> scriptFiles = {
        foldor + "0leaver.js",
        foldor + "1previewerfunc.js",
        foldor + "2editorfunc.js",
        foldor + "3editordec.js",
        foldor + "4editordecutil.js",
        foldor + "5editutil.js",
        foldor + "6maininter.js",
        foldor + "7artdetail.js",
        foldor + "8appevent.js",
        foldor + "9objectins.js",
        foldor + "10cloudpop.js",
        foldor + "11cloud.js",
        foldor + "12cloudajax.js",
        foldor + "13utilevent.js",
        foldor + "14editorconfig.js",
        foldor + "15pvutil.js",
    };
    
    Builder jsbuilder({}, { scriptFiles }, outFoldor+"editor.js", false);
    jsbuilder.build();
    jsbuilder.minify();

    return 0;
}


int main()
{
    _main();
    std::string foldor = "../src/assets/";
    std::string outFoldor = foldor + "builds/";

    std::vector<std::string> onLoads = {
        
    };

    std::vector<std::string> scriptFiles = {
        foldor + "globals.v.js",
        foldor + "utils.js",
        foldor + "mcformat.js",
        foldor + "speed.js",
        foldor + "restrict.js",
        foldor + "ws.js",

        foldor + "login/reap.js",
        foldor + "login/headcount.js",

        foldor + "shepherd/found.js",

        foldor + "menu/adv.js",
        foldor + "menu/search.js",
        foldor + "menu/faq.js",
        foldor + "menu/stamp.js",
        foldor + "menu/myqrcode.js",
        foldor + "menu/pokmenu.js",
        foldor + "menu/profile.js",
        foldor + "menu/famevote.js",
        foldor + "menu/event.js",
        foldor + "menu/drink.js",
        foldor + "menu/tickets.js",
        foldor + "menu/tea.js",
        foldor + "menu/shop.js",
        foldor + "menu/mission.js",

        foldor + "navigator/route.js",
        foldor + "navigator/drew.js",

        foldor + "canvas/calculate.js",
        foldor + "canvas/display.js",
        foldor + "canvas/react.js",
        foldor + "canvas/touch.js",
        foldor + "canvas/mouse.js",
        foldor + "canvas/keyboard.js",

        foldor + "objects/create.js",
        foldor + "objects/behave.js",
        foldor + "objects/overview.js",

        foldor + "ui/fselector.js",

        foldor + "supports/share.js",
        foldor + "supports/notifier.js",
        foldor + "supports/pictonotifier.js",
        foldor + "supports/raidnotifier.js",
        foldor + "supports/popup.js",

        foldor + "menu/buttons.js",
        foldor + "menu/setup.js",
        foldor + "objects/behave.js",
        foldor + "objects/listener.js",
        foldor + "objects/setup.js",
        foldor + "canvas/setup.js",
        foldor + "supports/setup.js",
        foldor + "main.js",
    };

    Builder jsbuilder(onLoads, scriptFiles, outFoldor+"main.js", false);
    Builder cssbuilder({}, { foldor + "css/shishijimap.css" }, outFoldor+"shishijimap.css", false);
    Builder htmlbuilder({}, { "../src/main/index.html" }, "../src/main/index.min.html", false);
    
    jsbuilder.build();
    jsbuilder.minify();

    cssbuilder.build();
    cssbuilder.minify();
    
    /*htmlbuilder.build();
    htmlbuilder.minify();*/
    
    /*jsbuilder.watch("./", [&jsbuilder, &cssbuilder]{
        jsbuilder.build();
        jsbuilder.minify();

        cssbuilder.build();
        cssbuilder.minify();
    });*/

    return 0;
}
