import json

def removeStations(new_filepath, remove_stations_filepath):
  with open(new_filepath, 'r') as f:
    all_stations = json.load(f)

  with open(remove_stations_filepath, 'r') as f:
    remove_stations = json.load(f)
    remove_uids = [station['uid'] for station in remove_stations]

  filtered_stations = filter(lambda station: not (station['uid'] in remove_uids), all_stations['locs'])

  with open(new_filepath, 'w') as f:
    json.dump({
      'locs': filtered_stations,
      "mtd_start": all_stations['mtd_start'],
      "std_start": all_stations['std_start'],
      "ytd_start": all_stations['ytd_start'],
      "date": all_stations['date']
    }, f)
