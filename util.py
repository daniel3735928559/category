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
        for en in src[et]:
            if not en in dst[et]: dst[et][en] = []
            for target in src[et][en]:
                if not target in dst[et][en]:
                    dst[et][en].append(target)

def parse_config(data):
    edges = {'has':{}, 'is':{}}
    for line in data.split("\n"):
        if len(line.strip()) == 0: continue
        m = re.match(r"^\s*has\s+([^:]*):\s*(.*)\s*$", line)
        et = 'has'
        if not m:
            m = re.match(r"^\s*is\s+([^:]*)\s+of:\s*(.*)\s*$", line)
            et = 'is'
            if not m:
                sys.stderr.write("WARNING: Line not a valid edge: {}\n".format(line))
                continue
        en = m.group(1).strip()
        target = m.group(2).strip()
        if not en in edges[et]: edges[et][en] = []
        edges[et][en].append(target)
    return edges

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
        print("COPY", src, dst)
        copyfile(src, dst)
        return "data/files/"+ID+"/"+input_path

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
        metadata[name]['edges'] = {'has':{en:[data[nid]['name'] for nid in node['edges']['has'][en]] for en in node['edges']['has']}}

    return metadata

def get_targets(node):
    targets = set()
    for et in ['is','has']:
        for ts in node.get('edges',{}).get(et,{}).values():
            for t in ts: targets.add(t)
    return targets
    

def complete_metadata(metadata):
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
            for e in edges:
                targets = targets.union(set(edges[e]))
                
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
                if not node_name in get_targets(node): continue
                cat = node.get('edges',{}).get('has',{}).get('category',['uncategorized'])[0]
                if cat == node_name:
                    cat = None
                    break
                category_votes[cat] = category_votes.get(cat,0)+1
                tot = sum(category_votes.values())
                for c in category_votes:
                    if category_votes[c]/tot >= 0.8: cat = c
            metadata[node_name] = {'name':node_name,'edges':{'has':{'category':[cat]} if cat else {},'is':{}}}
            ans[node_id] = {'name':node_name,'edges':{'has':{},'is':{}}}
            
            
    # Now every node--explicit and implicit--has an ID and an entry in
    # ans (without edges).  Go through and populate edges and dual
    # edges in ans
    for node in metadata.values():
        node_id = name_to_id[node['name']]

        # Add all edges and duals
        for et in duals:
            edges = node['edges'][et]
            for e in edges:
                for target in edges[e]:
                    target_id = name_to_id[target]
                    # Add edge
                    if not e in ans[node_id]['edges'][et]: ans[node_id]['edges'][et][e] = []
                    if not target_id in ans[node_id]['edges'][et][e]: ans[node_id]['edges'][et][e].append(target_id)
                    # Add dualised edge
                    if not e in ans[target_id]['edges'][duals[et]]: ans[target_id]['edges'][duals[et]][e] = []
                    if not node_id in ans[target_id]['edges'][duals[et]][e]: ans[target_id]['edges'][duals[et]][e].append(node_id)

    return ans
