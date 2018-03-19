""" Usage: build.sh <input_dir> <output_dir>"""

from os import listdir
from os.path import isfile, join
from lxml import etree
from io import StringIO, BytesIO
import subprocess, sys, docopt, json

from util import *

def gen_html(filename):
    dom = etree.parse(filename)
    xslt = etree.parse("node.xsl")
    transform = etree.XSLT(xslt)
    newdom = transform(dom)
    return etree.tostring(newdom, pretty_print=True).decode()

if __name__ == "__main__":
    args = docopt.docopt(__doc__)
    metadata = import_metadata(join(args['<input_dir>'],'metadata.json'))
    files = [f for f in listdir(args['<input_dir>']) if isfile(join(args['<input_dir>'], f))]
    for f in files:
        f = join(args['<input_dir>'],f)
        try:
            tree = etree.parse(f)
        except:
            print("WARNING: Invalid XML: {} -- skipping".format(f))
            continue
        title = tree.xpath("/node/@title")[0]
        ID = get_id(title)
        date = tree.xpath("/node/@date")[0]
        tags = tree.xpath("/node/edge")
        
        if ID in metadata and metadata[ID]['name'] != title:
            print("WARNING: Duplicate node ID: {} -- skipping".format(node['name']))
            continue
        metadata[ID] = {'name':str(title), 'date':str(date), 'edges': {'has' : {}, 'is': {}}}
        edges = metadata[ID]['edges']
        for t in tags:
            ed,en = t.get('dir'),t.get('name')
            if not en in edges[ed]: edges[ed][en] = []
            edges[ed][en].append(t.text)
        html = gen_html(f)
        with open(join(args['<output_dir>'],ID+'.html'),"w") as f:
            f.write(html)
    metadata = complete_metadata(metadata)
            
    with open(join(args['<output_dir>'],'metadata.json'),"w") as f:
        f.write(json.dumps(metadata))
