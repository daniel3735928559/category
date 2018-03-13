"""Usage: build.py <input_dir> <output_dir>"""

from io import StringIO
from os import listdir
from os.path import isfile, join
import panflute as pf
import yaml, sys, re, hashlib, json, docopt

node = {}
metadata = {}
def get_id(node):
    return hashlib.sha256(node.encode()).hexdigest()

def extract_metadata(elem, doc):
    global node
    if (isinstance(elem, pf.Code) or isinstance(elem, pf.CodeBlock)):
        if 'edges' in elem.classes:
            if not 'edges' in node: node['edges'] = {'has':{}, 'is':{}}
            for line in elem.text.split("\n"):
                m = re.match(r"^\s*has\s+([^:]*):\s*(.*)\s*$", line)
                et = 'has'
                if not m:
                    m = re.match(r"^\s*is\s+([^:]*) of:\s*(.*)\s*$", line)
                    et = 'is'
                    if not m:
                        sys.stderr.write("WARNING: Line not a valid edge: {}\n".format(line))
                        continue
                en = m.group(1)
                target = m.group(2)
                sys.stderr.write("EDGE: {} --{}--> {}\n".format(et,en,target))
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
            sys.stderr.write("NODE: {}\n".format(node['name']))
            return []
            
def complete(metadata):
    duals = {'has':'is','is':'has'}
    name_to_id = {}
    ans = {}
    
    # First collect all the nodes, explicit and implicit

    # Start with the explicit ones:
    for node in metadata.values():
        node_id = node.get('id',get_id(node['name']))
        name_to_id[node['name']] = node_id
        ans[node_id] = {'data':node.get('data',''),
                        'name':node['name'],
                        'edges':{'has':{},'is':{}}}

    # Now go through and find all the implicit ones and give them IDs in name_to_id:
    targets = set()
    for node in metadata.values():
        for et in duals:
            if not et in node['edges']: node['edges'][et] = {}
            edges = node['edges'][et]
            for e in edges:
                targets = targets.union(set(edges[e]))
    for t in targets:
        if not t in name_to_id:
            node_id = get_id(t)
            print("Implicit node found: {} (ID={})".format(t, node_id))
            name_to_id[t] = node_id
            ans[node_id] = {'name':t,'edges':{'has':{},'is':{}}}
                
    # Now every node--explicit and implicit--has an ID.  Go through
    # and populate edges and dual edges in answer
    for node in metadata.values():
        node_id = name_to_id[node['name']]
        for et in duals:
            edges = node['edges'][et]
            for e in edges:
                for target in edges[e]:
                    target_id = name_to_id[target]
                    # Add edge
                    ans[node_id]['edges'][et][e] = ans[node_id]['edges'][et].get(e,[])+[target_id]
                    # Add dualised edge
                    ans[target_id]['edges'][duals[et]][e] = ans[target_id]['edges'][duals[et]].get(e,[])+[node_id]
    return ans

if __name__ == "__main__":
    args = docopt.docopt(__doc__)
    files = [join(args['<input_dir>'], f) for f in listdir(args['<input_dir>']) if isfile(join(args['<input_dir>'], f))]
    for fn in files:
        print(fn)
        node = {}
        with open(fn,"rb") as f:
            doc = pf.convert_text(f.read().decode(),standalone=True)
        doc = doc.walk(extract_metadata)
        ID = get_id(node['name'])
        if ID in metadata:
            print("WARNING: Duplicate node: {}".format(node['name']))
        metadata[ID] = node
        with open(join(args['<output_dir>'],'{}.html'.format(ID)),"w") as f:
            f.write(pf.convert_text(doc, input_format='panflute',output_format='html'))
    print("MD",yaml.dump(metadata))
    metadata = complete(metadata)
    print("MDC",yaml.dump(metadata))
    with open(join(args['<output_dir>'],'metadata.json'.format(ID)),"w") as f:
        f.write(json.dumps(metadata))
