import sys
import re
from subprocess import check_output
import os

if __name__ == "__main__":
    
    if len(sys.argv) == 2:
        htmlname = sys.argv[1]
    else:
        htmlname = "../index.html"

    PREFIX = "/".join(htmlname.split("/")[:-1]) + "/"
    if "/" not in htmlname:
        PREFIX = ""

    def babel(source):
        return check_output(["node", PREFIX+"buildtools/node_modules/babel-cli/bin/babel.js", source, "--presets", PREFIX+"buildtools/node_modules/babel-preset-es2015-ie"])


    with open(htmlname, "r") as htmlfile:
        regex = ur'<script\s+((src|[^\"]+)=\"([^\"]*)\"\s*)*?>[^<]*<\/script>'
        body = htmlfile.read()
        matches = re.finditer(regex, body)

        delindexes = []
        scripts = []

        for matchNum, match in enumerate(matches):            
            grps = match.groups()

            if grps[1] == "src":
                scripts.append(grps[2])
                delindexes.append((match.start(), match.end()))

        delindexes = sorted(delindexes)[::-1]
        for i in delindexes:
            body = body[:i[0]] + body[i[1]:]

        concatscripts = ""
        ignore = [
            "lib/phaser.min.js"
        ]

        for s in scripts:
            js = ""
            if s not in ignore and s.startswith("js/"):
                with open(PREFIX+s, "r") as scriptfile:
                    js = scriptfile.read()
                concatscripts += js + "\n//=======================\n"
            else:
                ignore.append(s)
                ignore = list(set(ignore))
        
        temp_name = "temp.js"

        with open(temp_name, "w+") as temp:
            temp.write(concatscripts)
        concatscripts = babel(temp_name)
        os.remove(temp_name)

        body = body[:delindexes[-1][0]] + "".join("<script src='{}'></script>".format(s) for s in ignore) + "<script>{}</script>".format(concatscripts) + body[delindexes[-1][0]:]

        with open(".".join(htmlname.split(".")[:-1]) + "-mini.html", "w+") as o:
            o.write(body)