import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
//import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import 'typeface-roboto';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
//import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
//import UnitsSelect from './UnitsSelect'
import ComparisonSelect from './ComparisonSelect'
import TextInput from './TextInput'

const VarPickerExtreme = (props) => {

    return (


      <Box width="240px" padding={1} border={1} borderRadius={4} borderColor="primary.main" bgcolor="#f5f5dc">


      <Grid item container direction="column" justify="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="h6" style={{color: (props.tmaxSelected) ? '#000000' : '#B0B0B0'}}>
            <Checkbox
              checked={props.tmaxSelected}
              onChange={props.onchangeTmaxSelected}
              color="primary"
            />
            High Temperatures
          </Typography>
        </Grid>
      </Grid>

      { props.tmaxSelected &&

      <Grid item container direction="column" justify="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="body1">
            <ComparisonSelect value={props.tmaxComparison} onchange={props.onchangeTmaxComparison} />
          </Typography>
        </Grid>
        <Grid item>
          <TextInput
            selectedunits={props.tmaxUnits}
            selectedvalue={props.tmaxThreshold}
            availableunits={[{value:'degreeF',label:'°F'},{value:'degreeC',label:'°C'}]}
            inputlabel={""}
            arialabel={"daily high temperature threshold"}
            onchangeThreshold={props.onchangeTmaxThreshold}
          />
        </Grid>
      </Grid>

      }

      <Grid item container direction="column" justify="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="h6" style={{color: (props.tminSelected) ? '#000000' : '#B0B0B0'}}>
            <Checkbox
              checked={props.tminSelected}
              onChange={props.onchangeTminSelected}
              color="primary"
            />
            Low Temperatures
          </Typography>
        </Grid>
      </Grid>

      { props.tminSelected &&

      <Grid item container direction="column" justify="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="body1">
            <ComparisonSelect value={props.tminComparison} onchange={props.onchangeTminComparison} />
          </Typography>
        </Grid>
        <Grid item>
          <TextInput
            selectedunits={props.tminUnits}
            selectedvalue={props.tminThreshold}
            availableunits={[{value:'degreeF',label:'°F'},{value:'degreeC',label:'°C'}]}
            inputlabel={""}
            arialabel={"daily low temperature threshold"}
            onchangeThreshold={props.onchangeTminThreshold}
          />
        </Grid>
      </Grid>
      }

      <Grid item container direction="column" justify="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="h6" style={{color: (props.prcpSelected) ? '#000000' : '#B0B0B0'}}>
            <Checkbox
              checked={props.prcpSelected}
              onChange={props.onchangePrcpSelected}
              color="primary"
            />
            Total Precipitation
          </Typography>
        </Grid>
      </Grid>

      { props.prcpSelected &&

      <Grid item container direction="column" justify="flex-start" spacing={1}>
        <Grid item>
          <Typography variant="body1">
            <ComparisonSelect value={props.prcpComparison} onchange={props.onchangePrcpComparison} />
          </Typography>
        </Grid>
        <Grid item>
          <TextInput
            selectedunits={props.prcpUnits}
            selectedvalue={props.prcpThreshold}
            availableunits={[{value:'inch',label:'in'},{value:'mm',label:'mm'}]}
            inputlabel={""}
            arialabel={"precipitation threshold"}
            onchangeThreshold={props.onchangePrcpThreshold}
          />
        </Grid>
      </Grid>
      }

      </Box>

    );

}

VarPickerExtreme.propTypes = {
  tmaxUnits: PropTypes.string.isRequired,
  tminUnits: PropTypes.string.isRequired,
  prcpUnits: PropTypes.string.isRequired,
  tmaxThreshold: PropTypes.string.isRequired,
  tminThreshold: PropTypes.string.isRequired,
  prcpThreshold: PropTypes.string.isRequired,
  tmaxSelected: PropTypes.bool.isRequired,
  tminSelected: PropTypes.bool.isRequired,
  prcpSelected: PropTypes.bool.isRequired,
  tmaxComparison: PropTypes.string.isRequired,
  tminComparison: PropTypes.string.isRequired,
  prcpComparison: PropTypes.string.isRequired,
  onchangeTmaxThreshold: PropTypes.func.isRequired,
  onchangeTminThreshold: PropTypes.func.isRequired,
  onchangePrcpThreshold: PropTypes.func.isRequired,
  onchangeTmaxSelected: PropTypes.func.isRequired,
  onchangeTminSelected: PropTypes.func.isRequired,
  onchangePrcpSelected: PropTypes.func.isRequired,
  onchangeTmaxComparison: PropTypes.func.isRequired,
  onchangeTminComparison: PropTypes.func.isRequired,
  onchangePrcpComparison: PropTypes.func.isRequired,
};

export default VarPickerExtreme;
