import React from 'react';
import DateFormatter from '../utils/DateFormatter';
import PostLink from '../components/PostLink';

export default class Post extends React.Component {

	render() {
		let post = this.props.post;
		let tripcode = post.tripcode || '';
		let sage = this.props.post.email === 'sage';
		let name = this.props.post.name || 'Аноним';
		let postText = '';

		let postLines = post.text.split('\n');
		// postLines.map((line) => {
		// 	if (line.match(/^>>\d+$/)) {
		// 		console.log(line);
		// 	}
		// });
		// console.log(postLines);

		return <div id={post.id} className="post-wrapper" style={{ color: '#090E00', fontFamily: 'serif', display: 'table', border: '1px solid #F9E0A8', background: 'none repeat scroll 0% 0% #FFECB2', borderRadius: '3px', marginTop: '4px', minWidth: '380px', paddingRight: '3px' }}>
			<label>
				<input type="checkbox"/>
				<span className="postername" style={{ fontFamily: 'sans-serif' }}>
					<span style={sage ? { color: 'red', fontWeight: 'bold' } : {} }>
						{ this.props.post.email !== '' && this.props.post.email !== 'nöko' && this.props.post.email !== 'sage'
						  ? <a href={'mailto:' + this.props.post.email}>{name}&nbsp;</a>
						  : <span>{name}&nbsp;<span style={{ color: '#228854', fontSize: 15 }}>{tripcode ? '!' + tripcode + ' ' : null}</span></span>
						}
					</span>
				</span>
				<span className="time">{DateFormatter.getPostDate(this.props.post.timestamp)} {DateFormatter.getPostTime(this.props.post.timestamp)}&nbsp;</span>
			</label>
			<span className="reflink">
				<a style={{ textDecoration: 'none', color: '#090E00' }} href={'#' + this.props.post.id}>No.&nbsp;</a>
				<a style={{ textDecoration: 'none', color: '#090E00' }} href={'#' + this.props.post.id}>{this.props.post.id}</a>
			</span>

			<div className="postbody">
				{/*<blockquote style={{ whiteSpace: 'pre-wrap' }}>{postText.replace(/&nbsp;/gm, ' ')}</blockquote>*/}

				<blockquote style={{ whiteSpace: 'pre-wrap' }}>
					{
						postLines.map((line) => {
							return line.match((/^>>\d+$/)) ? <span><a href={'#' + line.slice(2)}>{line + '\n'}</a></span> : <span>{line + '\n'}</span>
						})

					}
				</blockquote>
			</div>
		</div>;
	}

}
