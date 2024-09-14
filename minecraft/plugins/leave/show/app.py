import http.server
import os
import threading
import time
import re
import inspect

PORT = 80
counter = 1
_vscode = "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/2048px-Visual_Studio_Code_1.35_icon.svg.png"

class ReqHTTP(http.server.SimpleHTTPRequestHandler):
    extension_iconMap = {
        ".java": "https://cdn3.iconfinder.com/data/icons/letters-and-numbers-1/32/letter_J_red-512.png",
        ".py": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/1869px-Python-logo-notext.svg.png",
        ".js": "https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_light_js_icon_130458.png",
        ".json": "https://cdn.icon-icons.com/icons2/2107/PNG/512/file_type_light_json_icon_130455.png",
        ".css": "https://cdn.discordapp.com/attachments/1083021323967672421/1147048378321088542/css.hash.png"
    }
    
    def do_GET(self):
        global counter
        _path = self.path
        _last = getLast(_path)
        here = "./visual-src/"+_last+".html"
        ex = _last[-_last[::-1].find(".")-1:]
        isJava = False
        isCSS = False
        __doc__decorator = []
        r = None
        
        if not os.path.exists("./visual-src/"):
            os.mkdir("./visual-src/")
        if self.path.endswith("?r=src"):
            ...
        elif not os.path.exists("."+removeQ_(_path)):
            self.path = "/index.html"
        elif _last and ex not in [".html"]:
            try:
                if not os.path.exists(here) or "?v=re" in self.path:
                    with open("."+removeQ_(_path), encoding="utf-8") as f:
                        try:
                            r = f.read().replace(f"\n", "<br>").replace(" ", "&nbsp;")
                        except UnicodeDecodeError:
                            r = None
                    if r:
                        with open(here, "w", encoding="utf-8") as f:
                            replaceable = ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break',
                                'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for',
                                'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not',
                                'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield', 'self'
                            ]
                            match ex:
                                case ".java":
                                    isJava = True
                                    replaceable.extend([
                                        "package", "true", "false", "null", "public", "void", "extends", "implements",
                                        "private", "static", "protected", "abstract", "interface",
                                        "final", "new", "catch", "switch", "case", "this"
                                    ])
                                    replaceable.extend([
                                        "String", "int", "boolean", "char", "byte", "short", "long", "float", "double", "Object",
                                        "String", "Integer", "Boolean", "Character", "Byte", "Short", "Long", "Float", "Double",
                                    ])
                                    replaceable.extend([
                                        "NullPointerException", "ArrayIndexOutOfBoundsException",
                                        "ClassCastException", "FileNotFoundException",
                                        "IOException", "ArithmeticException",
                                        "IllegalArgumentException", "RuntimeException",
                                        "OutOfMemoryError", "StackOverflowError", "Exception"
                                    ])
                                    pattern = r"import[&nbsp;]+(\w+(?:\.\w+)*);"
                                    matches: list[str] = re.findall(pattern, r)
                                    for ch in matches:
                                        replaceable.append(ch.split(".")[-1])
                                    replaceable.remove("is")
                                case ".js":
                                    replaceable.extend([
                                        "true", "false", "null", "undefined", "public", "void", "extends", "function",
                                        "static","new", "catch", "switch", "case", "var", "let", "const", "this"
                                    ])
                                    replaceable.remove("is")
                                case ".css":
                                    isCSS = True
                            if ex != ".py":
                                # JSDoc
                                # list elements starts '@' because of accurate detection
                                __doc__decorator.extend([
                                    "@abstract", "@access", "@alias", "@argument", "@async",
                                    "@augments", "@author", "@borrows", "@callback", "@classdesc",
                                    "@class", "@constant", "@constructor", "@constructs", "@implements",
                                    "@extends", "@private", "@protected", "@return", "@returns", "@throws",
                                    "@exceptions", "@exception", "@raises", "@global", "@yields", "@param"
                                ])
                            # String, Integer, __doc__, comment out
                            if ex != ".js":
                                stringObjectPattern = r'["?\'?]{1,3}[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%&$#\!|\=@\\\?_\*,./\`]+["?\'?]{1,3}'
                            else:
                                stringObjectPattern = r'["?\'?`?]{1,3}[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%&$#\!|\=@\\\?_\*,./\`]+["?\'?`?]{1,3}'
                            docStringObjectPattern = r'["?\'?]{3}[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^&%$#\!|\=@\\\?_\*,./\`<>]+["?\'?]{3}'
                            formatObjectPattern = r"{[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$&#\!|\=@\?_\*,./\`<>]+}"
                            commentOutObjectPattern = r"#[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$&#\!|\=@\?_\*,./\"\'\`]+<br>"
                            commentOutObjectPattern_ = r"//[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$&#\!|\=@\?_\*,./\"\'\`]+<br>"
                            found = re.findall(stringObjectPattern, r)
                            _found = re.findall(docStringObjectPattern, r)
                            __found = re.findall(formatObjectPattern, r)
                            __found_ = re.findall(commentOutObjectPattern, r)
                            __found__ = re.findall(commentOutObjectPattern_, r+"<br>")
                            __wr = '"wave-wrapper"'
                            _wa = "{"
                            __wa = "}"
                            #
                            # String object
                            for ep in found:
                                # delete reserved element not to be duped
                                r = r.replace(ep, f'<span class="StringObject">{ep.replace("reserved", "")}</span>')
                            # __doc__ in Python
                            for up in _found:
                                # as above
                                r = r.replace(up, f'<span class="DocStringObject">{up.replace("reserved", "")}</span>')
                            for rp in __found:
                                r = r.replace(rp, f'<span class="formatObject">{rp.replace("{", f"<span class={__wr}>{_wa}</span>").replace("}", f"<span class={__wr}>{__wa}</span>")}</span>')
                            for kp in __found_:
                                kp = kp[:-4]
                                r = r.replace(kp, f'<span class="commentOutObject">{kp.replace("reserved", "")}</span>')
                            # super doc object can't be withreserved class
                            #
                            for rep in replaceable:
                                for pre in ["&nbsp;", "<br>", "+", "-", "^", "*", "<", ">", "%", ",", "/", "{", "[", "(", "}", "]", ")", ".", ";"]:
                                    for suf in ["&nbsp;", "<br>", "+", "-", "^", "*", "<", ">", "%", ",", "/", "{", "[", "(", "}", "]", ")", ".", ";", ":"]:
                                        r = r.replace(pre+rep+suf, f'{pre}<span class="reserved">{rep}</span>{suf}')
                                if r[:len(rep)] == rep:
                                    r = f'<span class="reserved">{rep}</span>' + r[len(rep):]
                            # recapture again because of above
                            # no matter how many has stacked
                            # whink as it is only one
                            r = r.replace("(", '<span class="wrapper">(</span>')
                            r = r.replace(")", '<span class="wrapper">)</span>')
                            r = r.replace("{", '<span class="wave-wrapper">{</span>')
                            r = r.replace("}", '<span class="wave-wrapper">}</span>')
                            r = r.replace("[", '<span class="street-wrapper">[</span>')
                            r = r.replace("]", '<span class="street-wrapper">]</span>')
                            r = r.replace("\"\"", '<span class="StringObject">""</span>')
                            
                            r = r.replace('f<span class="StringObject">', '<span class="re-served">f</span><span class="StringObject">')
                            r = r.replace('r<span class="re-served">f', '<span class="re-served">rf')
                            prep = ""
                            _prep = ""
                            for _ in range(10):
                                prep += '<span class="StringObject">'
                                _prep += '<span class="RawStringObject">'
                            for j in range(10):
                                w = prep[:len(prep) -(27 *j)]
                                _w = _prep[:len(_prep) -(30 *j)]
                                r = r.replace(f'r{w}', f'<span class="re-served">r</span>{_w}')
                            if ex != ".py":
                                for dec in __doc__decorator:
                                    r = r.replace(dec, f'<span class="re-served">{dec}</span>')
                                r = r.replace("@", '<span class="re-served">@</span>')
                                if isJava:
                                    r = r.replace("@Override", f'@<span class="re-served">Override</span>')
                                for gp in __found__:
                                    gp = gp[:-4]
                                    r = r.replace(gp, f'<span class="commentOutObject">{gp}</span>')
                            if isCSS:
                                # span tag goes wrong when moved as like.
                                # 
                                # divide for each span tag
                                b = re.findall(r"[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$#\!|\=@\\\?_\*,./\&]+<span", r)[0]
                                r = r.replace(b, f'<span class="css-target">{b}<span')
                                _p = r"&nbsp;[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$#\!|\=@\\\?_\*,./\&]+:"
                                _al = re.findall(_p, r)
                                _past = []
                                for _a in _al:
                                    if _a not in _past:
                                        _past.append(_a)
                                        r = r.replace(_a, f'<span class="css-kw">{_a[:-1]}</span>:')
                                _laptop = r'<br>+[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$#\!|\=@\\\?_\*,./]+<span class="wave-wrapper">'
                                _pal = re.findall(_laptop, r)
                                _post = []
                                for _pl in _pal:
                                    if _pl not in _post:
                                        _post.append(_pl)
                                        r = r.replace(_pl, f'<span class="css-target">{_pl[:-27]}</span><span class="wave-wrapper">')
                                _pal.clear()
                                _pal.extend(re.findall(r'<br>+[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$#\!|\=@\\\?_\*,./]+<span class="formatObject">', r))
                                for _pl in _pal:
                                    if _pl not in _post:
                                        _post.append(_pl)
                                        r = r.replace(_pl, f'<span class="css-target">{_pl[:-27]}</span><span class="formatObject">')
                                _pal.clear()
                                _pal.extend(re.findall(r'</span>+[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$#\!|\=@\\\?_\*,./]+<span class="formatObject">', r))
                                _pal.extend(re.findall(r'</span>+[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$#\!|\=@\\\?_\*,./]+<span class="wave-wrapper">', r))
                                for _pl in _pal:
                                    if _pl not in _post:
                                        _post.append(_pl)
                                        r = r.replace(_pl, f'</span><span class="css-target">{_pl[7:-27]}</span><span class="formatObject">')
                                __p = r"[\d]+[\w]+"
                                lk = re.findall(__p, r)
                                _pal.clear()
                                for jo in lk:
                                    if jo not in _pal:
                                        _pal.append(jo)
                                        r = r.replace(jo, f'<span class="num">{jo}</span>')
                            if ex != ".py":
                                po = r"/[\*]{1,2}[\w\s\u3040-\u30FF\u4E00-\u9FFF\uFF00-\uFFEF\+\-\*\[\]\{\}\(\):;\~\^%$&#\!|\=@\\\?_\*,./<>\"\']+\*/"
                                oi = re.findall(po, r)
                                olsa = []
                                for ko in oi:
                                    if ko not in olsa:
                                        olsa.append(ko)
                                        r = r.replace(ko, f'<span class="commentOutObject">{ko.replace("reserved", "")}</span>')
                            extenction = _last[-_last[::-1].find("."):]
                            br = r"<br>"
                            _br = f"<br>\n"
                            max = len(re.findall(br, r))
                            linenum = ""
                            for k in range(max +1):
                                k += 1
                                linenum += f"{k}<br>"
                            r = re.sub(r"([\d]+)", r'<span class="num">\1</span>', r)
                            r = r.replace("<br>", _br)
                            counter = 1
                            # script which is embed on html
                            script = inspect.cleandoc("""
                                function g(n, u) {
                                    if (!u) u = window.location.href;
                                    n = n.replace(/[\[\]]/g, "\\$&");
                                    var regex = new RegExp("[?&]" + n + "(=([^&#]*)|&|#|$)"),
                                        re = regex.exec(u);
                                    if (!re) return null;
                                    if (!re[2]) return '';
                                    return decodeURIComponent(re[2].replace(/\+/g, " "));
                                }

                                window.onload = () => {
                                    var h = window.innerHeight;
                                    var v = g("v");
                                    var t = Number.parseInt(g("t"));
                                    var u = window.location.href;
                                    window.scroll({top: 0, behavior: "smooth"});
                                    if (navigator.userAgent.match(/iPhone|Android.+Mobile/)){
                                        $("#code-container").css("font-size", "9px");
                                        $("body").css("font-weight", "bold");
                                    }
                                    if (v == "re"){
                                        if (t != 0){
                                            if (t-1 == 0 || isNaN(t)){
                                                u = u.replace(`&t=${t}`, "").replace(`?v=${v}`, "");
                                            } else {
                                                u = u.replace(`&t=${t}`, `&t=${t-1}`);
                                            }
                                        }
                                        history.pushState({}, "", u);
                                    }
                                    $("#--player").css("padding-bottom", `${h-90}px`);
                                }
                                                    
                                function k(){
                                    window.scroll({top: 0, behavior: "smooth"});
                                }
                            """)
                            f.write(inspect.cleandoc(f"""
                                <!DOCTYPE html>
                                <html>
                                    <head>
                                        <title>{_last}</title>
                                        <script
                                            src="https://code.jquery.com/jquery-2.2.4.min.js"
                                            integrity="sha256-BbhdlvQf/xTY9gja0Dq3HiwQF8LaCRTXxZKRutelT44="
                                            crossorigin="anonymous"
                                            >
                                        </script>
                                        <script>
{script}
                                        </script>
                                        <link rel="stylesheet" href="/.stylesheets/vscode.css?r=src">
                                    </head>
                                    <body oncontextmenu="return false;">
                                        <div style="position: fixed;width: 100%;background-color: rgb(30,30,30);">
                                            <div class="-window">
                                                <div id="window-1" class="window-elem" style="display: flex;">
                                                    <img src="{ReqHTTP.extension_iconMap.get(ex, _vscode)}" style="width: 20px;height: 20px;">
                                                    <span style="padding-left: 2px;">{_last}</span>
                                                </div>
                                            </div>
                                            <div class="--hr"></div>
                                            <div class="-top-box"><span class="--path" onClick="k()">{_last} > </span><span class="--path">...</span></span></div>
                                        </div>
                                        <br><br>
                                        <div id="--player" style="display: flex;">
                                            <div id="divider-">&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                            <div id="line">
                                                <br>{linenum}
                                            </div>
                                            <div id="divider--">&nbsp;&nbsp;&nbsp;&nbsp;</div>
                                            <div id="code-container">
                                                <{extenction}><br>{r}<br></{extenction}>
                                            </div>
                                        </div>
                                    </body>
                                </html>
                            """))
                self.path = here
            except FileNotFoundError:
                ...

        super().do_GET()


def getLast(url: str):
    pattern = r'/([^/]+)$'
    mt = re.search(pattern, url)
    
    if mt:
        last_part = mt.group(1)
        if "?" in last_part: last_part = last_part[:last_part.find("?")]
        return last_part
    else:
        return ""


def replace_with_counter(max=None):
    global counter
    replacement = str(counter)
    for _ in range(len(str(max))-len(replacement)):
        replacement = "&nbsp;" + replacement
    counter += 1
    return '<br><span class="linenum">' + replacement + "</span>&nbsp;&nbsp;&nbsp;"


def removeQ_(url: str) -> str:
    if "?" in url: url = url[:url.find("?")]
    return url


def add_underline_to_url(text: str):
    if not text:
        return ""
    url_regex = "https?://[\w/:%#\$&\?\(\)~\.=\+\-]+"
    urls: list[str] = re.findall(url_regex, text)
    _l = []
    for url in urls:
        if url in _l:
            continue
        _l.append(url)
        link = f'<span class="unded">{url}</span>'
        text = text.replace(url, link)
    
    return text


def start(port: int, handler):
    server_address = ('', port)
    httpd = http.server.HTTPServer(server_address, ReqHTTP)
    print(f"HTTPserver has started on port: {port}")
    httpd.serve_forever()


server_thread = threading.Thread(target=start, args=(PORT, None))
server_thread.daemon = True
server_thread.start()

try:
    while 1:
        time.sleep(5)
except KeyboardInterrupt:
    exit("Thank you and good bye...")
