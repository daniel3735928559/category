""" Usage: build.sh <cat_name> <input_dir> <output_dir>"""

from os import listdir
from os.path import isfile, join
from lxml import etree
from io import StringIO, BytesIO
import subprocess, sys, docopt, json, os

from util import *

args = {}

def gen_html(filename, ID):
    global args
    dom = etree.parse(filename)
    ans = ""
    nodes = dom.xpath("//img")
    for n in nodes:
        url = n.get("src")
        print("FN",filename)
        new_url = get_file(ID, filename, url, args['<output_dir>'])
        if new_url: n.set("src", new_url)
    children = dom.getroot().getchildren()[0].getchildren()[0].getchildren()
    for c in children:
        ans += etree.tostring(c, pretty_print=True).decode() + "\n"
    return ans

if __name__ == "__main__":
    args = docopt.docopt(__doc__)
    old_metadata = import_metadata(join(args['<output_dir>'],'metadata.json'))
    metadata = {}
    files = search_files(args['<input_dir>'],".html")
    print(files)
    for f in files:
        print(f)
        try:
            tree = etree.parse(f)
        except:
            print("WARNING: Invalid XML: {} -- skipping".format(f))
            continue
        raw_date = os.path.basename(os.path.dirname(f))
        title = args['<cat_name>'] + raw_date
        ID = get_id(title)
        date = "{}-{}-{}".format(raw_date[:4],raw_date[4:6],raw_date[6:])
        if ID in metadata and metadata[ID]['name'] != title:
            print("WARNING: Duplicate node ID: {} -- skipping".format(node['name']))
            continue
        metadata[ID] = {'name':str(title), 'date':str(date), 'edges': {'has' : {}, 'is': {}}}
        edges = metadata[ID]['edges']

        # Generate HTML
        html = gen_html(f, ID)
        with open(join(args['<output_dir>'],ID+'.html'),"w") as f:
            f.write(html)
    metadata = complete_metadata(args['<cat_name>'],metadata)
    metadata.update(old_metadata)
            
    with open(join(args['<output_dir>'],'metadata.json'),"w") as f:
        f.write(json.dumps(metadata))
