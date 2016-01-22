import React, { Component, PropTypes } from 'react';

export default class ReplyForm extends Component {

	render() {
		const { updateClickHandler, submitClickHandler, autoUpdateClickHandler, showAutoUpdate } = this.props;

		return <div>
			<input className='reply-form__input' id="name" placeholder="Имя" /><br />
			<input className='reply-form__input' id="email" placeholder="Email" /><br />
			<input className='reply-form__input' id="subject" placeholder="Тема" /><br />

			<textarea className='reply-form__textarea' id="text" rows={4} placeholder="Сообщение" />
			<br />
			<button onClick={submitClickHandler}>Отправить</button>
			&nbsp;
			<button className="refresh" onClick={updateClickHandler}>Обновить</button>
			&nbsp;

			{ showAutoUpdate &&
				<label className="postername" style={{ fontFamily: 'sans-serif' }}>
					<input type="checkbox" onChange={autoUpdateClickHandler} />
					<span id="autoUpdate-text">Автообновление</span>
				</label>
			}
		</div>;
	}

}

ReplyForm.propTypes = {
	updateClickHandler: PropTypes.func.isRequired,
	submitClickHandler: PropTypes.func.isRequired,
	autoUpdateClickHandler: PropTypes.func,
	showAutoUpdate: PropTypes.bool
};
