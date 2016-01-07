import React from 'react';
import DateFormatter from '../utils/DateFormatter';

export default class ReplyForm extends React.Component {

	render() {
		let updateClickHandler = this.props.updateClickHandler;
		let submitClickHandler = this.props.submitClickHandler;
		let autoUpdateClickHandler = this.props.autoUpdateClickHandler;

		return <div>
			<input placeholder="email" /><br />
			<input placeholder="Тема" /><br />

			<textarea id="text" cols={48} rows={4} placeholder="Сообщение" />
			<br />
			<button onClick={submitClickHandler}>Отправить</button>
			&nbsp;
			<button className="refresh" onClick={updateClickHandler}>Обновить</button>
			&nbsp;

			<label className="postername" style={{ fontFamily: 'sans-serif' }}>
				<input type="checkbox" onChange={autoUpdateClickHandler} />
				<span id="autoUpdate-text">Автообновление</span>
			</label>
		</div>;
	}

}
