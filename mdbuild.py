"""Usage: build.py <input_dir> <output_dir>"""

from io import StringIO
from os import listdir
from os.path import isfile, join
import panflute as pf
import yaml, sys, re, hashlib, json, docopt, os, traceback
from util import *

node = {}
metadata = {}

def extract_metadata(elem, doc):
    global node
    if (isinstance(elem, pf.Code) or isinstance(elem, pf.CodeBlock)):
        if 'edges' in elem.classes:
            if not 'edges' in node: node['edges'] = {'has':{}, 'is':{}}
            for line in elem.text.split("\n"):
                m = re.match(r"^\s*has\s+([^:]*):\s*(.*)\s*$", line)
                et = 'has'
                if not m:
                    m = re.match(r"^\s*is\s+([^:]*)\s+of:\s*(.*)\s*$", line)
                    et = 'is'
                    if not m:
                        sys.stderr.write("WARNING: Line not a valid edge: {}\n".format(line))
                        continue
                en = m.group(1)
                target = m.group(2)
                edges = node['edges'][et]
                if not en in edges: edges[en] = []
                edges[en].append(target)
            return []
        elif 'info' in elem.classes:
            data = yaml.load(elem.text)
            if not 'name' in data:
                sys.stderr.write("WARNING: 'name' required in info\n")
                return []
            node['name'] = data['name']
            return []
            

if __name__ == "__main__":
    args = docopt.docopt(__doc__)
    metadata = import_metadata(join(args['<output_dir>'],'metadata.json'))
    if len(metadata) == 0:
        print("WARNING: no existing metadata found -- assuming empty")
    files = [join(dirpath,f) for dirpath,dirnames,filenames in os.walk(args['<input_dir>']) for f in filenames]
    for fn in files:
        print(fn)
        node = {}
        try:
            with open(fn,"rb") as f:
                doc = pf.convert_text(f.read().decode(),standalone=True)
            doc = doc.walk(extract_metadata)
            ID = get_id(node['name'])
            if ID in metadata and metadata[ID]['name'] != node['name']:
                print("WARNING: Duplicate node ID: {} -- skipping".format(node['name']))
                continue
        except Exception as e:
            print("WARNING: Invalid input file: {} -- skipping".format(fn))
            traceback.print_exc()
            continue
        metadata[ID] = node
        with open(join(args['<output_dir>'],'{}.html'.format(ID)),"w") as f:
            f.write(pf.convert_text(doc, input_format='panflute',output_format='html'))
    metadata = complete_metadata(metadata)
    with open(join(args['<output_dir>'],'metadata.json'.format(ID)),"w") as f:
        f.write(json.dumps(metadata))
