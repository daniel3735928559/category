import os, json, hashlib, re, sys

def get_id(node):
    return hashlib.sha256(node.lower().encode()).hexdigest()

class ANode:
    def __init__(self, auto=True, loc=None, parent=None):
        self.name = ''
        self.parent = parent
        self.auto = auto
        self.loc = loc
        self.args = {}

    def get_name(self):
        if self.loc is None:
            return self.name
        else:
            return f"{self.parent.name} #{self.loc}"
        
    def get_id(self):
        if not self.loc is None:
            if len(self.parent.name) == 0:
                raise Exception("Parent name undefined")
            parentid = get_id(self.parent.name)
            return f"{parentid}_{self.loc}"
        elif len(self.name) == 0:
            raise Exception("Name undefined")
        return get_id(self.name)
        
    def to_json(self):
        nodeid = self.get_id()
        ans = {"name":self.get_name(), "auto":self.auto, "_id":nodeid, "_key":nodeid}
        if not self.parent is None:
            ans['parent'] = self.parent.get_id()
        for arg in self.args:
            if not arg in {"_id", "_key", "_rev", "name"}:
                ans[arg] = self.args[arg]
        return ans

class AEdge:
    def __init__(self, src, dst, label, args=None):
        self.src = src
        self.dst = dst
        self.label = label
        if args is None:
            self.args = {}
        else:
            self.args = {a:args[a] for a in args}

    def get_src_id(self):
        ans = ""
        if isinstance(self.src, ANode):
            ans = self.src.get_id()
        else:
            ans = get_id(self.src)
        if 'srcloc' in self.args:
            ans += "_{}".format(self.args['srcloc'])
        return ans
    
    def get_dst_id(self):
        ans = ""
        if isinstance(self.dst, ANode):
            ans = self.dst.get_id()
        else:
            ans = get_id(self.dst)
        if 'dstloc' in self.args:
            ans += "_{}".format(self.args['dstloc'])
        return ans
            
    def to_json(self):
        srcid = self.get_src_id()
        dstid = self.get_dst_id()
        ans = {"_id":f"edges/{srcid}_{dstid}_{self.label}", "_from":f"nodes/{srcid}", "_to":f"nodes/{dstid}", "label":self.label, "internal":('srcloc' in self.args or 'dstloc' in self.args)}
        for arg in self.args:
            if not arg in {"_to", "_from", "label" "srcloc", "dstloc"}:
                ans[arg] = self.args[arg]
        return ans

class AGraph:
    def __init__(self):
        self.nodes = {} # id -> ANode object
        self.edges = [] # list of AEdge objects

    # Parse an edge specified in `text` in the context of a specified `node`
    def parse_edge(self, node, text, edge_data={}):
        loc = edge_data.get('loc',None)
        text = text.strip()
        m = re.match(r"^\s*has\s+([^:]*):\s*(.*)\s*$", text)
        direction = 'out'
        if not m:
            # Check for "is" edge
            m = re.match(r"^\s*is\s+([^:]*)\s+of:\s*(.*)\s*$", text)
            direction = 'in'
            if not m:
                return None
        label = m.group(1).strip()
        target = m.group(2).strip()

        # parse edge metadata in the form of has X: Y # key1=val1 # key2=val2 # ...
        edge_data_list = target.split("#")
        target_node_name = edge_data_list[0].strip()
        target_node = self.get_node_by_name(target_node_name, srcfile=node.args.get('src',None))
        for edge_metadata in edge_data_list[1:]:
            edge_metadata = edge_metadata.strip()
            if not "=" in edge_metadata:
                sys.stderr.write("WARNING: Invalid edge metadata: {}\n".format(edge_metadata))
                continue
            k,v = edge_metadata.split("=",1)
            if k != "target" and k != "label":
                edge_data[k] = v
        if direction == 'out':
            if not loc is None:
                edge_data['srcloc'] = loc
            e = AEdge(node, target_node, label, edge_data)
            e.args['src'] = node.args.get('src',None)
            self.add_edge(e)
            return e
        elif direction == 'in':
            if not loc is None:
                edge_data['dstloc'] = loc
            e = AEdge(target_node, node, label, edge_data)
            e.args['src'] = node.args.get('src',None)
            self.add_edge(e)
            return e

    def extract_name(self, text):
        for line in text.split("\n"):
            m = re.search('name:\s*',line)
            if m:
                return line[m.end():].strip()
        raise Exception("Config found without name:", text)
            
    # Parse config lines from the context of `node`
    def parse_config(self, text, srcfile=None):
        # This is being built from an actual node file, so it is not an auto node
        name = self.extract_name(text)
        node = self.get_node_by_name(name)
        
        # Maybe we had this node from before as an auto node, but now we know it is not
        node.auto = False
        if not srcfile is None:
            node.args['src'] = srcfile
        
        for line in text.split("\n"):
            if len(line.strip()) == 0: continue
            # Check for "has" edge
            e = self.parse_edge(node, line)
            if e is None:
                m = re.search(":\s*",line)
                if m:
                    node.args[line[:m.start()].strip()] = line[m.end():].strip()
                else:
                    sys.stderr.write("WARNING: Line not a valid configuration item: {}\n".format(line))
                    continue
            # else:
            #     self.add_edge(e)
        
        self.add_node(node)
        return node

    def get_node_by_id(self, nodeid, srcfile=None):
        if not nodeid in self.nodes:
            self.nodes[nodeid] = ANode(auto=True)
            if not srcfile is None:
                self.nodes[nodeid].args['src'] = srcfile
        return self.nodes[nodeid]
        
    def get_node_by_name(self, name, loc=None, srcfile=None):
        if not loc is None:
            nodeid = get_id(name) + f"_{loc}"
        else:
            nodeid = get_id(name)
        if not nodeid in self.nodes:
            new_node = ANode(auto=True)
            if not srcfile is None:
                new_node.args['src'] = srcfile
            new_node.name = name
            self.nodes[nodeid] = new_node
        return self.nodes[nodeid]
    
    def get_nodes(self):
        return [n.to_json() for n in self.nodes]
    
    def get_edges(self):
        return [e.to_json() for e in self.edges]

    def add_node(self, node):
        self.nodes[node.get_id()] = node

    def add_edge(self, edge):
        self.edges.append(edge)
        
    def write(self, path):
        print("NODES")
        print(self.nodes)
        print("EDGES")
        print(self.edges)
        with open(os.path.join(path, "edges.jsonl"), "w") as f:
            for e in self.edges:
                f.write(json.dumps(e.to_json())+"\n")
        with open(os.path.join(path, "nodes.jsonl"), "w") as f:
            for n in self.nodes:
                f.write(json.dumps(self.nodes[n].to_json())+"\n")
        with open(os.path.join(path, "metadata.json"), "w") as f:
            ans = {"nodes":[self.nodes[n].to_json() for n in self.nodes],"edges":[e.to_json() for e in self.edges]}
            f.write(json.dumps(ans))
            return ans
