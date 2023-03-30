# scan-acis-web
SCAN-ACIS Tools: Decision Tools for the Soil Climate Analysis Network\
(in production at https://scantools.rcc-acis.org/)

To update SCAN stations:
1. If there are stations that need to be removed, add them to `utils/remove_stations.json`
2. Run `utils/updateStationDataOnWeb.py` from a Python 2.7 environment that has numpy installed
   - This script will generate a new `scan_stations.json` file into `utils/`. Any new stations should be automatically added to it.
   - It will then remove from `scan_stations.json` any stations specified in `remove_stations.json` by 'uid'
   - Finally, it will copy `scan_stations.json` to the `s3://scantools.rcc-acis.org/data/` bucket.

## WARNING
If you push an update you must either manually replace `/public/data/scan_stations.json` with an updated version of the file or run `/utils/updateStationDataOnWeb.py` after the update is complete to ensure that the stations listed are up-to-date.