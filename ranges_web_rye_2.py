from os import listdir
from os.path import isfile, join
import json

ranges_dir = "ryeweb"
refs_dir = join("/home/vazqmig/Files/pok/env/src/ranges_web/", ranges_dir)
dirs = [f for f in listdir(refs_dir) if not isfile(join(refs_dir, f))]


# structure of the files:
# > flat3bet
#  >  20bb
#       flat3bet 20bb bu utg-mp
#        action  stack hero villain

dirs
# ['50 BB Flat et 3Bet', 'BB defending', 'Openraising 10bb push', 'OR - 60bb', 'OR -20bb', 'OR -30bb', 'OR -40bb', 'OR -100bb', 'OR SB 40bb+', '20bb flat 3bet', '30bb Flat 3bet', '40 BB Flat et 3Bet']

rfiles = []
for dr in dirs:
    files = [f for f in listdir(join(refs_dir, dr))
             if isfile(join(refs_dir, dr, f))]
    for fname in files:
        fl = join(ranges_dir, dr, fname)
        props = {}
        props['dir'] = dr
        props['basename'] = fname
        props['filename'] = fl
        fn = fname.replace('_', ' ')
        fn = fn.upper()
        fn = fn.replace('.JPG', '')
        fn = fn.replace('.PNG', '')
        split = dr.split(' ')
        ll = len(split)
        props['label'] = fn
        props['action'] = split[0] if ll > 0 else ''
        props['stack'] = split[1] if ll > 1 else ''
        if props['action'] == 'OR':
            fn = fn.split(' ')[0]
            props['label'] = fn
        hero = fn
        vil = ''
        if props['action'] == 'Flat3bet':
            fsp = fn.split(' ')
            l2 = len(fsp)
            hero = fsp[0]
            vil = fsp[2] if l2 > 1 else ''
        props['hero'] = hero
        props['vil'] = vil
        if props['action'] == 'BB-defense':
            props['stack'] = 'VS % OPEN'
            l2 = len(fsp)

        rfiles.append(props)

# print(rfiles(
# print(json.dumps(rfiles, indent=4, sort_keys=True))

file_path = join(refs_dir, 'ranges_rye_3.json')

with open(file_path, 'w') as outfile:
    json.dump(rfiles, outfile, indent=4, sort_keys=True)
