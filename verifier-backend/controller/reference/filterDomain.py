# Filter through each object in allowedInst.json, only leaving the domain name where it doesn't contain 'student'

import json

def filter_domain():
    filtered = []
    with open('./allowedInst.json', 'r') as file:
        allowedInst = json.load(file)
    
    for item in allowedInst:
        if 'domains' in item:
            domain = item['domains']
            string = ''.join(domain)
            if string.__contains__('student'):
                continue
            else:
                filtered.append(string)
    res_json = json.dumps(filtered, indent=4)

    with open('filtered_inst.json', 'w') as file:
        file.write(res_json)

if __name__ == "__main__":
    filter_domain()