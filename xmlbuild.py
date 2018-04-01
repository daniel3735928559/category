from lxml import etree
import docopt
from util import *

class xml_builder:
    def __init__(self, filename, output_dir):
        self.OK = False
        self.output_dir = output_dir
        try:
            tree = etree.parse(filename)
        except:
            print("WARNING: Invalid XML: {} -- skipping".format(filename))
            return
        title = tree.xpath("/node/@title")[0]
        date = tree.xpath("/node/@date")[0]
        tags = tree.xpath("/node/edge")
        self.ID = get_id(title)
        self.node = {'name':str(title), 'date':str(date), 'src':filename, 'edges': {'has' : {}, 'is': {}}}
        edges = self.node['edges']
        for t in tags:
            ed,en = t.get('dir'),t.get('name')
            if not en in edges[ed]: edges[ed][en] = []
            edges[ed][en].append(t.text)

        # Generate HTML
        self.doc = bytes(self.gen_html(filename),'utf-8')
        self.OK = True

    def gen_html(self,filename):
        dom = etree.parse(filename)
        xslt = etree.parse("node.xsl")
        transform = etree.XSLT(xslt)
        newdom = transform(dom)
        return etree.tostring(newdom, pretty_print=True).decode()

if __name__ == "__main__":
    args = docopt.docopt(""" Usage: xmlbuild.sh <input_file> <output_dir>""")
    xml_builder(args['<input_file>'],args['<output_dir>'])
