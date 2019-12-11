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
### for 2092, Abrams, Kansas
###############################
loc = {
    "sid":"2092",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 18.0, "qr":0.0220, "qs":0.3611, "log10a":-1.7698, "log10n":0.1387},
        {"depthTop": 18.0, "depthBottom": 28.0, "qr":0.0245, "qs":0.3169, "log10a":-1.6657, "log10n":0.1282},
        {"depthTop": 28.0, "depthBottom": 47.0, "qr":0.0359, "qs":0.3829, "log10a":-1.8238, "log10n":0.1332},
        {"depthTop": 47.0, "depthBottom": 74.0, "qr":0.0485, "qs":0.3875, "log10a":-1.6641, "log10n":0.1164},
        {"depthTop": 74.0, "depthBottom": 94.0, "qr":0.0438, "qs":0.3578, "log10a":-1.3996, "log10n":0.1323},
        {"depthTop": 94.0, "depthBottom":125.0, "qr":0.0342, "qs":0.3640, "log10a":-1.3805, "log10n":0.1387},
        {"depthTop":125.0, "depthBottom":203.0, "qr":0.0339, "qs":0.3419, "log10a":-1.3938, "log10n":0.1369}
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
### for 2138, Alkali Mesa, Utah
###############################
loc = {
    "sid":"2138",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 18.0, "qr":0.0473, "qs":0.4061, "log10a":-1.9246, "log10n":0.1391},
        {"depthTop": 18.0, "depthBottom": 49.0, "qr":0.0510, "qs":0.3894, "log10a":-2.0699, "log10n":0.1395},
        {"depthTop": 49.0, "depthBottom": 88.0, "qr":0.0509, "qs":0.3751, "log10a":-1.8064, "log10n":0.1191},
        {"depthTop": 88.0, "depthBottom":116.0, "qr":0.0620, "qs":0.3936, "log10a":-1.7672, "log10n":0.0989},
        {"depthTop":116.0, "depthBottom":134.0, "qr":0.0731, "qs":0.3851, "log10a":-1.5376, "log10n":0.0896}
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
### for 2177, Broad Acres, Alabama
###############################
loc = {
    "sid":"2177",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 13.0, "qr":0.5066, "qs":0.4875, "log10a":-1.3644, "log10n":0.3719},
        {"depthTop": 13.0, "depthBottom": 76.0, "qr":0.3456, "qs":0.3808, "log10a":-1.3011, "log10n":0.2334},
        {"depthTop": 76.0, "depthBottom":180.0, "qr":0.2501, "qs":0.4038, "log10a":-1.1942, "log10n":0.1147},
        {"depthTop":180.0, "depthBottom":256.0, "qr":0.2612, "qs":0.4315, "log10a":-1.1795, "log10n":0.1160}
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
### for 1232, Canyon Lake, Alaska
###############################
#loc = {
#    "sid":"1232",
#    "soil_params":[
#        {"depthTop":  0.0, "depthBottom": 13.0, "qr":, "qs":, "log10a":, "log10n":},
#        {"depthTop": 13.0, "depthBottom": 27.0, "qr":, "qs":, "log10a":, "log10n":},
#        {"depthTop": 27.0, "depthBottom": 53.0, "qr":0.0828, "qs":0.4027, "log10a":-1.6643, "log10n":0.0718}
#    ]
#}
## check if entry exists. If not, add to locs.
#sidExists = False
#for l in locs:
#    if loc['sid']==l['sid']:
#        sidExists=True
#        break
#if not sidExists: locs.append(loc)

###############################
### for 2094, Centralia Lake, Kansas
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
### for 2189, Cochora Ranch, California
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

###############################
### for 2107, Crossroads, New Mexico
###############################
loc = {
    "sid":"2107",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 10.0, "qr":0.0259, "qs":0.3711, "log10a":-1.2548, "log10n":0.1709},
        {"depthTop": 10.0, "depthBottom": 56.0, "qr":0.0487, "qs":0.4296, "log10a":-1.6596, "log10n":0.1194},
        {"depthTop": 56.0, "depthBottom": 89.0, "qr":0.0458, "qs":0.3838, "log10a":-1.5567, "log10n":0.1184},
        {"depthTop": 89.0, "depthBottom":114.0, "qr":0.0534, "qs":0.3943, "log10a":-1.6213, "log10n":0.1075},
        {"depthTop":114.0, "depthBottom":153.0, "qr":0.0390, "qs":0.3612, "log10a":-1.4916, "log10n":0.1292},
        {"depthTop":153.0, "depthBottom":203.0, "qr":0.0371, "qs":0.3384, "log10a":-1.9363, "log10n":0.1308}
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
### for 2190, Death Valley Jct, California
###############################
loc = {
    "sid":"2190",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom":  7.0, "qr":0.0238, "qs":0.3434, "log10a":-1.3053, "log10n":0.1291},
        {"depthTop":  7.0, "depthBottom": 21.0, "qr":0.0247, "qs":0.3315, "log10a":-1.4122, "log10n":0.1185},
        {"depthTop": 21.0, "depthBottom": 35.0, "qr":0.1042, "qs":0.3415, "log10a":-1.2744, "log10n":0.2075},
        {"depthTop": 35.0, "depthBottom": 68.0, "qr":0.1998, "qs":0.4209, "log10a":-1.2359, "log10n":0.1199},
        {"depthTop": 68.0, "depthBottom": 83.0, "qr":0.1837, "qs":0.4391, "log10a":-1.2138, "log10n":0.0791},
        {"depthTop": 83.0, "depthBottom":160.0, "qr":0.0974, "qs":0.5164, "log10a":-1.9260, "log10n":0.0760}
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
### for 2187, Deep Springs, California
###############################
loc = {
    "sid":"2187",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 10.0, "qr":0.0537, "qs":0.3977, "log10a":-1.2268, "log10n":0.2243},
        {"depthTop": 10.0, "depthBottom": 56.0, "qr":0.0361, "qs":0.3751, "log10a":-1.2628, "log10n":0.1368},
        {"depthTop": 56.0, "depthBottom": 92.0, "qr":0.0292, "qs":0.3816, "log10a":-1.3436, "log10n":0.1178},
        {"depthTop": 92.0, "depthBottom":142.0, "qr":0.0323, "qs":0.3234, "log10a":-1.2565, "log10n":0.1529},
        {"depthTop":142.0, "depthBottom":200.0, "qr":0.0252, "qs":0.2511, "log10a":-1.5638, "log10n":0.0972}
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
### for 2191, Doe Ridge, California
### NOTE: 0-14 estimated from 14-36 horizon
###############################
loc = {
    "sid":"2191",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 14.0, "qr":0.0218, "qs":0.4774, "log10a":-1.2283, "log10n":0.1015},
        {"depthTop": 14.0, "depthBottom": 36.0, "qr":0.0218, "qs":0.4774, "log10a":-1.2283, "log10n":0.1015},
        {"depthTop": 36.0, "depthBottom":108.0, "qr":0.0218, "qs":0.4986, "log10a":-1.3012, "log10n":0.0928}
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
### for 2126, Ephraim, Utah
###############################
loc = {
    "sid":"2126",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 13.0, "qr":0.0626, "qs":0.4803, "log10a":-1.6270, "log10n":0.1266},
        {"depthTop": 13.0, "depthBottom": 22.0, "qr":0.0642, "qs":0.4515, "log10a":-1.6202, "log10n":0.1256},
        {"depthTop": 22.0, "depthBottom": 36.0, "qr":0.0675, "qs":0.4513, "log10a":-1.8764, "log10n":0.1271},
        {"depthTop": 36.0, "depthBottom": 73.0, "qr":0.0553, "qs":0.4093, "log10a":-2.0069, "log10n":0.1336},
        {"depthTop": 73.0, "depthBottom":200.0, "qr":0.1210, "qs":0.4503, "log10a":-1.3174, "log10n":0.0711}
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
### for 2185, Essex, California
### NOTE: 0-109 estimated from 109-136 horizon
###############################
loc = {
    "sid":"2185",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom":109.0, "qr":0.0482, "qs":0.3639, "log10a":-1.3939, "log10n":0.1124},
        {"depthTop":109.0, "depthBottom":136.0, "qr":0.0482, "qs":0.3639, "log10a":-1.3939, "log10n":0.1124},
        {"depthTop":136.0, "depthBottom":165.0, "qr":0.0439, "qs":0.3369, "log10a":-1.3858, "log10n":0.1136}
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
### for 2127, Holden, Utah
###############################
loc = {
    "sid":"2127",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom":  6.0, "qr":0.0413, "qs":0.4443, "log10a":-1.2064, "log10n":0.2528},
        {"depthTop":  6.0, "depthBottom": 20.0, "qr":0.0297, "qs":0.3630, "log10a":-1.8531, "log10n":0.1361},
        {"depthTop": 20.0, "depthBottom": 39.0, "qr":0.0452, "qs":0.4013, "log10a":-1.4813, "log10n":0.1270},
        {"depthTop": 39.0, "depthBottom": 74.0, "qr":0.0504, "qs":0.4198, "log10a":-2.4687, "log10n":0.2171},
        {"depthTop": 74.0, "depthBottom": 93.0, "qr":0.0637, "qs":0.4598, "log10a":-2.2311, "log10n":0.1646},
        {"depthTop": 93.0, "depthBottom":129.0, "qr":0.0369, "qs":0.3861, "log10a":-1.5214, "log10n":0.1260},
        {"depthTop":129.0, "depthBottom":184.0, "qr":0.0627, "qs":0.4259, "log10a":-1.8767, "log10n":0.1240},
        {"depthTop":184.0, "depthBottom":200.0, "qr":0.0329, "qs":0.3749, "log10a":-1.2323, "log10n":0.2064}
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
### for 2173, Isbell Farms, Alabama
###############################
loc = {
    "sid":"2173",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 20.0, "qr":0.0699, "qs":0.4158, "log10a":-2.5191, "log10n":0.2091},
        {"depthTop": 20.0, "depthBottom": 38.0, "qr":0.0823, "qs":0.4343, "log10a":-1.9686, "log10n":0.1132},
        {"depthTop": 38.0, "depthBottom": 66.0, "qr":0.0876, "qs":0.4263, "log10a":-1.8655, "log10n":0.0902},
        {"depthTop": 66.0, "depthBottom": 84.0, "qr":0.2906, "qs":0.4982, "log10a":-1.1393, "log10n":0.1111},
        {"depthTop": 84.0, "depthBottom":102.0, "qr":0.1218, "qs":0.5647, "log10a":-1.5993, "log10n":0.0570},
        {"depthTop":102.0, "depthBottom":117.0, "qr":0.1290, "qs":0.5106, "log10a":-1.4782, "log10n":0.0606},
        {"depthTop":117.0, "depthBottom":168.0, "qr":0.1102, "qs":0.5320, "log10a":-1.7978, "log10n":0.0692}
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
### for 2106, Lehman, Texas
###############################
loc = {
    "sid":"2106",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 24.0, "qr":0.0342, "qs":0.3829, "log10a":-2.1268, "log10n":0.1607},
        {"depthTop": 24.0, "depthBottom": 47.0, "qr":0.0318, "qs":0.4166, "log10a":-1.6671, "log10n":0.1287},
        {"depthTop": 47.0, "depthBottom": 75.0, "qr":0.0359, "qs":0.4198, "log10a":-1.7383, "log10n":0.1303},
        {"depthTop": 75.0, "depthBottom":121.0, "qr":0.0451, "qs":0.4264, "log10a":-2.0308, "log10n":0.1433},
        {"depthTop":121.0, "depthBottom":156.0, "qr":0.0454, "qs":0.3867, "log10a":-2.5400, "log10n":0.2228},
        {"depthTop":156.0, "depthBottom":203.0, "qr":0.0444, "qs":0.3894, "log10a":-2.4108, "log10n":0.2035}
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
### for 2105, Levelland, Texas
###############################
loc = {
    "sid":"2105",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 15.0, "qr":0.0427, "qs":0.4597, "log10a":-1.4717, "log10n":0.1320},
        {"depthTop": 15.0, "depthBottom": 28.0, "qr":0.0350, "qs":0.4097, "log10a":-1.2756, "log10n":0.1557},
        {"depthTop": 28.0, "depthBottom": 41.0, "qr":0.0509, "qs":0.3929, "log10a":-1.2999, "log10n":0.1567},
        {"depthTop": 41.0, "depthBottom": 60.0, "qr":0.0735, "qs":0.4206, "log10a":-1.2790, "log10n":0.1667},
        {"depthTop": 60.0, "depthBottom": 88.0, "qr":0.0554, "qs":0.4157, "log10a":-1.6823, "log10n":0.1170},
        {"depthTop": 88.0, "depthBottom":140.0, "qr":0.0416, "qs":0.4101, "log10a":-1.9089, "log10n":0.1352},
        {"depthTop":140.0, "depthBottom":203.0, "qr":0.0474, "qs":0.3904, "log10a":-2.6703, "log10n":0.2435}
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
### for 2169, Los Lunas PMC, New Mexico
###############################
loc = {
    "sid":"2169",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 10.0, "qr":0.0362, "qs":0.4022, "log10a":-1.6436, "log10n":0.1107},
        {"depthTop": 10.0, "depthBottom": 33.0, "qr":0.0445, "qs":0.3743, "log10a":-1.5603, "log10n":0.1056},
        {"depthTop": 33.0, "depthBottom": 45.0, "qr":0.0300, "qs":0.3991, "log10a":-1.8083, "log10n":0.1187},
        {"depthTop": 45.0, "depthBottom": 75.0, "qr":0.0263, "qs":0.4118, "log10a":-1.5313, "log10n":0.1078},
        {"depthTop": 75.0, "depthBottom": 94.0, "qr":0.0267, "qs":0.4005, "log10a":-1.3774, "log10n":0.1122},
        {"depthTop": 94.0, "depthBottom":110.0, "qr":0.3725, "qs":0.4704, "log10a":-1.2542, "log10n":0.2364},
        {"depthTop":110.0, "depthBottom":200.0, "qr":0.0291, "qs":0.4000, "log10a":-1.4472, "log10n":0.1100}
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
### for 2178, Morris Farms, Alabama
###############################
loc = {
    "sid":"2178",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 25.0, "qr":0.0410, "qs":0.4071, "log10a":-1.3229, "log10n":0.1198},
        {"depthTop": 25.0, "depthBottom": 51.0, "qr":0.0577, "qs":0.3523, "log10a":-1.2636, "log10n":0.1521},
        {"depthTop": 51.0, "depthBottom": 97.0, "qr":0.1236, "qs":0.4359, "log10a":-1.3647, "log10n":0.0615},
        {"depthTop": 97.0, "depthBottom":178.0, "qr":0.1188, "qs":0.3869, "log10a":-1.3153, "log10n":0.0667},
        {"depthTop":178.0, "depthBottom":254.0, "qr":0.1040, "qs":0.4957, "log10a":-1.6743, "log10n":0.0514},
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
### for 2093, Phillipsburg, Kansas
###############################
loc = {
    "sid":"2093",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 18.0, "qr":0.0648, "qs":0.4513, "log10a":-2.5045, "log10n":0.2268},
        {"depthTop": 18.0, "depthBottom": 44.0, "qr":0.0672, "qs":0.4760, "log10a":-2.2767, "log10n":0.1840},
        {"depthTop": 44.0, "depthBottom": 87.0, "qr":0.0831, "qs":0.4773, "log10a":-2.0795, "log10n":0.1163},
        {"depthTop": 87.0, "depthBottom":100.0, "qr":0.0823, "qs":0.4782, "log10a":-2.3500, "log10n":0.1639},
        {"depthTop":100.0, "depthBottom":129.0, "qr":0.0645, "qs":0.4543, "log10a":-2.1932, "log10n":0.1654},
        {"depthTop":129.0, "depthBottom":175.0, "qr":0.0691, "qs":0.4639, "log10a":-2.5092, "log10n":0.2249},
        {"depthTop":175.0, "depthBottom":200.0, "qr":0.0668, "qs":0.4617, "log10a":-2.4265, "log10n":0.2082}
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
### for 2104, Reese Center, Texas
###############################
loc = {
    "sid":"2104",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 15.0, "qr":0.0352, "qs":0.3928, "log10a":-1.6810, "log10n":0.1303},
        {"depthTop": 15.0, "depthBottom": 42.0, "qr":0.0391, "qs":0.4172, "log10a":-1.7677, "log10n":0.1313},
        {"depthTop": 42.0, "depthBottom": 69.0, "qr":0.0503, "qs":0.3967, "log10a":-1.8774, "log10n":0.1219},
        {"depthTop": 69.0, "depthBottom": 89.0, "qr":0.0518, "qs":0.4103, "log10a":-1.9993, "log10n":0.1337},
        {"depthTop": 89.0, "depthBottom":107.0, "qr":0.0514, "qs":0.4227, "log10a":-1.8832, "log10n":0.1284},
        {"depthTop":107.0, "depthBottom":158.0, "qr":0.0437, "qs":0.3963, "log10a":-1.9178, "log10n":0.1323},
        {"depthTop":158.0, "depthBottom":203.0, "qr":0.0558, "qs":0.4095, "log10a":-2.6407, "log10n":0.2433}
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
### for 2186, Shadow Mtns, California
### NOTE: 6-58 estimated from 58-102 horizon
###############################
loc = {
    "sid":"2186",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom":  6.0, "qr":0.0353, "qs":0.3350, "log10a":-1.3548, "log10n":0.1212},
        {"depthTop":  6.0, "depthBottom": 58.0, "qr":0.0335, "qs":0.3788, "log10a":-2.0859, "log10n":0.1443},
        {"depthTop": 58.0, "depthBottom":102.0, "qr":0.0335, "qs":0.3788, "log10a":-2.0859, "log10n":0.1443}
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
### for 2179, Sudduth Farms, Alabama
###############################
loc = {
    "sid":"2179",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 13.0, "qr":0.0407, "qs":0.3412, "log10a":-1.5907, "log10n":0.1047},
        {"depthTop": 13.0, "depthBottom": 25.0, "qr":0.0282, "qs":0.2978, "log10a":-1.5715, "log10n":0.1083},
        {"depthTop": 25.0, "depthBottom": 56.0, "qr":0.0460, "qs":0.3088, "log10a":-1.4792, "log10n":0.0988},
        {"depthTop": 56.0, "depthBottom": 89.0, "qr":0.0786, "qs":0.3211, "log10a":-1.3290, "log10n":0.1018}
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
### for 1234, Weary Lake, Alaska
### NOTE: 0-8 and 8-20 estimated from 20-34 horizon
###############################
loc = {
    "sid":"1234",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom":  8.0, "qr":0.0877, "qs":0.6362, "log10a":-2.3177, "log10n":0.1693},
        {"depthTop":  8.0, "depthBottom": 20.0, "qr":0.0877, "qs":0.6362, "log10a":-2.3177, "log10n":0.1693},
        {"depthTop": 20.0, "depthBottom": 34.0, "qr":0.0877, "qs":0.6362, "log10a":-2.3177, "log10n":0.1693}
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
### for 2175, Wedowee, Alabama
### NOTE: bottom of last horizon assumed to be 200.
###############################
loc = {
    "sid":"2175",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 51.0, "qr":0.0685, "qs":0.4222, "log10a":-2.0074, "log10n":0.1203},
        {"depthTop": 51.0, "depthBottom": 91.0, "qr":0.1375, "qs":0.4791, "log10a":-1.3194, "log10n":0.0473},
        {"depthTop": 91.0, "depthBottom":152.0, "qr":0.2631, "qs":0.5209, "log10a":-1.1495, "log10n":0.1123},
        {"depthTop":152.0, "depthBottom":200.0, "qr":0.2106, "qs":0.4592, "log10a":-1.2303, "log10n":0.1323}
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
### for 2108, Willow Wells, New Mexico
###############################
loc = {
    "sid":"2108",
    "soil_params":[
        {"depthTop":  0.0, "depthBottom": 24.0, "qr":0.0195, "qs":0.3695, "log10a":-1.2541, "log10n":0.1647},
        {"depthTop": 24.0, "depthBottom": 46.0, "qr":0.0330, "qs":0.4220, "log10a":-1.4558, "log10n":0.1279},
        {"depthTop": 46.0, "depthBottom": 87.0, "qr":0.0477, "qs":0.4266, "log10a":-1.6494, "log10n":0.1175},
        {"depthTop": 87.0, "depthBottom":152.0, "qr":0.0346, "qs":0.3536, "log10a":-2.3693, "log10n":0.1834},
        {"depthTop":152.0, "depthBottom":203.0, "qr":0.0315, "qs":0.3567, "log10a":-2.3547, "log10n":0.1896}
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

