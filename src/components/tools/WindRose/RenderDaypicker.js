import React, { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import './react-daypicker-style.css'

export default function RenderDaypicker(props) {

	const {initialDate, minDate, maxDate, field, handleOnChange, closeDatepicker} = props
	const [date, setDate] = useState(new Date(initialDate.split("-")))

	useEffect(() => {
		setDate(new Date(initialDate.split("-")))
	}, [initialDate])

	const YearMonthForm = ({ date, localeUtils, onChange }) => {
		const months = localeUtils.getMonths()
		const firstYear = minDate.getFullYear()
		const currentYear = maxDate.getFullYear()
		const years = Array.from({length:(currentYear - firstYear + 1)}, (_, i) => i + firstYear)
		const handleChange = (e) => {
			if (e.target.name === 'month') {
				date.setMonth(e.target.value)
			} else if (e.target.name === 'year') {
				date.setFullYear(e.target.value)
			}
			onChange(date)
		}
		return (
			<div className="DayPicker-Caption">
				<select name="month" onChange={handleChange} value={date.getMonth()}>
					{months.map((month, i) => (
						<option key={month} value={i}>
							{month}
						</option>
					))}
				</select>
				<select name="year" onChange={handleChange} value={date.getFullYear()}>
					{years.map(year => (
						<option key={year} value={year}>
							{year}
						</option>
					))}
				</select>
			</div>
		)
	}

	const handleDateChange = (dateValue, { disabled }) => {
		if (disabled) {
			return
		}
		if (dateValue) {
			setDate( dateValue )
			const dateString = dateValue.toISOString().slice(0,10)
			handleOnChange({target: {name: field, value: dateString}})
			closeDatepicker()
		}
	}

	const handleMonthChange = (dateValue) => {
		if (dateValue) {
			dateValue.setDate(!isNaN(date) ? date.getDate() : 1)
			if (dateValue > maxDate) {
				dateValue = maxDate
			}
 			setDate( dateValue )
			const dateString = dateValue.toISOString().slice(0,10)
			handleOnChange({target: {name: field, value: dateString}})
		}
	}

	return (
		<DayPicker
			selectedDays={!isNaN(date) ? date : {}}
			month={!isNaN(date) ? date : new Date()}
			onDayClick={handleDateChange}
			onMonthChange={handleMonthChange}
			modifiers={{ disabled: { after: maxDate } }}
			captionElement={({ date, localeUtils }) => (
				<YearMonthForm
					date={date}
					localeUtils={localeUtils}
					onChange={handleMonthChange}
				/>
			)}
		/>
	)
}
