import sys, urllib, urllib2
import numpy as np
import datetime
import os

try :
	import json
except ImportError :
	import simplejson as json

def acis_ws(method,params) :
	acis_url = 'https://data.nrcc.rcc-acis.org/'
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

# use today's date as current date
date_current = datetime.datetime.now()
# use some date in the past as current date
#date_current = datetime.date(2019,3,4)
#date_current = datetime.date(2019,3,17)

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

### Hawaii
pData = {"state":"HI","meta":"sids","output":"json"}
rData = acis_ws('StnMeta',pData)

for m in rData['meta']:
	for network in networks:
		# bypass station if it is not in network
		if not np.any([' '+network in s for s in m['sids']]): continue

		stn = [s for s in m['sids'] if ' '+network in s][0]
		stnListForNetwork.append(stn)

### Puerto Rico
pData = {"state":"PR","meta":"sids","output":"json"}
rData = acis_ws('StnMeta',pData)

for m in rData['meta']:
	for network in networks:
		# bypass station if it is not in network
		if not np.any([' '+network in s for s in m['sids']]): continue

		stn = [s for s in m['sids'] if ' '+network in s][0]
		stnListForNetwork.append(stn)

### Virgin Islands
pData = {"state":"VI","meta":"sids","output":"json"}
rData = acis_ws('StnMeta',pData)

for m in rData['meta']:
	for network in networks:
		# bypass station if it is not in network
		if not np.any([' '+network in s for s in m['sids']]): continue

		stn = [s for s in m['sids'] if ' '+network in s][0]
		stnListForNetwork.append(stn)

print datetime.datetime.now()
#print stnListForNetwork
stnListNoNetwork = [s.split()[0] for s in stnListForNetwork]
print len(stnListNoNetwork)*'%s,' % tuple(stnListNoNetwork)

