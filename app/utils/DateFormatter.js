class DateFormatter {

	constructor() {
		this._days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
	}

	getPostDate(timestamp) {
		let date = new Date(timestamp);

		let day = date.getDate();
		let month = this._addLeadingZero(date.getMonth() + 1);
		let year = date.getFullYear();
		let dayName = this._getRussianDayName(date.getDay());

		return `${day}.${month}.${year} (${dayName})`;
	}

	getPostTime(timestamp) {
		let date = new Date(timestamp);

		let hours = this._addLeadingZero(date.getHours());
		let minutes = this._addLeadingZero(date.getMinutes());
		let seconds = this._addLeadingZero(date.getSeconds());

		return `${hours}:${minutes}:${seconds}`;
	}

	_addLeadingZero(value) {
		return value < 10 ? '0' + value : value;
	}

	_getRussianDayName(day) {
		return this._days[day] || '??';
	}
}

module.exports = new DateFormatter();
