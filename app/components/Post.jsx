import React, { Component, PropTypes } from 'react';
import request from 'superagent';
import DateFormatter from '../utils/DateFormatter';
import PostInner from './Post';

export default class Post extends Component {

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
		const { post, hover } = this.props;
		let tripcode = post.tripcode || '';
		let sage = post.email === 'sage';
		let name = post.name || 'Аноним';
		let postLines = post.text.split('\n');

		return <div onMouseLeave={this.clearSinglePost} id={post.id} className="post-wrapper" style={{ boxShadow: (hover ?  '1px 1px 15px rgba(0,0,0,.2)' : 'none') }}>
			<label>
				<input type="checkbox"/>
				<span className="postername" style={{ fontFamily: 'sans-serif' }}>
					<span style={sage ? { color: 'red', fontWeight: 'bold' } : {} }>
						{ post.email !== '' && post.email !== 'nöko' && post.email !== 'sage'
						  ? <a href={'mailto:' + post.email}>{name}&nbsp;</a>
						  : <span>{name}&nbsp;<span style={{ color: '#228854', fontSize: 15 }}>{tripcode ? '!' + tripcode + ' ' : null}</span></span>
						}
					</span>
				</span>
				<span className="time">{DateFormatter.getPostDate(post.timestamp)} {DateFormatter.getPostTime(post.timestamp)}&nbsp;</span>
			</label>
			<span className="reflink">
				<a style={{ textDecoration: 'none', color: '#090E00' }} href={'#' + post.id}>No.&nbsp;</a>
				<a style={{ textDecoration: 'none', color: '#090E00' }} href={'#' + post.id}>{post.id}</a>
			</span>

			<span style={{ cursor: 'pointer' }}>
				<em data-id={post.id} onClick={this.pasteReflinkToTheTextArea}>&nbsp;Reply</em>
			</span>

			<div className="postbody">
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

Post.propTypes = {
	post: PropTypes.object.isRequired,
	hover: PropTypes.bool
};
