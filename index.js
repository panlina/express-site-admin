import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

window.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(<Index />, document.body);
});

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			endpoint: "",
			proxyRule: undefined,
			proxyRuleLoading: false
		};
	}
	connect() {
		this.setState({ proxyRuleLoading: true });
		axios.get(`${this.state.endpoint}/proxy-rule`).then(response => {
			this.setState({ proxyRule: response.data });
			this.setState({ proxyRuleLoading: false });
		}, error => {
			this.setState({ proxyRule: error });
			this.setState({ proxyRuleLoading: false });
		});
	}
	render() {
		var { proxyRule, proxyRuleLoading } = this.state;
		return <>
			<form onSubmit={e => { this.connect(); e.preventDefault(); }}>
				target: <input value={this.state.endpoint} onChange={e => { this.setState({ endpoint: e.target.value }); }}></input>
				<button>connect</button>
			</form>
			<section>
				<h4>proxy rules</h4>
				<p>{proxyRuleLoading && "loading..."}</p>
				{proxyRule && (
					proxyRule instanceof Error ?
						`error: ${proxyRule.response && proxyRule.response.data || proxyRule.message}` :
						Object.entries(proxyRule).length ?
							<table>{
								Object.entries(proxyRule)
									.map(([name, value]) => <tr key={name}>
										<td>{name}</td>
										<td>{value}</td>
									</tr>)
							}</table> :
							"(no proxy rules)"
				)}
			</section>
		</>;
	}
}
