import json as j


def read(json):
    with open(json) as json_file:
        return j.load(json_file)


def overwrite(file, json):
    with open(file, 'w') as outfile:
        j.dump(json, outfile)
        return json
