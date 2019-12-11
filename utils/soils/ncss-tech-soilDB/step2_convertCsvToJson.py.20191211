import csv
import json

# open csv file into list of lists
ifile = open('scan_water_retention_info.csv','r')
linesOfFile = [line.strip().split(',') for line in ifile]
ifile.close()

# labsampnum repeats for some locations, which is a bug from the NCSS script.
# here, we clean up the repeated entries (mostly for HI locations).
# labsampnum is the fifth column in the dataset, so we compare those values.
stnLists = [linesOfFile[idx] for idx in range(1,len(linesOfFile)) if linesOfFile[idx][4]!=linesOfFile[idx-1][4]]

# unique scan station id list
sidList=[]
for stnList in stnLists:
    if stnList[0] not in sidList: sidList.append(stnList[0])
print len(sidList),' SCAN stations have water retention data available'

# create json
locs=[]
for sid in sidList:
    loc={"sid": sid, "soil_params": []}
    for l in stnLists:
        if l[0]==sid:
            # indices for columns of interest:
            # horizon top --> 5
            # horizon bottom --> 6
            # qr (theta_r) --> 7
            # qs (theta_s) --> 8
            # log10a (alpha) --> 9
            # log10n (npar) --> 10

            horizonInfo={}
            horizonInfo["depthTop"]=float(l[5])
            horizonInfo["depthBottom"]=float(l[6])
            horizonInfo["qr"]=float(l[7])
            horizonInfo["qs"]=float(l[8])
            horizonInfo["log10a"]=float(l[9])
            horizonInfo["log10n"]=float(l[10])

            loc["soil_params"].append(horizonInfo)

    locs.append(loc)

###############
# enter some stations manually below, if location is missing from ncss-tech query and other sources are available
###############

###############################
### for 2094, Centralia Lake
###############################
loc = {
    "sid":"2094",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 17.0, "qr":0.0874, "qs":0.4826, "log10a":-1.9055, "log10n":0.0966},
        {"depthTop": 17.0, "depthBottom": 28.0, "qr":0.0948, "qs":0.5276, "log10a":-2.0169, "log10n":0.1089},
        {"depthTop": 28.0, "depthBottom": 71.0, "qr":0.0891, "qs":0.4793, "log10a":-1.8175, "log10n":0.0967},
        {"depthTop": 71.0, "depthBottom": 93.0, "qr":0.0823, "qs":0.4628, "log10a":-1.8920, "log10n":0.0995},
        {"depthTop": 93.0, "depthBottom":123.0, "qr":0.0789, "qs":0.4566, "log10a":-1.9479, "log10n":0.1027},
        {"depthTop":123.0, "depthBottom":159.0, "qr":0.0765, "qs":0.4718, "log10a":-2.1872, "log10n":0.1024},
        {"depthTop":159.0, "depthBottom":200.0, "qr":0.0753, "qs":0.4703, "log10a":-2.0402, "log10n":0.0912}
    ]
}
# check if entry exists. If not, add to locs.
sidExists = False
for l in locs:
    if loc['sid']==l['sid']:
        sidExists=True
        break
if not sidExists: locs.append(loc)

###############################
### for 2189, Cochora Ranch 
###############################
loc = {
    "sid":"2189",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 15.0, "qr":0.0458, "qs":0.3821, "log10a":-1.6920, "log10n":0.1093},
        {"depthTop": 15.0, "depthBottom": 27.0, "qr":0.0486, "qs":0.3494, "log10a":-2.4584, "log10n":0.1737},
        {"depthTop": 27.0, "depthBottom": 73.0, "qr":0.0437, "qs":0.3800, "log10a":-1.8476, "log10n":0.1171},
        {"depthTop": 73.0, "depthBottom":121.0, "qr":0.0431, "qs":0.3922, "log10a":-1.9770, "log10n":0.1283},
        {"depthTop":121.0, "depthBottom":140.0, "qr":0.0896, "qs":0.4785, "log10a":-2.6895, "log10n":0.2214}
    ]
}
# check if entry exists. If not, add to locs.
sidExists = False
for l in locs:
    if loc['sid']==l['sid']:
        sidExists=True
        break
if not sidExists: locs.append(loc)

###########
### write to json
###########
output = {"locs":locs}
with open('soil_parameters.json','w') as fp:
    json.dump(output,fp)

