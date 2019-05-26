"""Usage: build.py <input_dir> <output_dir> [rebuild]"""

import docopt, os, traceback
from . util import *
from . mdbuild import md_builder
from . xmlbuild import xml_builder
from . plugins import *

class cat_builder:
    def __init__(self, input_dir, output_dir, force_rebuild=False):
        md_file = os.path.join(output_dir,'metadata.json')
        self.md_time = 0
        self.metadata = {}
        if os.path.isfile(md_file) and not force_rebuild:
            self.metadata = import_metadata(md_file)
            self.md_time = os.path.getmtime(md_file)

        # We will remove IDs from this list as we go, leaving only the ones which no longer exist which will then be removed
        self.stale = {x for x in self.metadata}

        # The endings we understand and the classes that can read these files
        self.endings = {".md":md_builder, ".xml":xml_builder}

        # The name of the metadata file that that will contain edges for all nodes in a subdirectory
        self.metadata_conf = "metadata.conf"

        # The current set of edges read from a config file
        self.config_edges = {}

        # Save off all the source paths so we can check if a file has been compiled already
        srcs = {x.get('src','') for x in self.metadata.values()}
        
        for dirname,dirs,files in os.walk(input_dir):
            # Skip the OLD directory
            if "OLD" in dirname:
                print("skipping OLD")
                continue
            
            # Read the metadata
            if self.metadata_conf in files:
                print("found config in",dirname)
                with open(os.path.join(dirname, self.metadata_conf),"r") as f:
                    _,self.config_edges = parse_config(f.read())
                    
            # Now read the actual data files
            for fn in files:
                fn = os.path.join(dirname, fn)
                ending = fn[fn.rfind('.'):]
                if ending in self.endings:
                    if fn in srcs and os.path.getmtime(fn) < self.md_time:
                        print("Already up-to-date: ",fn)
                        continue
                    print("PROCESSING",fn)
                    args = {}
                    if ending == ".md":
                        args = {"plugins":{"slideshow":"md","math":{},"video":video.VideoPlugin(),"link":"txt","query":"txt"}}
                    builder = self.endings[ending](fn,output_dir,**args)
                    if not builder.OK:
                        print("WARNING: There was a problem building",fn)
                        continue
                    if builder.ID in self.stale: self.stale.remove(builder.ID)
                    if not 'name' in builder.node:
                        print("WARNING: No name found in",fn)
                        continue
                    self.metadata[builder.ID] = builder.node
                    common_prefix = os.path.commonprefix([input_dir, fn])
                    self.metadata[builder.ID]['src'] = os.path.relpath(fn, common_prefix)
                    if not 'edges' in self.metadata[builder.ID]: self.metadata[builder.ID]['edges'] = {'has':{},'is':{}}
                    edges = self.metadata[builder.ID]['edges']
                    add_edges(self.config_edges, edges)
                    with open(os.path.join(output_dir,'{}.html'.format(builder.ID)),"wb") as f:
                        f.write(builder.doc)
            
        self.metadata = complete_metadata(self.metadata)
        for x in self.metadata:
            print("MD",x,self.metadata[x])
        with open(os.path.join(output_dir,'metadata.json'),"w") as f:
            f.write(jsonenc().encode(self.metadata))

if __name__ == "__main__":
    args = docopt.docopt(__doc__)
    cat_builder(args['<input_dir>'], args['<output_dir>'],args['rebuild'])
