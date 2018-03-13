"""Usage: metadata.py <metadata_json_file> <output_dir>"""

import yaml, json, docopt, hashlib

def get_id(node):
    return hashlib.sha256(node.encode()).hexdigest()

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
    
    with open(args['<metadata_json_file>'],'r') as f:
        metadata = yaml.load(f.read())
    metadata = complete(metadata)
    output_path = args['<output_dir>']+'/metadata.json'
    with open(output_path,'w') as f:
        f.write(json.dumps(metadata))
    print("Wrote: {}".format(output_path))
