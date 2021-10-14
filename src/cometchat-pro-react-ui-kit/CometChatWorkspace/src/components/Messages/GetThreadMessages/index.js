import React from "react";
/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx } from "@emotion/core";
import PropTypes from "prop-types";
import { CometChat } from "@cometchat-pro/chat";

import { getMessageSentTime } from "../../../util/common";
import { CometChatContext } from "../../../util/CometChatContext"

import Translator from "../../../resources/localization/translator";
import { theme } from "../../../resources/theme";

import { replyCountStyle } from "./style";
import { connect } from 'react-redux';

// import blueDoubleTick from "./resources/message-read.svg";
// import greyDoubleTick from "./resources/message-delivered.svg";
// import greyTick from "./resources/message-sent.svg";
// import sendingTick from "./resources/wait.svg";
// import errorTick from "./resources/warning-small.svg";

class GetThreadMessages extends React.PureComponent {
	static contextType = CometChatContext;
	loggedInUser;

	constructor(props, context) {
		super(props, context);
		this.state = {
			receipts: false,
			threadMessages: []
		};

		this.context.getLoggedinUser().then(user => {
			this.loggedInUser = { ...user };
		});
	}

	componentDidMount() {
		console.log("mount calling")
		this.getThreads();
	}

	componentDidUpdate() {
		console.log('update calling', this.loggedInUser);
		if(this.loggedInUser)
			this.getThreads();
	}

	toggleReadReceipts = () => {
		/**
		 * if delivery receipts feature is disabled
		 */
		this.context.FeatureRestriction.isDeliveryReceiptsEnabled()
			.then(response => {
				if (response !== this.state.receipts) {
					this.setState({ receipts: response });
				}
			})
			.catch(error => {
				if (this.state.receipts !== false) {
					this.setState({ receipts: false });
				}
			});
	};

	getThreads = () => {
		console.log('thread user = ', this.loggedInUser);
		if(!this.loggedInUser){
			this.context.getLoggedinUser().then(user => {
				this.loggedInUser = { ...user };
			});
		}
		else {
			console.log('userid = ', this.loggedInUser.uid);

			var limit = 50;
			var messagesRequest = new CometChat.MessagesRequestBuilder()
				.setUID(this.loggedInUser.uid)
				.setLimit(limit)
				.build();

			messagesRequest.fetchPrevious().then(
				messages => {
					console.log("Message list fetched:", messages);
				}, 
				error => {
					console.log("Message fetching failed with error:", error);
				}
			);

			//get thread message
			// let parentMessageId = 1;
			// let messagesRequestThread = new CometChat.MessagesRequestBuilder()
			// 	.setLimit(limit)
			// 	.setParentMessageId(parentMessageId)
			// 	.build();
				
			// 	messagesRequestThread.fetchPrevious().then(
			// 	messages => {
			// 		console.log("Messages for thread fetched successfully", messages);
			// 	}, error => {
			// 		console.log("Message fetching failed with error:", error);
			// 	}
			// );
		}
	}

	render() {
		// console.log('threads = ', this.state.threadMessages);
		if(this.state.threadMessages.length == 0) {this.getThreads(); console.log('hello world');}

		return (
			<React.Fragment>
                <div>Hello THis is Tread message</div>
			</React.Fragment>
		);
	}
}

// Specifies the default values for props:
GetThreadMessages.defaultProps = {
	theme: theme,
};

GetThreadMessages.propTypes = {
	theme: PropTypes.object,
};

// const mapStateToProps = state => {
// 	return {
// 	  loading: state.loading,
// 	  error: state.error,
// 	  isLoggedIn: state.isLoggedIn
// 	};
//   };
  
//   const mapDispatchToProps = dispatch => {
// 	return {
// 	  onLogout: () => dispatch(actions.logout())
// 	};
//   };
  
//   export default connect( mapStateToProps, mapDispatchToProps )( GetThreadMessages );

export { GetThreadMessages };
