import sys, urllib, urllib2
import numpy as np
import datetime
import os

try :
	import json
except ImportError :
	import simplejson as json

def acis_ws(method,params) :
	#acis_url = 'http://data.rcc-acis.org/'
	acis_url = 'http://data.nrcc.rcc-acis.org/'
	req = urllib2.Request(acis_url+method,
		urllib.urlencode({'params':json.dumps(params)}),
		{'Accept':'application/json'})
	response = urllib2.urlopen(req)
	return json.loads(response.read())

def getMtdStartLabel(s): return datetime.datetime.strptime(s,"%Y-%m-%d").strftime("%b")+' 1'

def getStdStartLabel(s):
	month = datetime.datetime.strptime(s,"%Y-%m-%d").month
	DJF = [12,1,2]
	MAM = [3,4,5]
	JJA = [6,7,8]
	SON = [9,10,11]
	if month in DJF: return 'Dec 1'
	if month in MAM: return 'Mar 1'
	if month in JJA: return 'Jun 1'
	if month in SON: return 'Sep 1'
	return ''

def getStdStartString(s):
	month = datetime.datetime.strptime(s,"%Y-%m-%d").month
	DJF = [12,1,2]
	MAM = [3,4,5]
	JJA = [6,7,8]
	SON = [9,10,11]
	if month in DJF: return '12-1'
	if month in MAM: return '3-1'
	if month in JJA: return '6-1'
	if month in SON: return '9-1'
	return ''

# grid data
#pData = {"bbox":"-82.708330,37.166667,-66.875,47.625","grid":"3","elems":"pcpn","meta":"ll","date":"2019-02-07"}
#rData = acis_ws('GridData',pData)

print 'Find all stations in network ...'
print datetime.datetime.now()

# filter by network, adjust content
networks = ['17','19']
stnListForNetwork = []

### Continental U.S.
#pData = {"state":"NY","meta":"sids","output":"json"}
pData = {"bbox":"-125,24.3,-66.8,49.4","meta":"sids","output":"json"}
rData = acis_ws('StnMeta',pData)

for m in rData['meta']:
	for network in networks:
		# bypass station if it is not in network
		if not np.any([' '+network in s for s in m['sids']]): continue

		stn = [s for s in m['sids'] if ' '+network in s][0]
		stnListForNetwork.append(stn)

### Alaska
pData = {"state":"AK","meta":"sids","output":"json"}
rData = acis_ws('StnMeta',pData)

for m in rData['meta']:
	for network in networks:
		# bypass station if it is not in network
		if not np.any([' '+network in s for s in m['sids']]): continue

		stn = [s for s in m['sids'] if ' '+network in s][0]
		stnListForNetwork.append(stn)

print 'Get climate summaries and metadata for these stations, and write to json file ...'
print datetime.datetime.now()
print stnListForNetwork

### using fixed day until data are up-to-date
#yest = datetime.date(2019,2,18)-datetime.timedelta(1)
yest = datetime.datetime.now()-datetime.timedelta(1)
dateString = yest.strftime('%Y-%m-%d')

# station meta data
pData = {
	"sids":stnListForNetwork,
        "sdate":dateString,
        "edate":dateString,
	"elems": [{
		"name": "pcpn",
		"interval": "dly",
		"duration": "ytd",
		#"reduce": {"reduce":"sum","add":"date"},
		"reduce": "sum",
                "prec": 2,
		"maxmissing": 0,
	},{
		"name": "pcpn",
		"interval": "dly",
		"duration": "ytd",
		"reduce": "sum",
		"maxmissing": 0,
                "prec": 2,
		"normal": "departure"
	},{
		"name": "pcpn",
		"interval": "dly",
		"duration": "std",
		"reduce": "sum",
		"season_start":getStdStartString(dateString),
                "prec": 2,
		"maxmissing": 0,
	},{
		"name": "pcpn",
		"interval": "dly",
		"duration": "std",
		"reduce": "sum",
		"season_start":getStdStartString(dateString),
                "prec": 2,
		"maxmissing": 0,
		"normal": "departure"
	},{
		"name": "pcpn",
		"interval": "dly",
		"duration": "mtd",
		"reduce": "sum",
                "prec": 2,
		"maxmissing": 0,
	},{
		"name": "pcpn",
		"interval": "dly",
		"duration": "mtd",
		"reduce": "sum",
                "prec": 2,
		"maxmissing": 0,
		"normal": "departure"
	},{
		"name": "avgt",
		"interval": "dly",
		"duration": "ytd",
		#"reduce": {"reduce":"sum","add":"date"},
		"reduce": "mean",
                "prec": 1,
		"maxmissing": 0,
	},{
		"name": "avgt",
		"interval": "dly",
		"duration": "ytd",
		"reduce": "mean",
                "prec": 1,
		"maxmissing": 0,
		"normal": "departure"
	},{
		"name": "avgt",
		"interval": "dly",
		"duration": "std",
		"reduce": "mean",
		"season_start":getStdStartString(dateString),
                "prec": 1,
		"maxmissing": 0,
	},{
		"name": "avgt",
		"interval": "dly",
		"duration": "std",
		"reduce": "mean",
		"season_start":getStdStartString(dateString),
                "prec": 1,
		"maxmissing": 0,
		"normal": "departure"
	},{
		"name": "avgt",
		"interval": "dly",
		"duration": "mtd",
		"reduce": "mean",
                "prec": 1,
		"maxmissing": 0,
	},{
		"name": "avgt",
		"interval": "dly",
		"duration": "mtd",
		"reduce": "mean",
                "prec": 1,
		"maxmissing": 0,
		"normal": "departure"
	}],
	"meta":"uid,name,state,elev,ll,sids,sid_dates",
	"output":"json"
}
rData = acis_ws('MultiStnData',pData)
print len(stnListForNetwork)
print len(rData['data'])
print datetime.datetime.now()

stnDataOut = []
acisStnList = []
for item in rData['data']:
	m = item['meta']
	d = item['data']

	for network in networks:

		# bypass station if it is not in network
		if not np.any([' '+network in s for s in m['sids']]): continue

		stn = [s for s in m['sids'] if ' '+network in s][0]
		sdate = [dList[1] for dList in m['sid_dates'] if stn in dList][0]
		edate = [dList[2] for dList in m['sid_dates'] if stn in dList][0]
		acisStnList.append(stn)

		stnDict = {}
		stnDict['uid'] = m['uid']
		stnDict['sid'] = stn
		stnDict['ll'] = m['ll']
		stnDict['name'] = m['name']
		stnDict['state'] = m['state']
		stnDict['elev'] = m['elev'] if 'elev' in m.keys() else 'N/A'
		stnDict['sdate'] = sdate
		stnDict['edate'] = edate
		stnDict['network'] = int(network)
		stnDict['p_ytd_o'] = d[0]
		stnDict['p_ytd_n'] = d[1]
		stnDict['p_std_o'] = d[2]
		stnDict['p_std_n'] = d[3]
		stnDict['p_mtd_o'] = d[4]
		stnDict['p_mtd_n'] = d[5]
		stnDict['t_ytd_o'] = d[6]
		stnDict['t_ytd_n'] = d[7]
		stnDict['t_std_o'] = d[8]
		stnDict['t_std_n'] = d[9]
		stnDict['t_mtd_o'] = d[10]
		stnDict['t_mtd_n'] = d[11]

		stnDataOut.append(stnDict)

extraStations = [s for s in stnListForNetwork if s not in acisStnList]
pData = {"sids":extraStations,"meta":"uid,name,state,ll,elev,sids,sid_dates","output":"json"}
rData = acis_ws('StnMeta',pData)
sList = []
for m in rData['meta']:
	stn = m['sids'][0]
	network = stn.split(' ')[1]
	sdate = [dList[1] for dList in m['sid_dates'] if stn in dList][0]
	edate = [dList[2] for dList in m['sid_dates'] if stn in dList][0]

	stnDict = {}
	stnDict['uid'] = m['uid']
	stnDict['sid'] = stn
	stnDict['ll'] = m['ll']
	stnDict['name'] = m['name']
	stnDict['state'] = m['state']
	stnDict['elev'] = m['elev'] if 'elev' in m.keys() else 'N/A'
	stnDict['sdate'] = sdate
	stnDict['edate'] = edate
	stnDict['network'] = int(network)
	stnDict['p_ytd_o'] = 'M'
	stnDict['p_ytd_n'] = 'M'
	stnDict['p_std_o'] = 'M'
	stnDict['p_std_n'] = 'M'
	stnDict['p_mtd_o'] = 'M'
	stnDict['p_mtd_n'] = 'M'
	stnDict['t_ytd_o'] = 'M'
	stnDict['t_ytd_n'] = 'M'
	stnDict['t_std_o'] = 'M'
	stnDict['t_std_n'] = 'M'
	stnDict['t_mtd_o'] = 'M'
	stnDict['t_mtd_n'] = 'M'

	stnDataOut.append(stnDict)

dataOut = {
	'date':dateString,
	'ytd_start': 'Jan 1',
	'mtd_start':getMtdStartLabel(dateString),
	'std_start':getStdStartLabel(dateString),
	'locs':stnDataOut,
}

#for d in rData['data']: print d

with open('scan_stations.json', 'w') as f:
    json.dump(dataOut, f)

