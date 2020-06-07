import hashlib, json, traceback, os, datetime, re, sys
from shutil import copyfile

class jsonenc(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.isoformat()
        elif isinstance(obj, datetime.date):
            return obj.isoformat()
        else:
            return super(jsonenc, self).default(obj)

def get_id(node):
    return hashlib.sha256(node.encode()).hexdigest()

def add_edges(src, dst):
    for et in src:
        if not et in dst:
            dst[et] = {}
        for en in src[et]:
            if not en in dst[et]: dst[et][en] = []
            for edge in src[et][en]:
                # May need to do some work here to prevent duplicates.......
                dst[et][en].append(edge)

def make_config(data, edges):
    ans = []
    for d in data:
        ans.append(f"{d}: {data[d]}")
    for e in edges.get('has',{}):
        for t in edges['has'][e]:
            ans.append(f"has {e}: {t['target']}")
            for ed in t:
                if ed == "target":
                    continue
                ans.append(f";{ed}={t[ed]}")
    for e in edges.get('is',{}):
        for t in edges['is'][e]:
            ans.append(f"is {e} of: {t['target']}")
            for ed in t:
                if ed == "target":
                    continue
                ans.append(f";{ed}={t[ed]}")
    return "\n".join(ans)

def parse_config(text):
    edges = {'has':{}, 'is':{}}
    data = {}
    for line in text.split("\n"):
        if len(line.strip()) == 0: continue
        # Check for "has" edge
        m = re.match(r"^\s*has\s+([^:]*):\s*(.*)\s*$", line)
        et = 'has'
        if not m:
            # Check for "is" edge
            m = re.match(r"^\s*is\s+([^:]*)\s+of:\s*(.*)\s*$", line)
            et = 'is'
            if not m:
                m = re.search(":\s*",line)
                if m:
                    et = None
                    data[line[:m.start()]] = line[m.end():]
                else:
                    sys.stderr.write("WARNING: Line not a valid edge: {}\n".format(line))
                    continue
        if et is None:
            continue
        en = m.group(1).strip()
        target = m.group(2).strip()
        edge_data_list = target.split(";")
        edge_data = {"target":edge_data_list[0].strip()}
        for edge_metadata in edge_data_list[1:]:
            edge_metadata = edge_metadata.strip()
            if not "=" in edge_metadata:
                sys.stderr.write("WARNING: Invalid edge metadata: {}\n".format(edge_metadata))
                continue
            k,v = edge_metadata.split("=",1)
            if k != "target":
                edge_data[k] = v
        if not en in edges[et]: edges[et][en] = []
        edges[et][en].append(edge_data)
    return data,edges

def get_file(ID, filename, input_url, output_dir):
    if input_url[:6] == "files/":
        input_path = input_url[6:]
        path = os.path.dirname(filename)
        files_dir = os.path.join(output_dir,'files',ID)
        os.makedirs(files_dir, exist_ok=True)
        try:
            os.mkdir(files_dir)
        except:
            pass
        src = os.path.join(path, input_url)
        dst = os.path.join(files_dir,input_path)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        print("COPY", src, dst)
        copyfile(src, dst)
        return "/out/files/"+ID+"/"+input_path

def search_files(base_path, ending):
    return [os.path.join(dirpath,f) for dirpath,dirnames,filenames in os.walk(base_path) for f in filenames if f[-len(ending):] == ending]

def import_metadata(fn):
    print("LOADING: {}".format(fn))
    try:
        with open(fn,"r") as f:
            data = json.loads(f.read())
    except:
        traceback.print_exc()
        print("WARNING: no existing metadata found -- assuming empty")
        return {}
    metadata = {}
    for node_id in data:
        node = data[node_id]
        name = node['name']
        metadata[name] = node
        metadata[name]['id'] = node_id
        metadata[name]['edges'] = {'has':{en:[data[edge["target"]]['name'] for edge in node['edges']['has'][en]] for en in node['edges']['has']}}

    return metadata

def get_targets(node):
    targets = set()
    for et in ['is','has']:
        for es in node.get('edges',{}).get(et,{}).values():
            for e in es:
                targets.add(e["target"])
    return targets

def create_subcat(metadata, node_list):
    # Want to return exactly only nodes in the node list and also constrain any links to this subset as well
    ans = {}
    duals = {'has':'is','is':'has'}
    node_set = set(node_list)
    for x in node_list:
        node = metadata[x]
        print(node)
        for et in duals:
            edges = node['edges'][et]
            for e in edges:
                edges[e] = [edge for edge in edges[e] if edge["target"] in node_set]
        ans[x] = node
    return ans

def edge_exists(edge, edgeset):
    for e in edgeset:
        if e['target'] != edge['target']:
            continue
        if 'srcloc' in edge and edge['srcloc'] != e.get('srcloc', None):
            continue
        if 'dstloc' in edge and edge['dstloc'] != e.get('dstloc', None):
            continue
        return True
    return False

def is_neighbour(node, potential_neighbour_name):
    duals = {'has':'is','is':'has'}
    for et in duals:
        for label in node['edges'][et]:
            for edge in node['edges'][et][label]:
                if edge['target'] == potential_neighbour_name:
                    return True
    return False

def complete_metadata(metadata):
    print("completing",metadata)
    duals = {'has':'is','is':'has'}
    name_to_id = {}
    ans = {}

    # First, add edges
    for node in metadata.values():
        if not 'edges' in node: node['edges'] = {ed:{} for ed in duals}
    
    # Now, collect all the nodes, explicit and implicit

    # Start with the explicit ones:
    for node in metadata.values():
        node_id = node.get('id',get_id(node['name']))
        name_to_id[node['name']] = node_id
        ans[node_id] = {x:node[x] for x in node}
        ans[node_id]['edges'] = {'has':{},'is':{}}

    # Now go through and find all the implicit ones and give them IDs in name_to_id:
    targets = set()
    for node in metadata.values():
        for et in duals:
            if not et in node['edges']: node['edges'][et] = {}
            edges = node['edges'][et]
            for label in edges:
                targets = targets.union({e['target'] for e in edges[label]})
                
    for node_name in targets:
        if not node_name in name_to_id:
            node_id = get_id(node_name)
            print("Implicit node found: {} (ID={})".format(node_name, node_id))
            name_to_id[node_name] = node_id

            # Go through all nodes and get categories of all
            # neighbours.  If there is a clear winner (over 80% of
            # neighbours all have the same category), assign that
            # category.  Otherwise, assign the "uncategorised"
            # category.
            category_votes = {}
            for node in metadata.values():
                if not is_neighbour(node, node_name): continue
                cat = node.get('edges',{}).get('has',{}).get('category',[None])[0]
                if not cat is None:
                    cat = cat["target"]
                if cat == node_name:
                    cat = None
                    break
                category_votes[cat] = category_votes.get(cat,0)+1
                tot = sum(category_votes.values())
                for c in category_votes:
                    if category_votes[c]/tot >= 0.8: cat = c
            print("C selected:",cat)
            metadata[node_name] = {'auto':'yes','name':node_name,'edges':{'has':{'category':[{"target":cat}]} if cat else {},'is':{}}}
            ans[node_id] = {'auto':'yes','name':node_name,'edges':{'has':{},'is':{}}}
            
            
    # Now every node--explicit and implicit--has an ID and an entry in
    # ans (without edges).  Go through and populate edges and dual
    # edges in ans
    for node in metadata.values():
        node_id = name_to_id[node['name']]
        print("fixing", node['name'], node_id)
        # Add all edges and duals
        for et in duals:
            edges = node['edges'][et]
            for e in edges:
                for edge in edges[e]:
                    # Replace edge target name with id
                    target_id = name_to_id[edge["target"]]

                    # Construct the new edge and the dual edge--all properties are copied except target is swapped, and srcloc/dstloc are swapped
                    new_edge = {"target": target_id}
                    dual_edge = {"target":node_id}
                    for emd in edge:
                        if emd == "target":
                            continue
                        elif emd == "srcloc":
                            new_edge["srcloc"] = edge[emd]
                            dual_edge["dstloc"] = edge[emd]
                        elif emd == "dstloc":
                            new_edge["dstloc"] = edge[emd]
                            dual_edge["srcloc"] = edge[emd]
                        else:
                            new_edge[emd] = edge[emd]
                            dual_edge[emd] = edge[emd]
                    # Add edge
                    if not e in ans[node_id]['edges'][et]:
                        ans[node_id]['edges'][et][e] = []
                    if not edge_exists(edge, ans[node_id]['edges'][et][e]):
                        ans[node_id]['edges'][et][e].append(new_edge)
                    # Add dualised edge
                    if not e in ans[target_id]['edges'][duals[et]]:
                        ans[target_id]['edges'][duals[et]][e] = []
                    if not edge_exists(dual_edge, ans[target_id]['edges'][duals[et]][e]):
                        ans[target_id]['edges'][duals[et]][e].append(dual_edge)

    return ans
