import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import CalendarToday from '@material-ui/icons/CalendarToday';
import RenderDaypicker from './RenderDaypicker'

export default function RenderDateField(props) {
    const today = new Date()
    const [showDatepicker, setShowDatepicker] = useState(false)
  
    const { field, label, ovalue, error, handleOnChange } = props

    function handleCalendarIconClick() {
        setShowDatepicker(!showDatepicker)
    }

    return (
        <React.Fragment>
            <TextField
                id={field}
                name={field}
                value={ovalue}
                label={label}
                error={error.length > 0}
                helperText={error}
                margin="normal"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                onChange={handleOnChange}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                edge="end"
                                onClick={handleCalendarIconClick}
                            >
                                <CalendarToday />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
                inputProps={{style:{border:"none",fontFamily:"Roboto"}}}
            />
            {showDatepicker &&
                <React.Fragment>
                    <br />
                    <RenderDaypicker
                        handleOnChange={handleOnChange}
                        closeDatepicker={() => setShowDatepicker(false)}
                        initialDate={ovalue}
                        minDate={new Date(1948,0,1)}
                        maxDate={today}
                        field={field}
                    />
                </React.Fragment>
            }
        </React.Fragment>
    )
}
