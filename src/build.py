"""Usage: build.py <input_dir> <output_dir> [rebuild]"""

import docopt, os, traceback, copy
from multiprocessing import Process, Queue
#from queue import Queue
from . util import *
from . agraph import *
#from . backends.xml.handler import xml_builder
from . backends.md.handler import md_builder
from . backends.md.plugins import *

NUM_WORKERS=20

def build_worker(inputs, outputs, build_only_new=False, md_only=True):
    for input_dir, output_dir, fn, extra_edges, md_time in iter(inputs.get, 'STOP'):
        ans = {'empty':True}
        try:
            ending = fn[fn.rfind('.'):]
            endings = {
                ".md":md_builder,
                #".xml":xml_builder
            }
            if ending in endings:
                ans['empty'] = False
                common_prefix = os.path.commonprefix([input_dir, fn])
                src_path = os.path.relpath(fn, common_prefix)
                if os.path.getmtime(fn) < md_time and build_only_new:
                    print("ALREADY DONE",fn)
                    ans['error'] = "Already up-to-date: {}".format(fn)
                    ans['empty'] = True
                else:
                    print("PROCESSING",fn)
                    args = {}
                    if ending == ".md":
                        args = {"md_only":md_only,"plugins":{"slideshow":"md","math":{},"video":video.VideoPlugin(),"link":"txt","query":"txt","jsavr":"txt"}}
                    builder = endings[ending](fn,output_dir,extra_edges,**args)
                    if not builder.OK:
                        ans['error'] = "WARNING: There was a problem building {}".format(fn)
                    else:
                        ans['error'] = None
                        ans['builder'] = builder
        except Exception as e:
            ans['error'] = f"Exception building: {fn}:\n" + traceback.format_exc()
            ans['empty'] = False
        outputs.put(ans)

class cat_builder:
    def __init__(self, input_dir, output_dir, build_new_only=True, metadata_only=False):
        md_file = os.path.join(output_dir,'metadata.json')
        self.md_time = 0
        self.metadata = {}
        self.agraph = AGraph()
        if os.path.isfile(md_file) and build_new_only:
            self.metadata = import_metadata(md_file)
            self.md_time = os.path.getmtime(md_file)

        input_queue = Queue()
        output_queue = Queue()
        num_inputs = 0
        #by_src = {self.metadata[node_id]['src']:self.metadata[node_id]['id'] for node_id in self.metadata if 'src' in self.metadata[node_id]}

        # The name of the metadata file that that will contain edges for all nodes in a subdirectory
        self.metadata_conf = "metadata.conf"

        # The current set of edges read from a config file
        self.config_edges = {}
        
        # Save off all the source paths so we can check if a file has been compiled already
        srcs = {x.get('src','') for x in self.metadata.values()}

        # If we're not rebuilding, iterate through the metadata
        # elements and remove those whose source files no longer exist
        # if not force_rebuild:
        #     to_del = []

        #     # Look for removed nodes
        #     for node_id in self.metadata:
        #         if 'src' in self.metadata[node_id] and not os.path.exists(os.path.join(input_dir, self.metadata[node_id]['src'])):
        #             to_del.append(node_id)
                    
        #     for node_id in to_del:
        #         del self.metadata[node_id]
        
        for dirname,dirs,files in os.walk(input_dir):
            # Skip the OLD directory
            print("DN",dirname)
            if dirname[-len("/OLD"):] == "/OLD" or dirname[-len("/files"):] == "/files":
                print("SKIPPING: {}".format(dirname))
                continue
            
            # Read the metadata
            if self.metadata_conf in files:
                ce = []
                with open(os.path.join(dirname, self.metadata_conf),"r") as f:
                    for l in f:
                        l = l.strip()
                        if len(l) > 0:
                            ce.append(l)
                    self.config_edges[dirname] = ce

            # Assemble the config edges that are relevant to this directory
            config_edges = self.config_edges.get(dirname,[])
            for d in self.config_edges:
                if os.path.abspath(dirname).startswith(os.path.abspath(d)+os.sep):
                    config_edges += self.config_edges[d]
            print("CONFIG EDGES", dirname, config_edges)
            
            # Now read the actual data files
            for fn in files:
                if fn[0] == ".":
                    continue
                fn = os.path.join(dirname, fn)
                input_queue.put([input_dir, output_dir, fn, config_edges, self.md_time])
                num_inputs += 1

        # Now start the workers
        for i in range(NUM_WORKERS):
            Process(target=build_worker, args=(input_queue, output_queue, build_new_only, metadata_only)).start()

        for i in range(NUM_WORKERS):
            input_queue.put('STOP')
            
        #input_queue.put('STOP')
        #build_worker(input_queue, output_queue, self.agraph, build_new_only, metadata_only)
        
        errors = []
        
        # The results should come in output_queue
        for i in range(num_inputs):
            ans = output_queue.get()
            print("GOT",i,ans)
            if ans['empty']: continue
            elif not ans['error'] is None:
                errors.append(ans['error'])
                continue
            builder = ans['builder']

            # Collect the info from the builder and add it to the graph:
            print("BUILDING FROM",builder.src)
            current_node = self.agraph.parse_config(builder.config, srcfile=str(builder.src))
            current_node.args['snippet'] = " ".join(builder.fulltext[:200].split()[:-1])+"..."
            for e in builder.extra_edges:
                ed = self.agraph.parse_edge(current_node, e)
                print("EXTRA EDGE",ed.args.get('src',None))
                
            for loc in builder.locations:
                loc_node = ANode(auto=False, loc=loc, parent=current_node)
                loc_node.args['src'] = builder.src
                self.agraph.add_node(loc_node)
                e = AEdge(loc_node, current_node, "parent")
                e.args['src'] = str(builder.src)
                self.agraph.add_edge(e)
                for e in builder.locations[loc]:
                    self.agraph.parse_edge(current_node, e, edge_data={"loc":loc})
            
            # Actually write the output document
            if not metadata_only:
                # Get the path of the file to write the processed document to
                output_path = os.path.join(output_dir,'{}.html'.format(current_node.get_id()))
                print("WRITING {}: {} -> {}".format(current_node.get_name(), current_node.args['src'], output_path))
                with open(output_path,"wb") as f:
                    f.write(builder.doc)

            # debug: print the graph
            # for n in self.agraph.nodes:
            #     print(self.agraph.nodes[n].to_json())
            # for e in self.agraph.edges:
            #     print(e.to_json())
        
        # add category edges to every non-category node:
        # categories = set()
        # nodes = {self.agraph.nodes[n].get_id():"" for n in self.agraph.nodes if not n in categories}
        # for e in self.agraph.edges:
        #     if e.label == "category":
        #         c = e.get_dst_id()
        #         categories.add(c)
        #         nodes[e.get_src_id()] = c

        # auto_assignments = {n:{} for n in nodes if len(nodes[n]) == 0 and not n in categories}
        # def add_candidate(n, c):
        #     if not c in auto_assignments[n]:
        #         auto_assignments[n][c] = 0
        #     auto_assignments[n][c] += 1
        # for e in self.agraph.edges:
        #     src,dst = e.get_src_id(),e.get_dst_id()
        #     if src in auto_assignments and not dst in auto_assignments:
        #         add_candidate(src, dst)
        #     elif not src in auto_assignments and dst in auto_assignments:
        #         add_candidate(dst, src)
        # for n in auto_assignments:
        #     best_score = -1
        #     candidate = ""
        #     for c in auto_assignments[n]:
        #         if auto_assignments[n][c] > best_score:
        #             best_score = auto_assignments[n][c]
        #             candidate = c
        #     self.agraph.add_edge(AEdge(n, candidate, "category"))

        # Now every non-category node should have a category
            
        self.agraph.write(output_dir)
        
        if len(errors) > 0:
            print("ERRORS: ", "\n-----\n".join(errors))
        
if __name__ == "__main__":
    args = docopt.docopt(__doc__)
    cat_builder(args['<input_dir>'], args['<output_dir>'],args['rebuild'])
