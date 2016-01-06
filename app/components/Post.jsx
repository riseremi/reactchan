import React from 'react';
import DateFormatter from '../utils/DateFormatter';

export default class IndexView extends React.Component {

	render() {
		return <div className='post-wrapper' style={{color: '#090E00', fontFamily: 'serif', display: 'table', border: '1px solid #F9E0A8', background: 'none repeat scroll 0% 0% #FFECB2', borderRadius: '3px', marginTop: '4px', minWidth: '380px'}}>
			<label>
				<input type="checkbox"/>
				<span className="postername" style={{fontFamily: 'sans-serif'}}>Няноним&nbsp;</span>
				<span className="time">{DateFormatter.getPostDate(this.props.post.timestamp)} {DateFormatter.getPostTime(this.props.post.timestamp)}&nbsp;</span>
			</label>
			<span className="reflink">
				<a style={{textDecoration: 'none', color: '#090E00'}} href={'#' + this.props.post.id}>No.&nbsp;</a>
				<a style={{textDecoration: 'none', color: '#090E00'}} href={'#' + this.props.post.id}>{this.props.post.id}</a>
			</span>

			<div className='postbody'>
				<blockquote style={{whiteSpace: 'pre-line'}}>{this.props.post.text}</blockquote>
			</div>
		</div>;
	}

}
