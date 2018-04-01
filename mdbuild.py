

from io import StringIO
from os import listdir
from os.path import isfile, join, dirname
from shutil import copyfile
import panflute as pf
import yaml, sys, re, hashlib, json, os, traceback
from util import *

class md_builder:
    def __init__(self, filename, output_dir):
        self.OK = False
        self.ID = ''
        self.node = {}
        self.filename = filename
        self.output_dir = output_dir
        with open(filename,"rb") as f:
            doc = pf.convert_text(f.read().decode(),standalone=True)
        doc = doc.walk(self.extract_metadata)
        self.doc = pf.convert_text(doc, input_format='panflute',output_format='html').encode('utf-8')
        self.OK = True

    def extract_metadata(self, elem, doc):
        if (isinstance(elem, pf.Code) or isinstance(elem, pf.CodeBlock)):
            if 'edges' in elem.classes:
                if not 'edges' in self.node: self.node['edges'] = {'has':{}, 'is':{}}
                edges = self.node['edges']
                new_edges = parse_config(elem.text)                
                add_edges(new_edges, edges)
                return []
            elif 'info' in elem.classes:
                data = yaml.load(elem.text)
                if not 'name' in data:
                    sys.stderr.write("WARNING: 'name' required in info\n")
                    return []
                self.node = {x:data[x] for x in data}
                print(self.node)
                self.ID = get_id(self.node['name'])
                return []
        elif isinstance(elem, pf.Link) or isinstance(elem, pf.Image):
            new_url = get_file(self.ID, self.filename, elem.url, self.output_dir)
            if new_url: elem.url = new_url
        elif isinstance(elem, pf.Math):
            print("MATH",elem.text)
            return pf.Str("$"+elem.text+"$")

if __name__ == "__main__":
    import docopt
    args = docopt.docopt("""Usage: mdbuild.py <input_file> <output_dir>""")
    md_builder(args['<output_dir>'])
    
