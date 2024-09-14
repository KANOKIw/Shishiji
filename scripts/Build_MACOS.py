import os
import re
import subprocess


class Builder:
    def __init__(self, onLoads, scriptFiles, outPath, deleteComments=False):
        self.onLoads = onLoads
        self.scriptFiles = scriptFiles
        self.outPath = outPath
        self.deleteComments = deleteComments
        self.indent_size = 4

    def build(self):
        script = self.mergeF(self.scriptFiles)

        if self.outPath.endswith(".css") or self.outPath.endswith(".html"):
            pass
        else:
            script = self.replaceStr(script, "//@ts-check\n\"use strict\";", "")
            _onload = self.mergeF(self.onLoads, "\n\n")
            _onload = self.addIndent(_onload, 4)
            script += 'window.addEventListener("load", function(e){\n' + _onload + '\n});\n'
            script = self.addIndent(script, self.indent_size)
            script = '(() => {\n    //@ts-check\n' + script + '\n    return 0;\n})();'

        if self.deleteComments:
            script = self.rmComments(script)

        self.writeFile(self.outPath, script)

    def minify(self):
        basename, ext = os.path.splitext(self.outPath)
        cmd = ""

        if ext == ".css":
            cmd = f"cleancss -o {basename}.min{ext} {self.outPath}"
        elif ext == ".html":
            cmd = f"cleancss -o {basename}{ext} {self.outPath}"
        else:
            cmd = f"npx terser {self.outPath} --mangle -o {basename}.min.js"

        subprocess.run(cmd, shell=True)

    def mergeF(self, files, space="\n"):
        content = ""
        for filepath in files:
            with open(filepath, 'r', encoding='utf-8') as f:
                content += f.read() + space
        return content

    def addIndent(self, text, size):
        indent = " " * size
        return indent + text.replace("\n", "\n" + indent)

    def rmComments(self, jscode):
        jscode = re.sub(r"//[^\n]*", "", jscode)
        jscode = re.sub(r"/\*.*?\*/", "", jscode, flags=re.DOTALL)
        jscode = re.sub(r"/\*\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "", jscode, flags=re.DOTALL)
        return jscode

    def writeFile(self, filename, content):
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

    def replaceStr(self, replacedStr, from_str, to_str):
        return replacedStr.replace(from_str, to_str)

    def watch(self, dirPath, callback):
        print(f"watching directory: {dirPath}")
        before = dict ([(f, None) for f in os.listdir (dirPath)])
        while True:
            after = dict ([(f, None) for f in os.listdir (dirPath)])
            added = [f for f in after if not f in before]
            removed = [f for f in before if not f in after]
            if added or removed:
                callback()
            before = after


def main():
    foldor = "./src/assets/"
    outFoldor = foldor + "builds/"

    onLoads = []

    scriptFiles = [
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
    ]

    jsbuilder = Builder(onLoads, scriptFiles, outFoldor + "main.js", False)
    #cssbuilder = Builder([], [foldor + "css/shishijimap.css"], outFoldor + "shishijimap.css", False)
    htmlbuilder = Builder([], ["./src/main/index.html"], "./src/main/index.min.html", False)

    jsbuilder.build()
    jsbuilder.minify()

    #cssbuilder.build()
    #cssbuilder.minify()


if __name__ == "__main__":
    foldor = "./src/assets/manage/editor/"
    outFoldor = "./src/assets/builds/editor/"

    scriptFiles = [
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
    ]

    jsbuilder = Builder([], scriptFiles, outFoldor + "editor.js", False)
    jsbuilder.build()
    jsbuilder.minify()

    main()
