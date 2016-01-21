import React from 'react';
import request from 'superagent';
import DateFormatter from '../utils/DateFormatter';
import PostInner from './Post';

export default class Post extends React.Component {

	constructor(props) {
		super(props);
		this.state = {hoverPost: null};

		this.loadSinglePost = this.loadSinglePost.bind(this);
		this.clearSinglePost = this.clearSinglePost.bind(this);
		this.pasteReflinkToTheTextArea = this.pasteReflinkToTheTextArea.bind(this);
	}

	loadSinglePost(event) {
		let postId = parseInt(event.target.getAttribute('href').slice(1), 10);
		request.get('http://chan-riseremi.c9users.io/post/' + postId)
			.end((err, res) => {
				this.setState({hoverPost: res.body});
			});
	}

	pasteReflinkToTheTextArea(event) {
		document.getElementById('text').value += '>>' + event.target.getAttribute('data-id') + '\n';
	}

	clearSinglePost() {
		this.setState({hoverPost: null});
	}

	render() {
		let post = this.props.post;
		let tripcode = post.tripcode || '';
		let sage = this.props.post.email === 'sage';
		let name = this.props.post.name || 'Аноним';
		let postText = '';

		let postLines = post.text.split('\n');

		return <div onMouseLeave={this.clearSinglePost} id={post.id} className="post-wrapper" style={{ position: 'relative', color: '#090E00', fontFamily: 'serif', display: 'table', border: '1px solid #F9E0A8', background: 'none repeat scroll 0% 0% #FFECB2', borderRadius: '3px', marginTop: '4px', minWidth: '380px', paddingRight: '3px', boxShadow: (this.props.hover ?  '1px 1px 15px rgba(0,0,0,.2)' : 'none') }}>
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

			<span style={{ cursor: 'pointer' }}>
				<em data-id={this.props.post.id} onClick={this.pasteReflinkToTheTextArea}>&nbsp;Reply</em>
			</span>

			<div className="postbody">
				{/*<blockquote style={{ whiteSpace: 'pre-wrap' }}>{postText.replace(/&nbsp;/gm, ' ')}</blockquote>*/}

				<blockquote style={{ whiteSpace: 'pre-wrap' }}>
					{
						postLines.map((line) => {
							return line.match((/^>>\d+$/)) ? <span key={Math.random()}><a onMouseEnter={this.loadSinglePost} href={'#' + line.slice(2)}>{line + '\n'}</a></span> : <span key={Math.random()}>{line + '\n'}</span>;
						})

					}
				</blockquote>
			</div>

			<div style={{ position: 'absolute', zIndex: '10', left: 45 }}>{this.state.hoverPost ? <PostInner hover post={this.state.hoverPost} /> : null}</div>
		</div>;
	}

}
