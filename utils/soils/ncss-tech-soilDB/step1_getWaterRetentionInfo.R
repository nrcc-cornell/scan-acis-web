#!/usr/bin/env Rscript

library(aqp)
library(soilDB)
library(latticeExtra)
library(plyr)
library(reshape2)

scan_id_list <- c(2074,2218,2189,2217,2219,3051,2149,2191,2215,2116,2192,2214,2216,750,2021,2141,2142,2145,2146,2186,2190,2187,2170,2148,674,2198,2184,2183,2185,2128,2129,2143,2144,2156,2159,2161,2163,2164,2153,2160,2165,2167,2026,2125,2126,2127,2131,2157,2158,2162,2132,2133,2134,2135,2136,2137,2150,2151,2152,2155,2119,808,2019,2117,2118,2130,2138,2139,2140,2166,2154,2121,2168,2015,2169,2171,2172,2017,2018,2197,2120,581,2104,2105,2106,2107,2108,2006,2111,2204,2200,2201,2202,2093,3052,2020,2205,2206,2016,2199,2203,2022,2092,2001,2094,2068,2072,2050,2207,2228,2090,2060,2061,2147,2193,2031,2047,3057,2002,2032,2033,2070,2086,2087,2109,2110,2030,2034,2035,2046,2083,2084,2085,2091,2194,2195,2220,2223,2224,2226,2227,2225,2196,2082,2180,2064,2114,2174,2181,2024,2025,2173,2179,2005,2048,2004,2003,2009,2115,2175,2176,2177,2178,2182,2053,2055,2056,2057,2075,2076,2077,2078,2113,2079,2012,2027,2013,3056,2014,2051,2038,2037,2088,2089,2073,3055,2008,2039,2040,2049,3054,2028,2036,2011,3053,2041,2042,2043,2069,1232,1233,1234,2044,2062,2063,2065,2080,2081,2208,2209,2210,2211,2212,2213,2221,2222,2096,2097,2098,2099,2100,2101,2102,2103,15,2045,2052,2066,2067,2112,2122,2188,2123,2124)

#####################################
### First, get SCAN site metadata
#####################################
print('Getting SCAN site metadata ...')

# remove old output file if it exists
outfile = "scan_pedon_info.csv"
if (file.exists(outfile)) { file.remove(outfile) }

scan_meta_output_file <- "scan_pedon_info.csv"
m <- SCAN_site_metadata(site.code=scan_id_list)
write.csv(m, scan_meta_output_file)


#####################################
### Next, get the water retention parameters from NCSS for each location
#####################################
print('Getting water retention parameters ...')

# remove old output file if it exists, otherwise we would be appending to it
outfile = "scan_water_retention_info.csv"
if (file.exists(outfile)) { file.remove(outfile) }

# remove old output file if it exists, otherwise we would be appending to it
# this file holds scan ids that don't have water retention info
outfile_miss = "scan_water_retention_missing.csv"
if (file.exists(outfile_miss)) { file.remove(outfile_miss) }

# input and output files
input_file <- read.csv(file = "scan_pedon_info.csv", header = TRUE, stringsAsFactors=FALSE)
output_file <- outfile
output_missing <- outfile_miss

# create csv header and write to file
header_list <- list('site','upedonid','pedlabsampnum','pedon_key','labsampnum','hzn_top', 'hzn_bot', 'theta_r', 'theta_s', 'alpha', 'npar', 'w3cld', 'w15I2', 'ds_13b')
cat(paste(header_list,collapse=','),file=output_file,sep="\n",append=TRUE)

for (row in 1:nrow(input_file)) {
    sid = input_file[row,'Site']
    name = input_file[row,'Name']
    state = input_file[row,'State']
    pedonid = input_file[row,'upedonid']
    pedlabsampnum = input_file[row,'pedlabsampnum']
    #if (!is.na(pedlabsampnum) & pedlabsampnum!='') {
    if (!is.na(pedonid) & pedonid!='') {
        #s <- fetchKSSL(pedlabsampnum=pedlabsampnum)
        s <- fetchKSSL(pedon_id=pedonid)
        if (!is.null(s)) {
            #print(paste('DATA AVAILABLE FOR',sid))
            for (srow in 1:nrow(s)) {
                dat <- list(sid,pedonid,pedlabsampnum,s@horizons[srow,'pedon_key'],s@horizons[srow,'labsampnum'],s@horizons[srow,'hzn_top'], s@horizons[srow,'hzn_bot'], s@horizons[srow,'theta_r'], s@horizons[srow,'theta_s'], s@horizons[srow,'alpha'], s@horizons[srow,'npar'], s@horizons[srow,'w3cld'], s@horizons[srow,'w15I2'], s@horizons[srow,'db_13b'])
                if (!grepl('NA',paste(dat,collapse=','))) {
                    cat(paste(dat,collapse=','),file=output_file,sep="\n",append=TRUE)
                }
            }
        } else {
            print(paste('*** NO DATA AVAILABLE FOR',sid,name,state,'*** NULL DATA FETCH ***'))
            miss_site <- list(sid,name,state)
            cat(paste(miss_site,collapse=','),file=output_missing,sep="\n",append=TRUE)
        }
    } else {
        print(paste('*** NO DATA AVAILABLE FOR',sid,name,state,'*** MISSING PEDON ID ***'))
        miss_site <- list(sid,name,state)
        cat(paste(miss_site,collapse=','),file=output_missing,sep="\n",append=TRUE)
    }
}

