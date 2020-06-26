from io import StringIO
from os import listdir
from os.path import isfile, join, dirname
from shutil import copyfile
import panflute as pf
import yaml, sys, re, hashlib, json, os, traceback, urllib.parse

sys.path.append(os.path.join(os.path.dirname(__file__), "../.."))
from util import *

def md_set_edges(filename, new_edges):
    def action(elem, doc):
        if (isinstance(elem, pf.Code) or isinstance(elem, pf.CodeBlock)) and 'info' in elem.classes:
            data,old_edges = parse_config(elem.text)
            elem.text = make_config(data, new_edges)
    
    with open(filename,"rb") as f:
        doc = pf.convert_text(f.read().decode(),standalone=True)
        
    pf.run_filter(action, doc=doc)
    
    with open(filename,"wb") as f:
        f.write(pf.convert_text(doc, input_format='panflute',output_format='markdown', standalone=True).encode('utf-8'))


class md_builder:
    def __init__(self, filename, output_dir, extra_edges, plugins={}, md_only=True):
        print("BUILDING",filename)
        self.OK = False
        # Things to be processed upstream:
        self.config = ''
        self.extra_edges = extra_edges
        self.locations = {} # loc_id -> [edge list]
        self.src = os.path.realpath(filename)
        self.fulltext = [] # will be converted to single string containing all the plaintext nodes' content by the end
        # End of things to be processed
        self.md_only = md_only
        self.current_loc = 0
        self.node = None
        self.filename = filename
        self.output_dir = output_dir
        self.plugins = plugins
        with open(filename,"rb") as f:
            doc = pf.convert_text(f.read().decode(),standalone=True)
        doc = doc.walk(self.extract_metadata)
        self.doc = pf.convert_text(doc, input_format='panflute',output_format='html').encode('utf-8')
        self.fulltext = " ".join(self.fulltext)
        self.OK = True

    # def add_edge(self, direction, label, edgedata):
    #     if not label in self.node['edges'][direction]:
    #         self.node['edges'][direction][label] = []
    #     self.node['edges'][direction][label].append(edgedata)
    #     self.edges['has'] = edgedata
        
    def extract_metadata(self, elem, doc):
        if isinstance(elem, pf.Str):
            self.fulltext.append(elem.text)
        if (isinstance(elem, pf.Code) or isinstance(elem, pf.CodeBlock)):
            if 'info' in elem.classes:
                # TODO: move to build.py
                # self.node = self.graph.parse_config(elem.text)
                # for e in self.extra_edges:
                #     self.graph.parse_edge(self.node, e)
                self.config = elem.text
                self.name = extract_name(elem.text)
                self.ID = get_id(self.name)
                return []
            else:
                if self.md_only:
                    return []
                for p in self.plugins:
                    if p in elem.classes:
                        plugin = self.plugins[p]
                        if hasattr(plugin, 'get_files'):
                            plugin.get_files(elem, lambda fn: get_file(self.ID, self.filename, fn, self.output_dir))
                        if self.plugins[p] == "md":
                            inner_doc = pf.convert_text(elem.text,standalone=True)
                            inner_doc = inner_doc.walk(self.extract_metadata)
                            inner_doc = pf.convert_text(inner_doc, input_format='panflute',output_format='html')
                        else:
                            inner_doc = elem.text
                        return pf.RawBlock("""<cat-{pluginname}>{doc}</cat-{pluginname}>""".format(pluginname=p,doc=inner_doc),format="html")
        elif isinstance(elem, pf.Link) and len(elem.content) > 0 and hasattr(elem.content[0],'text') and elem.content[0].text == "loc":
            url = urllib.parse.unquote(elem.url)
            loc = self.current_loc
            self.current_loc += 1
            #loc_node = ANode(auto=False, loc=loc, parent=self.node)
            self.locations[loc] = []
            #self.graph.add_node(loc_node)
            for e in url.split(";"):
                e = e.strip()
                self.locations[loc].append(e)
                #edge = self.graph.parse_edge(self.node, e, edge_data={"loc":loc})
            return pf.RawInline("""<a name="node_loc_{}"></a>""".format(loc),format="html")
            
        elif isinstance(elem, pf.Link) or isinstance(elem, pf.Image):
            if self.md_only:
                print("MD ONLY, SO SKIPPING")
                return []
            new_url = get_file(self.ID, self.filename, elem.url, self.output_dir)
            print("URL",elem.url)
            if new_url:
                elem.url = new_url
            elif elem.url[:5] == "node:":
                target = urllib.parse.unquote(elem.url[5:])
                print("LINK",target)
                return pf.RawInline("""<cat-link>{}:{}</cat-link>""".format(get_id(target),target),format="html")
            elif elem.url[:6] == "query:":
                q = urllib.parse.unquote(elem.url[6:])
                print("QUERY",q)
                return pf.RawInline("""<cat-query>{}</cat-query>""".format(q),format="html")
        elif isinstance(elem, pf.Math):
            if self.md_only:
                return []
            print("MATH",elem.text)
            return pf.RawInline("""<cat-math>{}</cat-math>""".format(elem.text),format="html")

if __name__ == "__main__":
    import docopt
    args = docopt.docopt("""Usage: mdbuild.py <input_file> <output_dir>""")
    md_builder(args['<output_dir>'])
    
