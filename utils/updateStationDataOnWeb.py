import os
from getStationDataJson import getData
from removeStations import removeStations

src_dir = os.path.abspath(os.path.dirname(__file__))
new_filename = 'scan_stations.json'
new_filepath = os.path.join(src_dir, new_filename)
web_data_dir = 's3://scantools.rcc-acis.org/data/'

getData(new_filepath)

remove_stations_filename = 'remove_stations.json'
removeStations(new_filepath, os.path.join(src_dir, remove_stations_filename))

cmd = 'aws s3 cp ' + new_filepath + ' ' + os.path.join(web_data_dir, new_filename)

res = os.system(cmd)