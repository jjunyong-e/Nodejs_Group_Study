import os
import json
import argparse
parser = argparse.ArgumentParser()
parser.add_argument('--i' , required= True, help='이미지경로')

argparse = parser.parse_args()


imageName = os.listdir(argparse.i)
type_ = imageName[0].replace('.png','')
type_data = dict()
type_data['type'] = type_
with open('output.json','w') as writer:
  json.dump(type_data,writer,ensure_ascii=False)