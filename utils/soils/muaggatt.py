'''Query USDA Soil Survey.

    Guts behind this obtained from:
    https://github.com/ncss-tech/ssurgoOnDemand

'''
#import arcpy, sys, os, traceback, time, httplib, urllib2, json
import sys, os, traceback, time, httplib, urllib2, json
from BaseHTTPServer import BaseHTTPRequestHandler as bhrh

def getMuaggatt(aSym):

    import socket
    from urllib2 import HTTPError, URLError
    # funcDict = dict()

    try:

        #muaggatQry = \
        #"""SELECT ma.musym,ma.muname,ma.mustatus,ma.slopegraddcp,ma.slopegradwta,ma.brockdepmin,ma.wtdepannmin,ma.wtdepaprjunmin,ma.flodfreqdcd,ma.flodfreqmax,ma.pondfreqprs,ma.aws025wta,ma.aws050wta,ma.aws0100wta,
        #ma.aws0150wta,ma.drclassdcd,ma.drclasswettest,ma.hydgrpdcd,ma.iccdcd,ma.iccdcdpct,ma.niccdcd,ma.niccdcdpct,ma.engdwobdcd,ma.engdwbdcd,ma.engdwbll,ma.engdwbml,ma.engstafdcd,ma.engstafll,ma.engstafml,ma.engsldcd,ma.engsldcp,
        #ma.englrsdcd,ma.engcmssdcd,ma.engcmssmp,ma.urbrecptdcd,ma.urbrecptwta,ma.forpehrtdcp,ma.hydclprs,ma.awmmfpwwta,ma.mukey
        muaggatQry = \
        """SELECT ma.musym,ma.muname,ma.aws025wta,ma.aws050wta,ma.aws0100wta,ma.aws0150wta,ma.drclassdcd,ma.drclasswettest
        FROM legend
        INNER JOIN mapunit ON mapunit.lkey=legend.lkey
        INNER JOIN muaggatt ma ON mapunit.mukey=ma.mukey
        WHERE areasymbol IN (""" + aSym + """)"""

        #theURL = "https://sdmdataaccess.nrcs.usda.gov"
        #url = theURL + "/Tabular/SDMTabularService/post.rest"

        url = r'https://SDMDataAccess.sc.egov.usda.gov/Tabular/post.rest'

        # Create request using JSON, return data as JSON
        request = {}
        request["format"] = "JSON+COLUMNNAME+METADATA"
        request["query"] = muaggatQry

        #json.dumps = serialize obj (request dictionary) to a JSON formatted str
        data = json.dumps(request)

        # Send request to SDA Tabular service using urllib2 library
        # because we are passing the "data" argument, this is a POST request, not a GET
        req = urllib2.Request(url, data)
        response = urllib2.urlopen(req)

        code = response.getcode()
        cResponse = bhrh.responses.get(code)
        cResponse = "{}; {}".format(cResponse[0], cResponse[1])

        # read query results
        qResults = response.read()

        # Convert the returned JSON string into a Python dictionary.
        qData = json.loads(qResults)

        # get rid of objects
        del qResults, response, req

        # if dictionary key "Table" is found
        if "Table" in qData:

            return True, qData, cResponse

        else:
            cResponse = "muaggat failed for " + state
            return False, None, cResponse

    except socket.timeout as e:
        Msg = 'Soil Data Access timeout error'
        return False, None, Msg

    except socket.error as e:
        state + " = " + str(e)
        return False, None, Msg

    except HTTPError as e:
        Msg = state +  " = " + str(e)
        return False, None, Msg

    except URLError as e:
        state + " = " + str(e)
        return False, None, Msg

    except:
        #errorMsg()
        Msg = 'Unhandled error collecting muaggat for ' + aSym
        return False, None, Msg

### run queries for counties
p = ['NY109']
theReq = ",".join(map("'{0}'".format, p))
agLogic, agData, agMsg = getMuaggatt(theReq)

#for item in agData['Table']: print item[1]
for item in agData['Table']: print item

